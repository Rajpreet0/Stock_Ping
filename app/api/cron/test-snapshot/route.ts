import { NextResponse } from "next/server";
import { saveStockSnapshot } from "@/lib/google-sheets/sheets";

export async function GET() {
    try {
        await saveStockSnapshot([{
            date: new Date().toISOString().split("T")[0],
            symbol: "TEST",
            name: "Test Stock",
            price: 123.45,
            change: 1.23,
            changesPercentage: 1.01,
        }]);
        return NextResponse.json({ success: true, message: "Test snapshot saved" });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error),
        }, { status: 500 });
    }
}
