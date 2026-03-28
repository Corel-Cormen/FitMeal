"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { WeeklyPlanner } from "@/components/dashboard/weekly-planner"
import { PreferencesPanel } from "@/components/dashboard/preferences-panel"
import { OrderTracking } from "@/components/dashboard/order-tracking"
import { PurchaseDietPanel } from "@/components/dashboard/purchase-diet-panel"

export default function DashboardPage() {
  // In a real app, this would come from user auth/database
  const [hasPurchasedDiet, setHasPurchasedDiet] = useState(false)

  const handlePurchase = () => {
    // In a real app, this would process payment and update database
    setHasPurchasedDiet(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Witaj, <span className="text-primary">Anna</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            {hasPurchasedDiet
              ? "Sprawdź swój plan żywieniowy i śledź zamówienia"
              : "Rozpocznij swoją przygodę ze zdrowym odżywianiem"
            }
          </p>
        </div>

        {hasPurchasedDiet ? (
          <div className="space-y-8">
            <DashboardStats />
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <WeeklyPlanner />
              </div>
              <div>
                <OrderTracking />
              </div>
            </div>

            <PreferencesPanel />
          </div>
        ) : (
          <div className="mx-auto max-w-4xl">
            <PurchaseDietPanel onPurchase={handlePurchase} />
          </div>
        )}
      </main>
    </div>
  )
}
