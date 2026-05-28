import { NextRequest, NextResponse } from "next/server";
import { saveStockSnapshot } from "@/lib/google-sheets/sheets";

export async function GET(request: NextRequest) {
    const secretFromQuery = request.nextUrl.searchParams.get("secret");
    if (secretFromQuery !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
