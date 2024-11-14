"use client";

import { useParams } from "next/navigation";
import { useBaskets } from "@/hooks/use-baskets";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function BasketDetails() {
    const params = useParams();
    const { getBasketById } = useBaskets();
    const basket = getBasketById(params.id as string);

    if (!basket) {
        return <Skeleton className="container py-10 w-screen max-w-2xl h-96" />;
    }

    return (
        <div className="container mx-auto py-10">
            <Button asChild className="mb-4">
                <Link href="/baskets">Back to Baskets</Link>
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle>{basket.name}</CardTitle>
                    <CardDescription>
                        Rebalance Interval: {basket.rebalanceInterval} days
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <h3 className="text-lg font-semibold mb-2">Tokens</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Symbol</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Allocation</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {basket.tokens.map((token, index) => (
                                <TableRow key={index}>
                                    <TableCell>{token.symbol}</TableCell>
                                    <TableCell>{token.address}</TableCell>
                                    <TableCell>
                                        {token.allocation * 100}%
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
