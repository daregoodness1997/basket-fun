import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const basketId = url.searchParams.get("basketId");

    if (!basketId) {
        return NextResponse.json(
            { error: "basketId is required" },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    let allBasketPrices: any = [];
    let start = 0;
    const batchSize = 1000;

    while (true) {
        const { data: batch, error } = await supabase
            .from("basket_prices")
            .select("timestamp, price")
            .eq("basket_id", basketId)
            .order("timestamp", { ascending: true })
            .range(start, start + batchSize - 1); // Fetch rows in batches

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        if (!batch || batch.length === 0) {
            break; // No more data to fetch
        }

        allBasketPrices = allBasketPrices.concat(batch);
        start += batchSize;

        if (batch.length < batchSize) {
            break; // Last batch fetched
        }
    }

    return NextResponse.json(allBasketPrices);
}
