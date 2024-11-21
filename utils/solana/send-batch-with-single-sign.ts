"use client";
import {
    Connection,
    PublicKey,
    Transaction,
    VersionedTransaction,
} from "@solana/web3.js";

export async function sendBatchWithSingleSign({
    connection,
    transactions,
    signAllTransactions,
}: {
    connection: Connection;
    transactions: VersionedTransaction[];
    publicKey: PublicKey; // Replace with your wallet adapter type
    signAllTransactions:
        | (<T extends Transaction | VersionedTransaction>(
              transactions: T[]
          ) => Promise<T[]>)
        | undefined;
}) {
    try {
        if (!signAllTransactions) {
            throw new Error("No signAllTransactions function provided");
        }
        // Prepare all transactions with blockhash and fee payer
        const {
            value: { blockhash, lastValidBlockHeight },
        } = await connection.getLatestBlockhashAndContext();

        // Request user to sign all transactions at once
        const signedTransactions = await signAllTransactions(transactions);

        // Send and confirm transactions
        for (const signedTransaction of signedTransactions) {
            const signature = await connection.sendRawTransaction(
                signedTransaction.serialize()
            );
            await connection.confirmTransaction({
                blockhash,
                lastValidBlockHeight,
                signature,
            });
            console.log("Transaction confirmed:", signature);
        }
    } catch (error) {
        console.error("Error sending batch transactions:", error);
    }
}
