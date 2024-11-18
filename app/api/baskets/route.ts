import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Token } from "@/lib/types";

const GECKO_TERMINAL_URL =
    "https://api.geckoterminal.com/api/v2/networks/solana/tokens/multi";

export async function GET() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("baskets")
        .select(
            "*, basket_tokens(address, allocation, tokens(symbol, name, image_url))"
        );

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const transformedData = data.map((basket) => ({
        ...basket,
        tokens: basket.basket_tokens.map((bt: any) => ({
            address: bt.address,
            allocation: bt.allocation,
            symbol: bt.tokens.symbol,
            name: bt.tokens.name,
            image_url: bt.tokens.image_url,
        })), // Flatten the basket_tokens
    }));

    // Remove the original `basket_tokens` property
    transformedData.forEach((basket) => {
        delete basket.basket_tokens;
    });

    return NextResponse.json(transformedData);
}

export async function POST(req: Request) {
    const { name, rebalance_interval, addresses } = await req.json();
    const supabase = await createClient();

    // Fetch token data from GeckoTerminal
    const tokenData = await fetch(
        `${GECKO_TERMINAL_URL}/${addresses.join(",")}`,
        {
            headers: { Accept: "application/json" },
        }
    ).then((res) => res.json());

    if (!tokenData?.data) {
        return NextResponse.json(
            { error: "Failed to fetch token data" },
            { status: 400 }
        );
    }

    // Insert or update tokens in the database
    const tokens: Token[] = tokenData.data.map((token: any) => ({
        address: token.attributes.address,
        name: token.attributes.name,
        symbol: token.attributes.symbol,
        total_supply: token.attributes.total_supply,
        image_url: token.attributes.image_url,
        price: parseFloat(token.attributes.price_usd || "0"),
    }));

    for (const token of tokens) {
        await supabase.from("tokens").upsert({
            address: token.address,
            name: token.name,
            symbol: token.symbol,
            total_supply: token.total_supply,
            image_url: token.image_url,
        });
    }

    const totalPrice = tokens.reduce(
        (sum: number, token: Token) => sum + token.price,
        0
    );
    // Step 1: Calculate weights (inverse price allocations)
    const weights = tokens.map((token: Token) => ({
        address: token.address,
        weight: totalPrice / token.price, // Inverse of price
    }));

    // Step 2: Calculate the sum of all weights
    const totalWeight = weights.reduce((sum, token) => sum + token.weight, 0);

    // Step 3: Normalize weights to percentages
    const tokenAllocations = weights.map((token) => ({
        address: token.address,
        allocation: token.weight / totalWeight, // Convert to percentage
    }));

    console.log(tokenAllocations);

    // Insert basket into the database
    const { data: basket, error: basketError } = await supabase
        .from("baskets")
        .insert({ name, rebalance_interval })
        .select("*")
        .single();

    if (basketError) {
        return NextResponse.json(
            { error: basketError.message },
            { status: 400 }
        );
    }

    console.log("tokenAllocations", tokenAllocations);
    // Insert basket tokens
    for (const tokenAllocation of tokenAllocations) {
        await supabase.from("basket_tokens").insert({
            basket_id: basket.id,
            address: tokenAllocation.address,
            allocation: tokenAllocation.allocation,
        });
    }

    return NextResponse.json(basket, { status: 201 });
}
