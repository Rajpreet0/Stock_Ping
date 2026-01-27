export interface CompanyInformation {
    symbol: string;
    price: number;
    beta: number;
    change: number;
    changePercentage: number;
    lastDividend: number;
    companyName: string;
    isin: string;
    marketCap: number;
    exchange: string;
    industry: string;
    website: string;
    description: string;
    ceo: string;
    sector: string;
    fullTimeEmployees: number;
    ipoDate: Date;
    image: string;
    address: string;
    city: string;
    state: string;
}


export interface Stock {
    symbol: string;
    price: number;
    name: string;
    change: number;
    changesPercentage: number;
    exchange: string;
}