import { NextRequest, NextResponse } from "next/server";
import {
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    WatchlistItem,
} from "@/lib/google-sheets/sheets";

// GET - Fetch watchlist items for a user
export async function GET(request: NextRequest) {
    try {
        const email = request.nextUrl.searchParams.get("email");

        if (!email) {
            return NextResponse.json(
                { success: false, error: "Email is required" },
                { status: 400 }
            );
        }

        const watchlist = await getWatchlist(email);
        return NextResponse.json({ success: true, watchlist });
    } catch (error) {
        console.error("Error fetching watchlist:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch watchlist" },
            { status: 500 }
        );
    }
}

// POST - Add item to user's watchlist
export async function POST(request: NextRequest) {
    try {
        const { email, item }: { email: string; item: WatchlistItem } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, error: "Email is required" },
                { status: 400 }
            );
        }

        if (!item?.symbol || !item?.name) {
            return NextResponse.json(
                { success: false, error: "Symbol and name are required" },
                { status: 400 }
            );
        }

        const added = await addToWatchlist(email, item);

        if (!added) {
            return NextResponse.json(
                { success: false, error: "Stock already in watchlist" },
                { status: 409 }
            );
        }

        return NextResponse.json({ success: true, message: "Added to watchlist" });
    } catch (error) {
        console.error("Error adding to watchlist:", error);
        return NextResponse.json(
            { success: false, error: "Failed to add to watchlist" },
            { status: 500 }
        );
    }
}

// DELETE - Remove item from user's watchlist
export async function DELETE(request: NextRequest) {
    try {
        const { email, symbol } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, error: "Email is required" },
                { status: 400 }
            );
        }

        if (!symbol) {
            return NextResponse.json(
                { success: false, error: "Symbol is required" },
                { status: 400 }
            );
        }

        const removed = await removeFromWatchlist(email, symbol);

        if (!removed) {
            return NextResponse.json(
                { success: false, error: "Stock not found in watchlist" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Removed from watchlist" });
    } catch (error) {
        console.error("Error removing from watchlist:", error);
        return NextResponse.json(
            { success: false, error: "Failed to remove from watchlist" },
            { status: 500 }
        );
    }
}