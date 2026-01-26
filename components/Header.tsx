import Image from "next/image"
import Link from "next/link"

const Header = () => {
  return (
    <header className="p-5 w-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
            <Image
                src="/Stock_Ping_Logo.png"
                alt="Stock Ping Logo"
                width={120}
                height={120}
            />
        </Link>
        <div className="p-4">
            <p className="text-muted-foreground">
                Top performing stocks from the US, delivered daily
            </p>
        </div>
        <div className="p-4">
            <Link
                href="/watchlist"
                className="hover:underline"
            >Watchlist</Link>
        </div>
    </header>
  )
}

export default Header