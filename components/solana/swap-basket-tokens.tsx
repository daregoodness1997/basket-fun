"use client";

import React, { FC, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
    PublicKey,
    TransactionInstruction,
    AddressLookupTableAccount,
    TransactionMessage,
    VersionedTransaction,
} from "@solana/web3.js";
import { createJupiterApiClient } from "@jup-ag/api"; // Import Jupiter API client
import { Button } from "../ui/button";
import { Basket } from "@/lib/types";
import { Input } from "../ui/input";
import { sendBatchWithSingleSign } from "@/utils/solana/send-batch-with-single-sign";
import { useToast } from "@/hooks/use-toast";

export const JupiterBasketSwap: FC<{ basket: Basket }> = ({ basket }) => {
    const { connection } = useConnection();
    const { toast } = useToast();
    const { publicKey, signAllTransactions, sendTransaction } = useWallet();
    const [inputAmount, setInputAmount] = useState<string>(""); // Amount in SOL
    const [loading, setLoading] = useState<boolean>(false);
    const basketTokens = basket.tokens.map((token) => token.address);

    const getAddressLookupTableAccounts = async (
        keys: string[]
    ): Promise<AddressLookupTableAccount[]> => {
        const accountInfos = await connection.getMultipleAccountsInfo(
            keys.map((key) => new PublicKey(key))
        );

        return accountInfos.reduce(
            (acc: AddressLookupTableAccount[], info, i) => {
                if (info) {
                    acc.push(
                        new AddressLookupTableAccount({
                            key: new PublicKey(keys[i]),
                            state: AddressLookupTableAccount.deserialize(
                                info.data
                            ),
                        })
                    );
                }
                return acc;
            },
            []
        );
    };

    const onClick = async () => {
        if (!publicKey) {
            toast({ title: "Wallet not connected!" });
            return;
        }

        try {
            setLoading(true);
            const transactions: VersionedTransaction[] = [];

            const {
                value: { blockhash },
            } = await connection.getLatestBlockhashAndContext();

            const jupiterQuoteApi = createJupiterApiClient();

            const lamports = Math.floor(parseFloat(inputAmount) * 1e9); // Convert SOL to lamports

            for (const tokenAddress of basketTokens) {
                // Get a quote for the swap
                const quoteResponse = await jupiterQuoteApi.quoteGet({
                    inputMint: "So11111111111111111111111111111111111111112", // SOL mint
                    outputMint: tokenAddress,
                    amount: parseInt(
                        (lamports / basketTokens.length).toFixed(0)
                    ), // Split equally among tokens
                    slippageBps: 500, // 5% slippage
                    maxAccounts: 64,
                    restrictIntermediateTokens: true,
                });

                if (!quoteResponse) {
                    console.error("No route found for token:", tokenAddress);
                    continue;
                }

                // Generate swap instructions
                const swapInstructionsResponse =
                    await jupiterQuoteApi.swapInstructionsPost({
                        swapRequest: {
                            userPublicKey: publicKey.toString(),
                            quoteResponse,
                            dynamicComputeUnitLimit: true, // Set this to true to get the best optimized CU usage.
                            dynamicSlippage: {
                                // This will set an optimized slippage to ensure high success rate
                                maxBps: 500, // Make sure to set a reasonable cap here to prevent MEV
                            },
                            prioritizationFeeLamports: {
                                priorityLevelWithMaxLamports: {
                                    maxLamports: 10000000,
                                    priorityLevel: "veryHigh", // If you want to land transaction fast, set this to use `veryHigh`. You will pay on average higher priority fee.
                                },
                            },
                        },
                    });

                if (!swapInstructionsResponse) {
                    throw new Error(
                        `Failed to generate swap instructions for token: ${tokenAddress}`
                    );
                }

                // Convert Jupiter instructions to Solana-compatible instructions
                const deserialiseInstruction = (
                    instruction: any
                ): TransactionInstruction =>
                    new TransactionInstruction({
                        programId: new PublicKey(instruction.programId),
                        keys: instruction.accounts.map((account: any) => ({
                            pubkey: new PublicKey(account.pubkey),
                            isSigner: account.isSigner,
                            isWritable: account.isWritable,
                        })),
                        data: Buffer.from(instruction.data, "base64"),
                    });

                const {
                    computeBudgetInstructions,
                    setupInstructions,
                    swapInstruction,
                    cleanupInstruction,
                    addressLookupTableAddresses,
                } = swapInstructionsResponse;
                // Fetch and use Address Lookup Table accounts
                const lookupTableAccounts = await getAddressLookupTableAccounts(
                    addressLookupTableAddresses
                );

                // Create a versioned transaction
                const message = new TransactionMessage({
                    payerKey: publicKey,
                    recentBlockhash: blockhash,
                    instructions: [
                        ...computeBudgetInstructions.map(
                            deserialiseInstruction
                        ),
                        ...setupInstructions.map(deserialiseInstruction),
                        deserialiseInstruction(swapInstruction),
                        cleanupInstruction
                            ? deserialiseInstruction(cleanupInstruction)
                            : undefined,
                    ].filter(
                        (instruction): instruction is TransactionInstruction =>
                            instruction !== undefined
                    ),
                }).compileToV0Message(lookupTableAccounts);
                transactions.push(new VersionedTransaction(message));
            }

            await sendBatchWithSingleSign({
                connection,
                transactions,
                publicKey,
                signAllTransactions,
            });
        } catch (error: any) {
            console.error("Error during Jupiter basket swap:", error.message);
            toast({ title: "Failed to complete basket swap." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-x-2 py-2">
            <Input
                type="number"
                placeholder="Amount in SOL"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
            />
            <Button
                onClick={onClick}
                disabled={loading || !inputAmount || !basketTokens.length}
            >
                {loading ? "Swapping..." : "Swap Basket Tokens"}
            </Button>
        </div>
    );
};
