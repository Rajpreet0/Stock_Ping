import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mail/nodemailer";
import { getMostActiveStocks } from "@/lib/stocks/stock-api";
import { generateStockEmailTemplate } from "@/lib/mail/stock-email-template";
import { getAllEmails, saveStockSnapshot } from "@/lib/google-sheets/sheets";
import { StockSnapshot } from "@/types";

/**
 * Cron Job API Endpoint
 *
 * This endpoint should be called by an external cron service (e.g., cron-job.org)
 * to send daily stock emails to all subscribers.
 *
 * Security: Requires CRON_SECRET in Authorization header or query parameter
 */
export async function GET(request: NextRequest) {
    try {
        // Security check: Verify the cron secret
        const authHeader = request.headers.get("authorization");
        const secretFromQuery = request.nextUrl.searchParams.get("secret");
        const providedSecret = authHeader?.replace("Bearer ", "") || secretFromQuery;

        const cronSecret = process.env.CRON_SECRET;

        if (!cronSecret) {
            console.error("CRON_SECRET is not configured in environment variables");
            return NextResponse.json(
                { success: false, error: "Cron job not configured" },
                { status: 500 }
            );
        }

        if (providedSecret !== cronSecret) {
            console.warn("Unauthorized cron job attempt");
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        console.log("Starting daily stock email cron job...");

        // Fetch the latest stock data
        const stocks = await getMostActiveStocks();

        if (!stocks || stocks.length === 0) {
            console.error("No stock data available");
            return NextResponse.json(
                { success: false, error: "No stock data available" },
                { status: 500 }
            );
        }

        // Filter only positive stocks
        const positiveStocks = stocks.filter(stock => stock.changesPercentage > 0);
        console.log(`Found ${positiveStocks.length} positive stocks`);

        // Save daily snapshot of all active stocks to StockHistory sheet
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const snapshots: StockSnapshot[] = stocks.map(stock => ({
            date: today,
            symbol: stock.symbol,
            name: stock.name,
            price: stock.price,
            change: stock.change,
            changesPercentage: stock.changesPercentage,
        }));
        let snapshotsSaved = 0;
        try {
            await saveStockSnapshot(snapshots);
            snapshotsSaved = snapshots.length;
        } catch (snapshotError) {
            console.error("Failed to save stock snapshots to StockHistory sheet:", snapshotError);
        }

        // Generate email HTML
        const emailHtml = generateStockEmailTemplate(positiveStocks);

        // Get all subscribers
        const recipients = await getAllEmails();

        if (recipients.length === 0) {
            console.log("No subscribers found");
            return NextResponse.json(
                { success: true, message: "No subscribers to send emails to", stats: { total: 0 } }
            );
        }

        console.log(`Sending emails to ${recipients.length} subscribers...`);

        // Send emails to all recipients
        const results = await Promise.all(
            recipients.map(async (email) => {
                try {
                    const result = await sendMail({
                        to: email,
                        subject: `📈 Stock Ping Daily Update - ${positiveStocks.length} positive Aktien mit dem meisten Volumen heute`,
                        html: emailHtml,
                    });
                    return { email, success: result.success };
                } catch (error) {
                    console.error(`Failed to send email to ${email}:`, error);
                    return { email, success: false };
                }
            })
        );

        const successCount = results.filter(r => r.success).length;
        const failedCount = results.filter(r => !r.success).length;

        console.log(`Cron job completed: ${successCount} successful, ${failedCount} failed`);

        return NextResponse.json({
            success: true,
            message: "Daily stock emails sent successfully",
            stats: {
                total: recipients.length,
                successful: successCount,
                failed: failedCount,
                positiveStocks: positiveStocks.length,
                snapshotsSaved,
            },
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error("Cron job error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to execute cron job" },
            { status: 500 }
        );
    }
}

// POST method for alternative calling
export async function POST(request: NextRequest) {
    return GET(request);
}