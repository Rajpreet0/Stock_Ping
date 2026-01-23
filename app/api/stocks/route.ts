import { NextResponse } from "next/server";
import { getMostActiveStocks, isNasdaqOpen } from "@/lib/stocks/stock-api";

// Disable static optimization for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const marketOpen = isNasdaqOpen();
        const stocks = await getMostActiveStocks();

        return NextResponse.json({
            success: true,
            count: stocks.length,
            stocks: stocks,
            lastUpdated: new Date().toISOString(),
            marketOpen: marketOpen
        }, {
            headers: {
                'Cache-Control': marketOpen
                    ? 'public, s-maxage=300, stale-while-revalidate=60'  // 5 min cache when market open
                    : 'public, s-maxage=3600, stale-while-revalidate=300' // 1 hour cache when market closed
            }
        });
    } catch (error) {
        console.error("Error fetching stocks:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch stocks" },
            { status: 500 }
        );
    }
}
