// pages/api/baskets/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/server";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;
    const supabase = await createClient();

    if (req.method === "GET") {
        const { data, error } = await supabase
            .from("baskets")
            .select("*")
            .eq("basket_id", id as string)
            .single();

        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json(data);
    }

    if (req.method === "PUT") {
        const { basket_name, rebalance_interval } = req.body;
        const { data, error } = await supabase
            .from("baskets")
            .update({ basket_name, rebalance_interval })
            .eq("basket_id", id as string)
            .single();

        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json(data);
    }

    if (req.method === "DELETE") {
        const { error } = await supabase
            .from("baskets")
            .delete()
            .eq("basket_id", id as string);
        if (error) return res.status(400).json({ error: error.message });
        return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
