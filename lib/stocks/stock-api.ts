import { CompanyInformation, Stock } from "@/types";

const STOCK_API_BASE_URL = "https://financialmodelingprep.com/stable";
const API_KEY = process.env.STOCK_API_KEY;

/**
 * Check if NASDAQ is currently open (German time: 15:30 - 22:00)
 * NASDAQ trading hours: 9:30 AM - 4:00 PM ET (15:30 - 22:00 German time)
 */
export function isNasdaqOpen(): boolean {
    const now = new Date();

    // Get current time in German timezone
    const germanTime = new Intl.DateTimeFormat("de-DE", {
        timeZone: "Europe/Berlin",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        weekday: "short"
    }).formatToParts(now);

    const weekday = germanTime.find(p => p.type === "weekday")?.value || "";
    const hour = Number(germanTime.find(p => p.type === "hour")?.value || 0);
    const minute = Number(germanTime.find(p => p.type === "minute")?.value || 0);

    // Check if it's a weekday (Mon-Fri)
    const isWeekday = weekday !== "" && !["Sa.", "So."].includes(weekday);

    // Check if within trading hours (15:30 - 22:00 German time)
    const isWithinTradingHours =
        (hour === 15 && minute >= 30) ||
        (hour > 15 && hour < 22) ||
        (hour === 22 && minute === 0);

    return Boolean(isWeekday && isWithinTradingHours);
}

/**
 * Fetch most active stocks from the Financial Modeling Prep API
 * Returns all stocks sorted by percentage change
 * Uses dynamic fetching with cache control based on trading hours
 */
export async function getMostActiveStocks(): Promise<Stock[]> {
    try {
        if (!API_KEY) {
            throw new Error("STOCK_API_KEY is not defined in environment variables");
        }

        const url = `${STOCK_API_BASE_URL}/most-actives?apikey=${API_KEY}`;

        // Dynamic cache control based on trading hours
        const isMarketOpen = isNasdaqOpen();
        const cacheTime = isMarketOpen ? 300 : 3600; // 5 minutes if open, 1 hour if closed

        const response = await fetch(url, {
            next: { revalidate: cacheTime },
            cache: 'no-store' // Disable static caching for dynamic updates
        });

        if (!response.ok) {
            throw new Error(`Stock API returned ${response.status}: ${response.statusText}`);
        }

        const data: Stock[] = await response.json();

        // Sort by changesPercentage in descending order
        const sorted = data.sort((a, b) => b.changesPercentage - a.changesPercentage);

        console.log(`Retrieved ${sorted.length} most active stocks (Market ${isMarketOpen ? 'OPEN' : 'CLOSED'})`);
        return sorted;
    } catch (error) {
        console.error("Error fetching stocks from API:", error);
        throw error;
    }
}

export async function getCompanyInformation(symbol: string): Promise<CompanyInformation> {
    try {
        
        if (!API_KEY) {
            throw new Error("STOCK_API_KEY is not defined in env. variables");
        }

        const url = `${STOCK_API_BASE_URL}/profile?symbol=${symbol}&apikey=${API_KEY}`;
        const cacheTime = 21600 // 6 hour

        const response = await fetch(url, {
            next: { revalidate: cacheTime },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`Stock API returned ${response.status}: ${response.statusText}`);
        }

        const data: CompanyInformation[] = await response.json();

        return data[0];
    } catch (error) {
        console.error("Error fetching company information from API:", error);
        throw error;
    }
}
