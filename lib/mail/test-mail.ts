import { sendMail, verifyMailConnection } from "./nodemailer";


export async function testEmail() {
    // Connection testing
    console.log("Test SMTP-Connection");

    const isConnected = await verifyMailConnection();

    if (!isConnected) {
        console.log("SMTP-Connection Error");
        return;
    }

    console.log("SMTP-Connection success");

    // TEST-MAIl sending
    console.log("Sending E-mail");
    const result = await sendMail({
        to: process.env.SMTP_TEST_MAIL || " ",
        subject: "Test Mail from Stock Ping",
        html: "<h1>Test successfully!</h1><p>The E-Mail has been send successfully.</p>",
    });

    if (result.success) {
        console.log("Test-Mail erfolgreich gesendet!");
    } else {
        console.log("Fehler beim Senden:", result.error);
    }
}
