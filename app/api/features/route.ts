import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Get all features
export async function GET() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("feature_requests")
        .select("*")
        .order("votes", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
}

// Add a new feature
export async function POST(req: Request) {
    const { title, description } = await req.json();
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("feature_requests")
        .insert([{ title, description }])
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
}
