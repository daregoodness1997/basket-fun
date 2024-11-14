// pages/api/baskets.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/server";

// POST - Create a new basket
// GET - Get all baskets
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const supabase = await createClient();
    if (req.method === "POST") {
        const { basket_name, rebalance_interval } = req.body;
        const { data, error } = await supabase
            .from("baskets")
            .insert([{ basket_name, rebalance_interval }])
            .single();

        if (error) return res.status(400).json({ error: error.message });
        return res.status(201).json(data);
    }

    if (req.method === "GET") {
        const { data, error } = await supabase.from("baskets").select("*");
        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json(data);
    }

    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
