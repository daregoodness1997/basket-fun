import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const { feature_id } = await req.json();
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("increment_votes", {
        feature_id,
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
}
