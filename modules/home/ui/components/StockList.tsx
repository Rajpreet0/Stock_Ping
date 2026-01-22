"use client"

import { useEffect, useState } from "react"
import StockListItem from "./StockListItem"

interface Stock {
    symbol: string;
    price: number;
    name: string;
    change: number;
    changesPercentage: number;
    exchange: string;
}

const StockList = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState("");

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/stocks");
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
        }
    };

  return (
    <div className="mt-24">
        <div className="w-full flex items-center justify-between">
            <h2 className="text-2xl font-bold">Top Performer - Alle Märkte</h2>
            <p className="text-xs">
                {loading ? "Lädt..." : `Aktualisiert: ${lastUpdated}`}
            </p>
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