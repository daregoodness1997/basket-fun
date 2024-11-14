// app/api/basket_tokens/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// POST - Add a token to a basket
export async function POST(req: Request) {
    const supabase = await createClient();
    const { basket_id, symbol, address, allocation } = await req.json();

    const { data, error } = await supabase
        .from("basket_tokens")
        .insert([{ basket_id, symbol, address, allocation }])
        .select("*")
        .select("*"); // Return the inserted row data

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
}

// GET - Get all tokens for a specific basket
export async function GET(req: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const basket_id = searchParams.get("basket_id");

    if (!basket_id) {
        return NextResponse.json(
            { error: "Missing basket_id parameter" },
            { status: 400 }
        );
    }

    const { data, error } = await supabase
        .from("basket_tokens")
        .select("*")
        .eq("basket_id", basket_id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
}
