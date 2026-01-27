import CompanyInfoView from "@/modules/companyInfo/ui/views/company-info-view"

interface CompanyInfoPageProps {
  params: Promise<{ symbol: string }>
}

const CompanyInfoPage = async ({ params }: CompanyInfoPageProps) => {
  const { symbol } = await params
  return <CompanyInfoView symbol={symbol}/>
}

export default CompanyInfoPage
