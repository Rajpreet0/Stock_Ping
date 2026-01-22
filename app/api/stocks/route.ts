import { NextResponse } from "next/server";
import { getMostActiveStocks } from "@/lib/stocks/stock-api";

export async function GET() {
    try {
        const stocks = await getMostActiveStocks();

        return NextResponse.json({
            success: true,
            count: stocks.length,
            stocks: stocks,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error fetching stocks:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch stocks" },
            { status: 500 }
        );
    }
}
