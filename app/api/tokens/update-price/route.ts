import { fetchMultiTokenPrices } from "@/utils/geckoterminal/fetch-multi-token";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();

    // Fetch token addresses from your database
    const { data: tokens, error } = await supabase
        .from("basket_tokens")
        .select("address");
    console.log("Tokens", tokens);

    if (error || !tokens) {
        return NextResponse.json(
            { error: error?.message || "No tokens found" },
            { status: 400 }
        );
    }

    // Filter out duplicate tokens
    const addresses = Array.from(new Set(tokens.map((token) => token.address)));
    console.log("Addresses", addresses);

    // Split addresses into batches of 30
    const batches = [];
    while (addresses.length) {
        batches.push(addresses.splice(0, 30));
    }

    for (const batch of batches) {
        const prices = await fetchMultiTokenPrices(batch);
        console.log("Prices", prices);

        for (const { address, price_usd, timestamp } of prices) {
            await supabase.from("token_prices").upsert({
                address: address,
                price: parseFloat(price_usd),
                timestamp: timestamp,
            });
        }
    }

    return NextResponse.json({ message: "Token prices updated successfully" });
}
