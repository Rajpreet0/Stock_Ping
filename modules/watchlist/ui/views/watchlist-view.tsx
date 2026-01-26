"use client"

import { useState } from "react"
import { useWatchlist } from "@/hooks/useWatchlist"
import WatchListCard from "../components/WatchListCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const WatchListView = () => {
  const { watchlist, isLoaded, removeFromWatchlist, userEmail, setUserEmail } = useWatchlist()
  const [emailInput, setEmailInput] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!emailInput || !emailInput.includes("@")) {
      setError("Bitte gib eine gültige E-Mail-Adresse ein")
      return
    }

    setUserEmail(emailInput)
  }

  const handleLogout = () => {
    setUserEmail(null)
    setEmailInput("")
  }

  // Show login form if no email
  if (!userEmail) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>E-Mail eingeben</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">
              Gib deine E-Mail-Adresse ein, um deine persönliche Watchlist zu sehen.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="deine@email.de"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full cursor-pointer">
                Watchlist laden
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Watchlist</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{userEmail}</span>
          <Button variant="outline" size="sm" onClick={handleLogout} className="cursor-pointer">
            Abmelden
          </Button>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Deine Watchlist ist leer.</p>
          <p className="text-muted-foreground text-sm mt-2">
            Füge Aktien von der Startseite hinzu, um sie hier zu verfolgen.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {watchlist.map((item) => (
            <WatchListCard
              key={item.symbol}
              item={item}
              onRemove={removeFromWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default WatchListView