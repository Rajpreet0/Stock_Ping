import nodemailer from "nodemailer";

interface sendMailProps {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});


export async function sendMail({to, subject, html, text}: sendMailProps) {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FORM || process.env.SMTP_USER,
            to,
            subject,
            html,
            text: text || stripHtml(html),
        });

        console.log("E-Mail erfolgreich gesendet:", info.messageId);
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.log("Fehler beim E-Mail-Versand:", error);
        return { success: false, error }
    }
}


function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "");
}


export async function verifyMailConnection() {
    try {
        await transporter.verify();
        console.log("SMTP-Verbindung erfolgreich verifiziert");
        return true;
    } catch (error) {
        console.log("SMTP-Verbindung fehlgeschlagen:", error);
        return false;
    }
}