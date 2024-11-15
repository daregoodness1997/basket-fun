import { Basket, BasketToken } from "@/lib/types";
import { camelCaseKeys } from "@/utils/casing";
import { useEffect, useState } from "react";

export function useBaskets() {
    const [baskets, setBaskets] = useState<Basket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBaskets = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/baskets");
                if (!response.ok) {
                    throw new Error("Failed to fetch baskets");
                }
                const data = await response.json();

                // Convert the response to camelCase
                const camelCasedData = camelCaseKeys(data);
                setBaskets(camelCasedData);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBaskets();
    }, []);

    const addBasket = async (
        newBasket: Omit<Basket, "id" | "createdAt" | "tokens"> & {
            tokens: Omit<BasketToken, "id" | "basket_id">[];
        }
    ) => {
        try {
            // Step 1: Create the basket without tokens
            const { name, rebalanceInterval, tokens } = newBasket;
            const basketResponse = await fetch("/api/baskets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    rebalance_interval: rebalanceInterval,
                }),
            });

            if (!basketResponse.ok) {
                throw new Error("Failed to create basket");
            }

            const createdBasket = await basketResponse.json();

            // Step 2: Add tokens to the newly created basket using basket_id
            for (const token of tokens) {
                const floatAllocation =
                    parseFloat(token.allocation as any) / 100;
                await fetch("/api/baskets/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        basket_id: createdBasket.id,
                        symbol: token.symbol,
                        address: token.address,
                        allocation: floatAllocation,
                    }),
                });
            }

            const basket: Basket = { ...createdBasket, tokens };

            // Step 3: Fetch updated baskets list to reflect new addition
            setBaskets((prevBaskets: Basket[]) => [...prevBaskets, basket]);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const getBasketById = (id: string) => {
        return baskets.find((basket: Basket) => basket.id === id);
    };

    return { baskets, addBasket, getBasketById, loading, error };
}
