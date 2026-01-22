import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mail/nodemailer";
import { addEmail, emailExists } from "@/lib/google-sheets/sheets";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { error: "Valid email is required" },
                { status: 400 }
            );
        }

        // Check if email already exists in Google Sheets
        const exists = await emailExists(email);
        if (exists) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Email already subscribed",
                    alreadySubscribed: true,
                    email: email
                },
                { status: 409 }
            );
        }

        // Add email to Google Sheets
        const addedToSheet = await addEmail(email);
        if (!addedToSheet) {
            return NextResponse.json(
                { success: false, error: "Failed to add email to database" },
                { status: 500 }
            );
        }

        // Send subscription confirmation email
        const result = await sendMail({
            to: email,
            subject: "Welcome to Stock Ping!",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2563eb;">Welcome to Stock Ping!</h1>
                    <p>Thank you for subscribing to our daily stock updates.</p>
                    <p>You will receive the top-performing stocks directly in your inbox.</p>
                    <p>Stay tuned for your first update!</p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px;">
                        You're receiving this because you subscribed to Stock Ping daily updates.
                    </p>
                </div>
            `,
        });

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: "Subscription email sent successfully"
            });
        } else {
            return NextResponse.json(
                { success: false, error: "Failed to send email" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Subscription error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
