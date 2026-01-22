"use client"

import StockList from "../components/StockList"
import SubscriptionForm from "../components/SubscriptionForm"

const HomeView = () => {

  return (
    <div className="container mx-auto px-4 pb-12">
        <SubscriptionForm/>
        <StockList/>
    </div>
  )
}

export default HomeView