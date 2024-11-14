// app/api/baskets/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("baskets")
        .select("*, basket_tokens(*)");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const transformedData = data.map((basket) => ({
        ...basket,
        tokens: basket.basket_tokens, // Rename `basket_tokens` to `tokens`
    }));

    // Remove the original `basket_tokens` property
    transformedData.forEach((basket) => {
        delete basket.basket_tokens;
    });

    return NextResponse.json(transformedData);
}

export async function POST(req: Request) {
    const { name, rebalance_interval } = await req.json();
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("baskets")
        .insert([{ name, rebalance_interval }])
        .select("*")
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
}
