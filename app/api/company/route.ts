import { getCompanyInformation } from "@/lib/stocks/stock-api";
import { NextRequest, NextResponse } from "next/server";

/**
 * 
 * This API GET request will retrieve detail Company Information based
 * on the Ticker Symbol
 * 
 * @returns {Promise<CompanyInformation>} - Detail Information about a specific Company
 */
export async function GET(request: NextRequest) {
    try {
        const symbol = request.nextUrl.searchParams.get("symbol");

        if (!symbol) {
            return NextResponse.json(
                { success: false, error: "Missing required query parameter: symbol" },
                { status: 400 }
            );
        }

        const companyInformation = await getCompanyInformation(symbol);

        return NextResponse.json({
            success: true, 
            companyInformation: companyInformation
        }, 
        {
            status: 200
        });
    } catch (error) {
        console.error("Error fetching stocks:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch stocks" },
            { status: 500 }
        )
    }
}