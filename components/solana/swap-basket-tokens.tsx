"use client";

import React, { FC, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
    Transaction,
    PublicKey,
    TransactionInstruction,
} from "@solana/web3.js";
import { createJupiterApiClient } from "@jup-ag/api"; // Import Jupiter API client
import { Button } from "../ui/button";
import { Basket } from "@/lib/types";
import { Input } from "../ui/input";
import { getTransactionSize } from "@/utils/solana/get-transaction-size";

export const JupiterBasketSwap: FC<{ basket: Basket }> = ({ basket }) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [inputAmount, setInputAmount] = useState<string>(""); // Amount in SOL
    const [loading, setLoading] = useState<boolean>(false);
    const basketTokens = basket.tokens.map((token) => token.address);

    const onClick = async () => {
        if (!publicKey) {
            alert("Wallet not connected!");
            return;
        }

        try {
            setLoading(true);

            const {
                context: { slot: minContextSlot },
                value: { blockhash, lastValidBlockHeight },
            } = await connection.getLatestBlockhashAndContext();

            const jupiterQuoteApi = createJupiterApiClient();

            const lamports = Math.floor(parseFloat(inputAmount) * 1e9); // Convert SOL to lamports

            const transaction = new Transaction();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            for (const tokenAddress of basketTokens) {
                // Get a quote for the swap
                const quoteResponse = await jupiterQuoteApi.quoteGet({
                    inputMint: "So11111111111111111111111111111111111111112", // SOL mint
                    outputMint: tokenAddress,
                    amount: lamports / basketTokens.length, // Split equally among tokens
                    slippageBps: 100, // 1% slippage
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
                        },
                    });

                if (!swapInstructionsResponse) {
                    throw new Error(
                        `Failed to generate swap instructions for token: ${tokenAddress}`
                    );
                }

                // Convert Jupiter instructions to Solana-compatible instructions
                const toTransactionInstruction = (
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
                } = swapInstructionsResponse;

                transaction.add(
                    ...computeBudgetInstructions.map(toTransactionInstruction)
                );
                transaction.add(
                    ...setupInstructions.map(toTransactionInstruction)
                );
                transaction.add(toTransactionInstruction(swapInstruction));
                if (cleanupInstruction) {
                    transaction.add(
                        toTransactionInstruction(cleanupInstruction)
                    );
                }
            }

            // Send the transaction
            const signature = await sendTransaction(transaction, connection, {
                minContextSlot,
            });
            await connection.confirmTransaction({
                blockhash,
                lastValidBlockHeight,
                signature,
            });

            alert(`Transaction successful! Signature: ${signature}`);
        } catch (error: any) {
            console.error("Error during Jupiter basket swap:", error.message);
            alert("Failed to complete basket swap. See console for details.");
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
