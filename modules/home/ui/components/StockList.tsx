import StockListItem from "./StockListItem"

const StockList = () => {
  return (
    <div className="mt-24">
        <div className="w-full flex items-center justify-between">
            <h2 className="text-2xl font-bold">Top Performer - Alle Märkte</h2>
            <p className="text-xs">Aktualisiert: 22.1.2026</p>
        </div>
        
        <hr className="mb-2 mt-2"/>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StockListItem/>
            <StockListItem/>
            <StockListItem/>
            <StockListItem/>
            <StockListItem/>
        </div>
    </div>
  )
}

export default StockList