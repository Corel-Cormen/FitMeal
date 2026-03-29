"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PurchaseDietPanel } from "@/components/dashboard/purchase-diet-panel"

export default function DashboardStartPage() {
  const handlePurchase = () => {
    // In a real app, this would process payment and update database
    // For now, just redirect to dashboard
    window.location.href = "/dashboard"
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
