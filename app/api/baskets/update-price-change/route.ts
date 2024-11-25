import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

async function calculateBasketPrice(basketId: string) {
    const supabase = await createClient();

    // Fetch the latest basket price
    const { data: latestPriceData, error: latestPriceError } = await supabase
        .from("basket_prices")
        .select("price, timestamp")
        .eq("basket_id", basketId)
        .order("timestamp", { ascending: false })
        .limit(1);

    if (latestPriceError || !latestPriceData?.length) {
        console.error(
            "Error fetching latest basket price:",
            latestPriceError?.message
        );
        return;
    }

    const latestPrice = latestPriceData[0].price;
    const currentTimestamp = new Date().getTime();

    // Fetch historical prices
    const { data: historicalPrices, error: historicalError } = await supabase
        .from("basket_prices")
        .select("price, timestamp")
        .eq("basket_id", basketId)
        .order("timestamp", { ascending: false });
    const { data: initialPrice, error: initialError } = await supabase
        .from("basket_prices")
        .select("price, timestamp")
        .eq("basket_id", basketId)
        .order("timestamp", { ascending: true })
        .limit(1);

    if (historicalError) {
        console.error(
            "Error fetching historical basket prices:",
            historicalError.message
        );
        return;
    }

    // Find prices closest to desired intervals
    const price1hAgo =
        historicalPrices.find(
            (p) => currentTimestamp - new Date(p.timestamp).getTime() >= 3600000
        )?.price ||
        historicalPrices.at(-1)?.price ||
        latestPrice;

    const price4hAgo =
        historicalPrices.find(
            (p) =>
                currentTimestamp - new Date(p.timestamp).getTime() >=
                4 * 3600000
        )?.price ||
        historicalPrices.at(-1)?.price ||
        latestPrice;

    const price24hAgo =
        historicalPrices.find(
            (p) =>
                currentTimestamp - new Date(p.timestamp).getTime() >=
                24 * 3600000
        )?.price ||
        historicalPrices.at(-1)?.price ||
        latestPrice;
    const priceSinceCreation =
        initialPrice?.at(0)?.price ||
        historicalPrices.at(-1)?.price ||
        latestPrice;

    // Calculate percentage changes
    const price1hChange = ((latestPrice - price1hAgo) / price1hAgo) * 100 || 0;
    const price4hChange = ((latestPrice - price4hAgo) / price4hAgo) * 100 || 0;
    const price24hChange =
        ((latestPrice - price24hAgo) / price24hAgo) * 100 || 0;
    const priceSinceCreationChange =
        ((latestPrice - priceSinceCreation) / priceSinceCreation) * 100 || 0;

    // Update or insert the current basket price and changes
    await supabase
        .from("baskets")
        .update({
            current_price: latestPrice,
            price_1h_change: price1hChange,
            price_4h_change: price4hChange,
            price_24h_change: price24hChange,
            price_since_creation_change: priceSinceCreationChange,
        })
        .eq("id", basketId);
}

export async function GET() {
    const supabase = await createClient();

    // Fetch all baskets
    const { data: baskets, error } = await supabase
        .from("baskets")
        .select("id");

    if (error || !baskets) {
        return NextResponse.json(
            { error: "Error fetching baskets" },
            { status: 500 }
        );
    }

    // Update prices for all baskets
    await Promise.all(baskets.map((basket) => calculateBasketPrice(basket.id)));

    return NextResponse.json({ message: "Basket prices change updated" });
}
