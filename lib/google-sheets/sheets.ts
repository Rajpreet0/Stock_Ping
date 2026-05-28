import { google } from "googleapis";
import { StockSnapshot } from "@/types";

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
            range: "Subscription!A2:A", // Read from A2 to the last row with data in column A
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
            range: "Subscription!A:A",
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

// ==================== WATCHLIST FUNCTIONS ====================
// Sheet structure: Email | Symbol | Name | Price

export interface WatchlistItem {
    symbol: string;
    name: string;
    price: number;
}

/**
 * Get watchlist items for a specific user by email
 * Watchlist sheet columns: A=Email, B=Symbol, C=Name, D=Price
 */
export async function getWatchlist(email: string): Promise<WatchlistItem[]> {
    try {
        if (!SPREADSHEET_ID) {
            throw new Error("SPREADSHEET_ID is not defined in environment variables");
        }

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "Watchlist!A2:D",
        });

        const rows = response.data.values;

        if (!rows || rows.length === 0) {
            return [];
        }

        // Filter by email and map to WatchlistItem
        const watchlist: WatchlistItem[] = rows
            .filter(row => row[0] && row[0].toLowerCase() === email.toLowerCase())
            .map(row => ({
                symbol: row[1] || "",
                name: row[2] || "",
                price: parseFloat(row[3]) || 0,
            }));

        return watchlist;
    } catch (error) {
        console.error("Error reading watchlist from Google Sheets:", error);
        throw error;
    }
}

/**
 * Add a stock to the user's watchlist
 */
export async function addToWatchlist(email: string, item: WatchlistItem): Promise<boolean> {
    try {
        if (!SPREADSHEET_ID) {
            throw new Error("SPREADSHEET_ID is not defined in environment variables");
        }

        // Check if already exists for this user
        const existing = await getWatchlist(email);
        if (existing.some(i => i.symbol === item.symbol)) {
            return false;
        }

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "Watchlist!A:D",
            valueInputOption: "RAW",
            requestBody: {
                values: [[email, item.symbol, item.name, item.price]],
            },
        });

        return true;
    } catch (error) {
        console.error("Error adding to watchlist:", error);
        throw error;
    }
}

// ==================== STOCK HISTORY FUNCTIONS ====================
// Sheet structure: Date | Symbol | Name | Price | Change | Change%

/**
 * Save a daily snapshot of top stocks to the StockHistory sheet.
 * Each row = one stock on one day. Call this once per day after market close.
 */
export async function saveStockSnapshot(snapshots: StockSnapshot[]): Promise<void> {
    if (!SPREADSHEET_ID) {
        throw new Error("SPREADSHEET_ID is not defined in environment variables");
    }

    if (snapshots.length === 0) return;

    const rows = snapshots.map(s => [
        s.date,
        s.symbol,
        s.name,
        s.price,
        s.change,
        s.changesPercentage,
        s.volume ?? "",
    ]);

    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: "StockHistory!A:G",
        valueInputOption: "RAW",
        requestBody: { values: rows },
    });

    console.log(`Saved ${snapshots.length} stock snapshots for ${snapshots[0].date}`);
}

/**
 * Remove a stock from the user's watchlist by symbol
 */
export async function removeFromWatchlist(email: string, symbol: string): Promise<boolean> {
    try {
        if (!SPREADSHEET_ID) {
            throw new Error("SPREADSHEET_ID is not defined in environment variables");
        }

        // Get all rows to find the one to delete
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "Watchlist!A2:D",
        });

        const rows = response.data.values;
        if (!rows) return false;

        // Find the row index matching both email and symbol
        const rowIndex = rows.findIndex(
            row => row[0]?.toLowerCase() === email.toLowerCase() && row[1] === symbol
        );
        if (rowIndex === -1) return false;

        // Get sheet ID for the Watchlist sheet
        const sheetMetadata = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });

        const watchlistSheet = sheetMetadata.data.sheets?.find(
            s => s.properties?.title === "Watchlist"
        );

        if (watchlistSheet?.properties?.sheetId !== undefined) {
            // Delete the row (rowIndex is 0-based, add 1 for header row)
            const rowNumber = rowIndex + 1;
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                requestBody: {
                    requests: [{
                        deleteDimension: {
                            range: {
                                sheetId: watchlistSheet.properties.sheetId,
                                dimension: "ROWS",
                                startIndex: rowNumber,
                                endIndex: rowNumber + 1,
                            },
                        },
                    }],
                },
            });
        }

        return true;
    } catch (error) {
        console.error("Error removing from watchlist:", error);
        throw error;
    }
}
