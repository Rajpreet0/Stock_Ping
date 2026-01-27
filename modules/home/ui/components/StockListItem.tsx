"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch";
import { Building2, TrendingDown, TrendingUp } from "lucide-react"
import { useWatchlist } from "@/hooks/useWatchlist"
import { Stock } from "@/types";

interface StockListItemProps {
    stock: Stock;
    rank: number;
}

const StockListItem = ({ stock, rank }: StockListItemProps) => {
    const isPositive = stock.changesPercentage >= 0;
    const { isInWatchlist, toggleWatchlist, userEmail } = useWatchlist();

    const inWatchlist = isInWatchlist(stock.symbol);

    const handleToggle = () => {
        if (!userEmail) return;
        toggleWatchlist({
            symbol: stock.symbol,
            name: stock.name,
            price: stock.price,
        });
    };

  return (
    <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
            <div className="flex items-start justify-between">
                {/* Title */}
                <div>
                    <CardTitle className="text-2xl font-bold mb-1">
                        {stock.name}
                    </CardTitle>
                    <a
                        href={`https://finance.yahoo.com/quote/${stock.symbol}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline cursor-pointer">
                        <p className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                            {stock.symbol}
                        </p>
                    </a>
                </div>
                {/* Badge */}
                <Badge variant="secondary" className="text-lg">
                    #{rank}
                </Badge>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
                {/* Price */}
                <div>
                    <p className="text-3xl font-bold">${stock.price.toFixed(2)}</p>
                </div>

                {/* Change */}
                <div className={`flex items-center gap-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? (
                        <TrendingUp className="w-5 h-5"/>
                    ) : (
                        <TrendingDown className="w-5 h-5"/>
                    )}
                    <span className="text-lg font-semibold">
                        {isPositive ? '+' : ''}{stock.changesPercentage.toFixed(2)}% ({isPositive ? '+' : ''}{stock.change.toFixed(2)})
                    </span>
                </div>

                {/* Exchange */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4"/>
                    <span>{stock.exchange}</span>
                </div>
            </div>
        </CardContent>
        <CardFooter>
            {/* Watchlist */}
            <div className="flex items-center gap-4">
                <Switch
                    size="sm"
                    className="cursor-pointer"
                    checked={inWatchlist}
                    onCheckedChange={handleToggle}
                    disabled={!userEmail}
                />
                <p className="text-sm">
                    {!userEmail
                        ? "Melde dich an für Watchlist"
                        : inWatchlist
                            ? "In Watchlist"
                            : "Zur Watchlist"}
                </p>
            </div>
        </CardFooter>
    </Card>
  )
}

export default StockListItem