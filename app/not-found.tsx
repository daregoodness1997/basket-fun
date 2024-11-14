"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBasket, AlertCircle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-5">
            <motion.div
                className="text-primary mb-8"
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
                <ShoppingBasket size={64} />
            </motion.div>
            <div>
                <h1 className="text-4xl font-bold text-center mb-4">
                    404 - Basket Not Found
                </h1>
            </div>
            <div>
                <p className="text-xl text-muted-foreground text-center mb-8 max-w-md">
                    Oops! It seems the basket you're looking for has gone
                    missing. Let's get you back on track.
                </p>
            </div>
            <div className="flex items-center justify-center space-x-4">
                <Button asChild size="lg">
                    <Link href="/">
                        <ShoppingBasket className="mr-2 h-4 w-4" /> Return to
                        Home
                    </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/baskets">
                        <AlertCircle className="mr-2 h-4 w-4" /> View All
                        Baskets
                    </Link>
                </Button>
            </div>
        </div>
    );
}
