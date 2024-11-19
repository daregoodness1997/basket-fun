import { Basket } from "@/lib/types";
import { camelCaseKeys } from "@/utils/casing";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export function useBaskets() {
    const [baskets, setBaskets] = useState<Basket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

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

    const addBasket = async ({
        name,
        rebalanceInterval,
        addresses,
    }: {
        name: string;
        rebalanceInterval: number;
        addresses: string[];
    }) => {
        try {
            const response = await fetch("/api/baskets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    rebalance_interval: rebalanceInterval,
                    addresses,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create basket");
            }
            toast({
                title: "Success",
                description: "Your basket creation has succceeded.",
            });
        } catch (error: any) {
            setError(error.message);
        }
    };

    const getBasketById = (id: string) => {
        return baskets.find((basket: Basket) => basket.id === id);
    };

    return { baskets, addBasket, getBasketById, loading, error };
}
