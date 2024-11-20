"use client";

import React, { FC } from "react";
import {
    WalletMultiButton,
    WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

export const SolanaWallet: FC = () => {
    return (
        <div className="flex items-center space-x-4">
            <WalletMultiButton />
            <WalletDisconnectButton />
        </div>
    );
};
