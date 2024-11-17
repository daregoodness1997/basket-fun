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
import PriceChange from "@/components/percentage-price-change";

export default function BasketsTable() {
    const { baskets, loading, error } = useBaskets();

    if (loading) return <SkeletonTable columns={5} />;
    if (error) return <p>Error: {error}</p>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Basket Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>1H Change</TableHead>
                    <TableHead>4H Change</TableHead>
                    <TableHead>24H Change</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {baskets.map((basket: Basket) => (
                    <TableRow key={basket.id}>
                        <TableCell>{basket.name}</TableCell>
                        <TableCell>${basket.currentPrice.toFixed(2)}</TableCell>
                        <TableCell>
                            <PriceChange change={basket.price1hChange} />
                        </TableCell>
                        <TableCell>
                            <PriceChange change={basket.price4hChange} />
                        </TableCell>
                        <TableCell>
                            <PriceChange change={basket.price24hChange} />
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
