import { WatchlistItem } from "@/hooks/useWatchlist"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Link from "next/link"

const WatchListCard = ({ item, onRemove }: { item: WatchlistItem; onRemove: (symbol: string) => void }) => {
  return (
    <Link href={`/companyInfo/${item.symbol}`} className="h-full">
      <Card className="hover:shadow-lg transition-shadow h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl font-bold mb-1">
                {item.name}
              </CardTitle>
              <span
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(`https://finance.yahoo.com/quote/${item.symbol}`, "_blank");
                }}
                className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors font-medium cursor-pointer"
              >
                {item.symbol}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => onRemove(item.symbol)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${item.price.toFixed(2)}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default WatchListCard