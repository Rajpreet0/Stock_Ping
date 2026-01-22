import { NextResponse } from "next/server";
import { testEmail } from "@/lib/mail/test-mail";

export async function POST() {
    // Only allow in development mode
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json(
            { error: "Test mail is only available in development mode" },
            { status: 403 }
        );
    }

    try {
        await testEmail();
        return NextResponse.json({ success: true, message: "Test mail sent successfully" });
    } catch (error) {
        console.error("Test mail error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to send test mail" },
            { status: 500 }
        );
    }
}
