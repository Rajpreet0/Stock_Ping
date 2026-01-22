import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mail/nodemailer";
import { getMostActiveStocks } from "@/lib/stocks/stock-api";
import { generateStockEmailTemplate } from "@/lib/mail/stock-email-template";
import { getAllEmails } from "@/lib/google-sheets/sheets";

export async function POST(request: NextRequest) {
    try {
        // Optional: Get single email from request body
        const body = await request.json().catch(() => ({}));
        const singleEmail = body.email;

        // Fetch the latest stock data
        const stocks = await getMostActiveStocks();

        if (!stocks || stocks.length === 0) {
            return NextResponse.json(
                { success: false, error: "No stock data available" },
                { status: 500 }
            );
        }

        // Filter only positive stocks
        const positiveStocks = stocks.filter(stock => stock.changesPercentage > 0);

        // Generate email HTML
        const emailHtml = generateStockEmailTemplate(positiveStocks);

        // Determine recipients
        let recipients: string[] = [];

        if (singleEmail) {
            // Send to single email
            recipients = [singleEmail];
        } else {
            // Send to all subscribers
            recipients = await getAllEmails();
        }

        if (recipients.length === 0) {
            return NextResponse.json(
                { success: false, error: "No recipients found" },
                { status: 400 }
            );
        }

        // Send emails to all recipients
        const results = await Promise.all(
            recipients.map(async (email) => {
                const result = await sendMail({
                    to: email,
                    subject: `📈 Stock Ping Daily Update - ${positiveStocks.length} positive Aktien mit dem meisten Volumen heute`,
                    html: emailHtml,
                });
                return { email, success: result.success };
            })
        );

        const successCount = results.filter(r => r.success).length;
        const failedCount = results.filter(r => !r.success).length;

        return NextResponse.json({
            success: true,
            message: `Emails sent successfully`,
            stats: {
                total: recipients.length,
                successful: successCount,
                failed: failedCount,
                positiveStocks: positiveStocks.length,
            },
            recipients: singleEmail ? [singleEmail] : undefined,
        });

    } catch (error) {
        console.error("Error sending stock emails:", error);
        return NextResponse.json(
            { success: false, error: "Failed to send stock emails" },
            { status: 500 }
        );
    }
}

// GET endpoint for testing/manual trigger
export async function GET() {
    try {
        const stocks = await getMostActiveStocks();
        const positiveStocks = stocks.filter(stock => stock.changesPercentage > 0);

        return NextResponse.json({
            success: true,
            message: "Stock data fetched successfully",
            positiveStocksCount: positiveStocks.length,
            positiveStocks: positiveStocks,
        });
    } catch (error) {
        console.error("Error fetching stocks:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch stocks" },
            { status: 500 }
        );
    }
}
