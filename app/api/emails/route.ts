import { NextResponse } from "next/server";
import { getAllEmails } from "@/lib/google-sheets/sheets";

export async function GET() {
    try {
        const emails = await getAllEmails();

        return NextResponse.json({
            success: true,
            count: emails.length,
            emails: emails
        });
    } catch (error) {
        console.error("Error fetching emails:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch emails" },
            { status: 500 }
        );
    }
}
