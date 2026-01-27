"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import StockListItem from "./StockListItem"
import { Stock } from "@/types"


const StockList = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async (isManualRefresh = false) => {
        try {
            if (isManualRefresh) {
                setIsRefreshing(true);
            } else {
                setLoading(true);
            }
            setError("");

            // Add cache busting for manual refresh
            const url = isManualRefresh
                ? `/api/stocks?t=${Date.now()}`
                : "/api/stocks";

            const response = await fetch(url, {
                cache: 'no-store'
            });
            const data = await response.json();

            if (data.success) {
                setStocks(data.stocks);
                setLastUpdated(new Date(data.lastUpdated).toLocaleString("de-DE"));
            } else {
                setError("Fehler beim Laden der Aktien");
            }
        } catch (err) {
            console.error("Error fetching stocks:", err);
            setError("Fehler beim Laden der Aktien");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleRefresh = () => {
        fetchStocks(true);
    };

  return (
    <div className="mt-24">
        <div className="w-full flex items-center justify-between">
            <h2 className="text-2xl font-bold">Top Performer - Alle Märkte</h2>
            <div className="flex items-center gap-3">
                <p className="text-xs">
                    {loading ? "Lädt..." : `Aktualisiert: ${lastUpdated}`}
                </p>
                <button
                    onClick={handleRefresh}
                    disabled={loading || isRefreshing}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Aktualisieren"
                >
                    <RefreshCw
                        className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`}
                    />
                    {isRefreshing ? 'Lädt...' : 'Aktualisieren'}
                </button>
            </div>
        </div>

        <hr className="mb-2 mt-2"/>

        {error && (
            <div className="text-red-500 text-center py-8">
                {error}
            </div>
        )}

        {loading ? (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Lade Aktien...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stocks.map((stock, index) => (
                    <StockListItem
                        key={stock.symbol}
                        stock={stock}
                        rank={index + 1}
                    />
                ))}
            </div>
        )}
    </div>
  )
}

export default StockList