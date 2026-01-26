import { WatchlistItem } from "@/hooks/useWatchlist"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const WatchListCard = ({ item, onRemove }: { item: WatchlistItem; onRemove: (symbol: string) => void }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold mb-1">
              {item.name}
            </CardTitle>
            <a
              href={`https://finance.yahoo.com/quote/${item.symbol}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline cursor-pointer"
            >
              <p className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                {item.symbol}
              </p>
            </a>
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
  )
}

export default WatchListCard