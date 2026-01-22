import Image from "next/image"

const Header = () => {
  return (
    <header className="p-5 flex">
        {/* Logo */}
        <Image
            src="/Stock_Ping_Logo.png"
            alt="Stock Ping Logo"
            width={120}
            height={120}
        />
        <div className="p-4 w-full flex items-center justify-center">
            <p className="text-muted-foreground">
                Top performing stocks, delivered daily
            </p>
        </div>
    </header>
  )
}

export default Header