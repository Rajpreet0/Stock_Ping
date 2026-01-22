import { google } from "googleapis";

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

/**
 * Read all emails from the Google Sheet
 * Assumes emails are in column A starting from row 2 (row 1 is header)
 */
export async function getAllEmails(): Promise<string[]> {
    try {
        if (!SPREADSHEET_ID) {
            throw new Error("SPREADSHEET_ID is not defined in environment variables");
        }

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "Sheet1!A2:A", // Read from A2 to the last row with data in column A
        });

        const rows = response.data.values;

        if (!rows || rows.length === 0) {
            console.log("No email data found in the sheet");
            return [];
        }

        // Flatten the array and filter out empty values
        const emails = rows
            .map(row => row[0])
            .filter(email => email && email.trim() !== "");

        console.log(`Retrieved ${emails.length} emails from Google Sheets`);
        return emails;
    } catch (error) {
        console.error("Error reading from Google Sheets:", error);
        throw error;
    }
}

/**
 * Add a new email to the Google Sheet
 * Appends the email to the next available row in column A
 */
export async function addEmail(email: string): Promise<boolean> {
    try {
        if (!SPREADSHEET_ID) {
            throw new Error("SPREADSHEET_ID is not defined in environment variables");
        }

        // First, check if email already exists
        const existingEmails = await getAllEmails();
        if (existingEmails.includes(email)) {
            console.log(`Email ${email} already exists in the sheet`);
            return false;
        }

        // Append the new email
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "Sheet1!A:A",
            valueInputOption: "RAW",
            requestBody: {
                values: [[email]],
            },
        });

        console.log(`Successfully added email: ${email}`);
        return true;
    } catch (error) {
        console.error("Error writing to Google Sheets:", error);
        throw error;
    }
}

/**
 * Check if an email already exists in the sheet
 */
export async function emailExists(email: string): Promise<boolean> {
    try {
        const emails = await getAllEmails();
        return emails.includes(email);
    } catch (error) {
        console.error("Error checking email existence:", error);
        throw error;
    }
}
