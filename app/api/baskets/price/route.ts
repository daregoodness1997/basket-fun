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

    const { data: basketPrices, error } = await supabase
        .from("basket_prices")
        .select("timestamp, price")
        .eq("basket_id", basketId)
        .order("timestamp", { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(basketPrices);
}
