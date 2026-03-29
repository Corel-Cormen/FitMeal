"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PurchaseDietPanel } from "@/components/dashboard/purchase-diet-panel"

const HAS_PURCHASED_DIET_KEY = "fitmeal_hasPurchasedDiet"

export default function DashboardStartPage() {
  const router = useRouter()

  useEffect(() => {
    const hasPurchased = typeof window !== "undefined" && localStorage.getItem(HAS_PURCHASED_DIET_KEY) === "true"
    if (hasPurchased) router.replace("/dashboard")
  }, [router])

  const handlePurchase = () => {
    localStorage.setItem(HAS_PURCHASED_DIET_KEY, "true")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <PurchaseDietPanel onPurchase={handlePurchase} />
        </div>
      </main>
    </div>
  )
}
