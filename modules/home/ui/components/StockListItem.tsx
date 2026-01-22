import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, TrendingUp } from "lucide-react"

const StockListItem = () => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
            <div className="flex items-start justify-between">
                {/* Title */}
                <div>
                    <CardTitle className="text-2xl font-bold mb-1">
                        Broadcom Inc
                    </CardTitle>
                    <a
                        className="hover:underline cursor-pointer">
                        <p className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                            AVGO
                        </p>
                    </a>
                </div>
                {/* Badge */}
                <Badge variant="secondary" className="text-lg">
                    #1
                </Badge>
            </div> 
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
                {/* Price */}
                <div>
                    <p className="text-3xl font-bold">$351.71</p>
                </div>

                {/* Change */}
                <div className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="w-5 h-5"/>
                    <span className="text-lg font-semibold">
                        2.53% (8.69)
                    </span>
                </div>

                {/* Sector */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4"/>
                    <span>Semiconductors</span>
                </div>
            </div>
        </CardContent>
    </Card>
  )
}

export default StockListItem