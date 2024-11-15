const BASE_URL =
    "https://api.geckoterminal.com/api/v2/networks/solana/tokens/multi";

interface TokenPrice {
    address: string;
    price_usd: string;
    timestamp: string; // Added timestamp field
}

export async function fetchMultiTokenPrices(
    addresses: string[]
): Promise<TokenPrice[]> {
    if (addresses.length > 30) {
        throw new Error("Maximum 30 addresses allowed per request.");
    }

    const url = `${BASE_URL}/${addresses.join(",")}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch token prices: ${response.statusText}`);
    }

    // Extract the 'date' header
    const responseDate = response.headers.get("date");
    const timestamp = responseDate
        ? new Date(responseDate).toISOString()
        : new Date().toISOString();

    const data = await response.json();

    return data.data.map((token: any) => ({
        address: token.attributes.address,
        price_usd: token.attributes.price_usd,
        timestamp, // Assign the timestamp from the header
    }));
}
