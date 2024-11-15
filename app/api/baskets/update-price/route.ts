import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

async function calculateBasketPrice(basketId: string) {
    const supabase = await createClient();

    const { data: tokens } = await supabase
        .from("basket_tokens")
        .select("address, allocation")
        .eq("basket_id", basketId);

    let basketPrice = 0;

    for (const token of tokens || []) {
        const { data: priceData } = await supabase
            .from("token_prices")
            .select("price")
            .eq("address", token.address)
            .order("timestamp", { ascending: false })
            .limit(1);

        const tokenPrice = priceData?.[0]?.price || 0;
        basketPrice += token.allocation * tokenPrice;
    }

    await supabase
        .from("basket_prices")
        .insert({ basket_id: basketId, price: basketPrice });
}

export async function GET() {
    const supabase = await createClient();

    const { data: baskets } = await supabase.from("baskets").select("id");
    for (const basket of baskets || []) {
        await calculateBasketPrice(basket.id);
    }

    return NextResponse.json({ message: "Basket prices updated" });
}
