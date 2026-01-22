export interface Stock {
    symbol: string;
    price: number;
    name: string;
    change: number;
    changesPercentage: number;
    exchange: string;
}

const STOCK_API_BASE_URL = "https://financialmodelingprep.com/stable";
const API_KEY = process.env.STOCK_API_KEY;

/**
 * Fetch most active stocks from the Financial Modeling Prep API
 * Returns all stocks sorted by percentage change
 * Cached for 6 hours (21600 seconds)
 */
export async function getMostActiveStocks(): Promise<Stock[]> {
    try {
        if (!API_KEY) {
            throw new Error("STOCK_API_KEY is not defined in environment variables");
        }

        const url = `${STOCK_API_BASE_URL}/most-actives?apikey=${API_KEY}`;

        const response = await fetch(url, {
            next: { revalidate: 21600 } // Cache for 6 hours
        });

        if (!response.ok) {
            throw new Error(`Stock API returned ${response.status}: ${response.statusText}`);
        }

        const data: Stock[] = await response.json();

        // Sort by changesPercentage in descending order
        const sorted = data.sort((a, b) => b.changesPercentage - a.changesPercentage);

        console.log(`Retrieved ${sorted.length} most active stocks`);
        return sorted;
    } catch (error) {
        console.error("Error fetching stocks from API:", error);
        throw error;
    }
}
