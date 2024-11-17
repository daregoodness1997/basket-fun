"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { useEffect } from "react";

export default function AnimatedHero() {
    const tokens = ["GOAT", "PNUT", "SOL", "WIF", "SCF", "DOGE"];
    useEffect(() => {
        const updatePrices = async () => {
            await fetch("/api/baskets/token-price");
            await fetch("/api/baskets/update-price");
        };
        updatePrices;
    });

    return (
        <div className="w-full py-12 flex flex-col items-center justify-center">
            <motion.div
                className="relative w-32 h-32 mb-8"
                initial={{ rotate: -10 }}
                animate={{ rotate: 10 }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
            >
                <ShoppingBasket className="w-full h-full text-primary" />
                {tokens.map((token, index) => (
                    <motion.div
                        key={token}
                        className="absolute top-0 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-bold"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: [null, 0, 20], opacity: [0, 1, 0] }}
                        transition={{
                            duration: 2,
                            delay: index * 0.5,
                            repeat: Infinity,
                            repeatDelay: tokens.length * 0.5,
                        }}
                    >
                        {token}
                    </motion.div>
                ))}
            </motion.div>
            <motion.h1
                className="text-4xl md:text-5xl font-bold text-center mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                BasketFi
            </motion.h1>
            <motion.p
                className="text-xl text-muted-foreground text-center mb-8 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                Effortlessly create and manage your token baskets with our
                intuitive platform.
            </motion.p>
            <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Button asChild size="lg">
                    <Link href="/baskets">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/about">Learn More</Link>
                </Button>
            </motion.div>
        </div>
    );
}
