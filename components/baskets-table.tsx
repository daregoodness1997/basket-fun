"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useBaskets } from "@/hooks/use-baskets";
import { Basket } from "@/lib/types";
import SkeletonTable from "./skeleton-table";

export default function BasketsTable() {
    const { baskets, loading, error } = useBaskets();

    if (loading) return <SkeletonTable columns={4} />;
    if (error) return <p>Error: {error}</p>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Basket Name</TableHead>
                    <TableHead>Rebalance Interval</TableHead>
                    <TableHead>Number of Tokens</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {baskets.map((basket: Basket) => (
                    <TableRow key={basket.id}>
                        <TableCell>{basket.name}</TableCell>
                        <TableCell>{basket.rebalanceInterval} days</TableCell>
                        <TableCell>
                            {basket.tokens && basket.tokens.length}
                        </TableCell>
                        <TableCell>
                            <Button asChild>
                                <Link href={`/baskets/${basket.id}`}>
                                    View Details
                                </Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
