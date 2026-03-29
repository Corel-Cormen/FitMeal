"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { WeeklyPlanner } from "@/components/dashboard/weekly-planner"
import { PreferencesPanel } from "@/components/dashboard/preferences-panel"
import { OrderTracking } from "@/components/dashboard/order-tracking"
import { DietCtaSection } from "@/components/dashboard/diet-cta-section"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Witaj, <span className="text-primary">Anna</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Sprawdź swój plan żywieniowy i śledź zamówienia
          </p>
        </div>
        <div className="space-y-12">
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

          <DietCtaSection />
        </div>
      </main>
    </div>
  )
}
