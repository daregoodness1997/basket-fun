// pages/api/basket_tokens.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/server";

// POST - Add a token to a basket
// GET - Get all tokens for a specific basket
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const supabase = await createClient();
    if (req.method === "POST") {
        const { basket_id, token_symbol, token_address, allocation } = req.body;

        const { data, error } = await supabase
            .from("basket_tokens")
            .insert([{ basket_id, token_symbol, token_address, allocation }]);

        if (error) return res.status(400).json({ error: error.message });
        return res.status(201).json(data);
    }

    if (req.method === "GET") {
        const { basket_id } = req.query;
        const { data, error } = await supabase
            .from("basket_tokens")
            .select("*")
            .eq("basket_id", basket_id as string);

        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json(data);
    }

    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
