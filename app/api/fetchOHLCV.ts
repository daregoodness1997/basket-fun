// import { createClient } from "@/utils/supabase/server";

// export default async function handler(req, res) {
//     const supabase = await createClient();
//     // Define the tokens you need to fetch
//     const tokens = await supabase
//         .from("basket_tokens")
//         .select("token_address, token_symbol");

//     const promises = tokens?.data.map(async (token) => {
//         const response = await fetch(
//             `https://api.geckoterminal.com/networks/eth/pools/${token.token_address}/ohlcv/day`
//         );
//         const data = await response.json();

//         // Process and store data in Supabase
//         if (data && data.ohlcv) {
//             const latestOHLCV = data.ohlcv[0];
//             await supabase.from("token_prices").upsert({
//                 token_symbol: token.token_symbol,
//                 price: latestOHLCV.close,
//                 volume: latestOHLCV.volume,
//                 timestamp: latestOHLCV.timestamp,
//             });

//             await supabase.from("token_history").insert({
//                 token_symbol: token.token_symbol,
//                 open: latestOHLCV.open,
//                 high: latestOHLCV.high,
//                 low: latestOHLCV.low,
//                 close: latestOHLCV.close,
//                 volume: latestOHLCV.volume,
//                 timestamp: latestOHLCV.timestamp,
//             });
//         }
//     });

//     await Promise.all(promises);
//     res.status(200).json({ message: "Data updated" });
// }
