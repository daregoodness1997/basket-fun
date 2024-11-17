"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { ShoppingBasket, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-5xl flex items-center p-3 px-5 text-sm">
                <div className="flex items-center justify-between w-full">
                    {/* Left Section */}
                    <div className="flex items-center gap-5">
                        <ThemeSwitcher />
                        <Link
                            href={"/"}
                            className="flex items-center hover:bg-accent hover:text-accent-foreground p-2 rounded"
                        >
                            <ShoppingBasket className="stroke-primary" />
                            <span className="ml-2 text-primary hidden sm:block">
                                BasketFi.xyz
                            </span>
                        </Link>
                    </div>

                    <div className="flex gap-5 items-center">
                        <Link href={"/baskets"}>
                            <Button>See Baskets</Button>
                        </Link>
                        <Link href={"/feature-request"}>
                            <Button variant="secondary">Feature Request</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
