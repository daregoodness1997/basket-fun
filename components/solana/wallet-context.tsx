"use client";

import React, { FC, ReactNode, useMemo } from "react";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import "@/styles/solana-adapter.css";

// Define a context for wallet actions

export const WalletContextProvider: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const network = WalletAdapterNetwork.Mainnet;

    // RPC endpoint
    // const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), [network]);
    // console.log("endpoint", endpoint);
    // Read endpoint from environment
    const endpoint =
        process.env.NEXT_PUBLIC_MAINNET_SOLANA_RPC ||
        clusterApiUrl("mainnet-beta");
    console.log("endpoint", endpoint);

    // Wallet adapters
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new LedgerWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
