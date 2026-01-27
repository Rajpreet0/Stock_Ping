"use client"

import { CompanyInformation } from "@/types"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Globe,
  Briefcase,
  User,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  DollarSign,
} from "lucide-react"
import InfoRow from "../components/InfoRow"
import Image from "next/image"

interface CompanyInfoViewProps {
    symbol: string
}

const CompanyInfoView: React.FC<CompanyInfoViewProps> = ({symbol}) => {

    const [company, setCompany] = useState<CompanyInformation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`/api/company?symbol=${encodeURIComponent(symbol)}`);
                const data = await response.json();

                if (data.success) {
                    setCompany(data.companyInformation);
                } else {
                    setError("Fehler beim Laden der Unternehemsdaten");
                }
            } catch(err) {
                console.error("Error fetching company info: ", err);
                setError("Fehler beim Laden oder Unternehemnsdaten");
            } finally {
                setLoading(false);
            }
        }   

        fetchCompany();
    }, [symbol]);

    const formatMarketCap = (value: number) => {
        if (value >= 1e12) return `${(value / 1e12).toFixed(2)} Bio.`;
        if (value >= 1e9) return `${(value / 1e9).toFixed(2)} Mrd.`;
        if (value >= 1e6) return `${(value / 1e6).toFixed(2)} Mio.`;
        return value.toLocaleString("de-DE");
    }

    const formatDate = (date: Date | string) => 
        new Date(date).toLocaleDateString("de-DE");

    if (loading) {
        return (
            <div className="text-center py-16">
                <p className="text-muted-foreground">Lade Unternehemnsdaten...</p>
            </div>
        )
    }

    if (error || !company) {
        return (
            <div className="text-center py-16">
                <p className="text-red-500">{error || "Unternehmen nicht gefunden"}</p>
                <Link href="/" className="text-sm text-blue-500 hover:underline mt-4 inline-block">
                    Zurück zur Übersicht
                </Link>
            </div>
        )
    }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* HEADER */}
        <Card>
            <CardHeader className="flex flex-row gap-4 items-center">
                <Image
                    src={company.image}
                    alt={company.companyName}
                    width={50}
                    height={50}
                    className="w-16 h-16 object-contain border p-1"
                />

                <div className="flex-1">
                    <CardTitle className="text-2xl">
                        {company.companyName}
                    </CardTitle>
                    <div className="flex gap-2 mt-1">
                        <Badge variant="secondary">{company.symbol}</Badge>
                        <Badge variant="outline">{company.exchange}</Badge>
                    </div>
                </div>

                <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-xl font-semibold">
                            {company.price.toFixed(2)}
                        </span>
                    </div>
                    <p
                        className={`text-sm ${
                            company.change >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {company.change.toFixed(2)} ({company.changePercentage.toFixed(2)}%)
                    </p>
                </div>
            </CardHeader>
        </Card>
        
        {/* DESCRIPTION */}
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Beschreibung</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                {company.description}
                </p>
            </CardContent>
        </Card>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Unternehmensdaten
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <InfoRow icon={Building2} label="Market Cap" value={formatMarketCap(company.marketCap)} />
                    <InfoRow icon={Briefcase} label="Industry" value={company.industry} />
                    <InfoRow icon={Briefcase} label="Sector" value={company.sector} />
                    <InfoRow icon={User} label="CEO" value={company.ceo} />
                    <InfoRow icon={Users} label="Employees"  value={company.fullTimeEmployees
                            ? Number(company.fullTimeEmployees).toLocaleString("de-DE")
                            : "—"
                    } />
                    <InfoRow icon={Calendar} label="IPO" value={formatDate(company.ipoDate)} />
                </CardContent>
            </Card>
        

            {/* LOCATION / LINKS */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Standort & Links
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <InfoRow
                        icon={MapPin}
                        label="Adresse"
                        value={`${company.address}, ${company.city}, ${company.state}`}
                    />
                    <InfoRow
                        icon={Globe}
                        label="Website"
                        value={
                        <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            {company.website}
                        </a>
                        }
                    />
                </CardContent>
            </Card>
        </div>
    </div>
  )
}

export default CompanyInfoView