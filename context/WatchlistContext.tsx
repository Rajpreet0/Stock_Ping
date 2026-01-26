"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"

export interface WatchlistItem {
    symbol: string;
    name: string;
    price: number;
}

const WATCHLIST_EMAIL_KEY = "watchlist-email"

interface WatchlistContextType {
    watchlist: WatchlistItem[];
    isLoaded: boolean;
    userEmail: string | null;
    setUserEmail: (email: string | null) => void;
    addToWatchlist: (item: WatchlistItem) => void;
    removeFromWatchlist: (symbol: string) => void;
    isInWatchlist: (symbol: string) => boolean;
    toggleWatchlist: (item: WatchlistItem) => void;
    refetch: () => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextType | null>(null)

export function WatchlistProvider({ children }: { children: ReactNode }) {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [userEmail, setUserEmailState] = useState<string | null>(null)
    const [emailLoaded, setEmailLoaded] = useState(false)

    // Load email from localStorage on mount
    useEffect(() => {
        const storedEmail = localStorage.getItem(WATCHLIST_EMAIL_KEY)
        if (storedEmail) {
            setUserEmailState(storedEmail)
        }
        setEmailLoaded(true)
    }, [])

    const setUserEmail = useCallback((email: string | null) => {
        setUserEmailState(email)
        if (email) {
            localStorage.setItem(WATCHLIST_EMAIL_KEY, email)
        } else {
            localStorage.removeItem(WATCHLIST_EMAIL_KEY)
            setWatchlist([])
        }
    }, [])

    const fetchWatchlist = useCallback(async () => {
        if (!userEmail) {
            setWatchlist([])
            setIsLoaded(true)
            return
        }

        try {
            const response = await fetch(`/api/watchlist?email=${encodeURIComponent(userEmail)}`)
            const data = await response.json()
            if (data.success) {
                setWatchlist(data.watchlist)
            }
        } catch (error) {
            console.error("Error fetching watchlist:", error)
        } finally {
            setIsLoaded(true)
        }
    }, [userEmail])

    // Fetch watchlist when email changes
    useEffect(() => {
        if (emailLoaded) {
            fetchWatchlist()
        }
    }, [emailLoaded, fetchWatchlist])

    const addToWatchlist = useCallback(async (item: WatchlistItem) => {
        if (!userEmail) return

        // Optimistic update
        setWatchlist(prev => {
            if (prev.some(i => i.symbol === item.symbol)) {
                return prev
            }
            return [...prev, item]
        })

        try {
            const response = await fetch("/api/watchlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, item }),
            })

            if (!response.ok) {
                // Revert on failure
                setWatchlist(prev => prev.filter(i => i.symbol !== item.symbol))
            }
        } catch (error) {
            console.error("Error adding to watchlist:", error)
            // Revert on error
            setWatchlist(prev => prev.filter(i => i.symbol !== item.symbol))
        }
    }, [userEmail])

    const removeFromWatchlist = useCallback(async (symbol: string) => {
        if (!userEmail) return

        // Store item for potential revert
        let removedItem: WatchlistItem | undefined

        setWatchlist(prev => {
            removedItem = prev.find(i => i.symbol === symbol)
            return prev.filter(item => item.symbol !== symbol)
        })

        try {
            const response = await fetch("/api/watchlist", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, symbol }),
            })

            if (!response.ok && removedItem) {
                // Revert on failure
                setWatchlist(prev => [...prev, removedItem!])
            }
        } catch (error) {
            console.error("Error removing from watchlist:", error)
            // Revert on error
            if (removedItem) {
                setWatchlist(prev => [...prev, removedItem!])
            }
        }
    }, [userEmail])

    const isInWatchlist = useCallback((symbol: string) => {
        return watchlist.some(item => item.symbol === symbol)
    }, [watchlist])

    const toggleWatchlist = useCallback((item: WatchlistItem) => {
        if (isInWatchlist(item.symbol)) {
            removeFromWatchlist(item.symbol)
        } else {
            addToWatchlist(item)
        }
    }, [isInWatchlist, removeFromWatchlist, addToWatchlist])

    return (
        <WatchlistContext.Provider value={{
            watchlist,
            isLoaded,
            userEmail,
            setUserEmail,
            addToWatchlist,
            removeFromWatchlist,
            isInWatchlist,
            toggleWatchlist,
            refetch: fetchWatchlist,
        }}>
            {children}
        </WatchlistContext.Provider>
    )
}

export function useWatchlist() {
    const context = useContext(WatchlistContext)
    if (!context) {
        throw new Error("useWatchlist must be used within a WatchlistProvider")
    }
    return context
}