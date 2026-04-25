"use client"

import { Suspense, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserSettingsForm, type UserSettingsTab } from "@/components/dashboard/user-settings"

import { ArrowLeft, Settings, Save } from "lucide-react"

function SettingsContent() {
  const searchParams = useSearchParams()
  const formId = "dashboard-settings-form"

  const defaultTab = useMemo(() => {
    const tab = searchParams?.get("tab")
    if (tab === "profile" || tab === "delivery" || tab === "preferences") return tab as UserSettingsTab
    return "profile" as const
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Ustawienia</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Ustawienia konta</CardTitle>
              <CardDescription>
                Zarządzaj swoim profilem, dostawą oraz preferencjami.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserSettingsForm defaultTab={defaultTab} formId={formId} />

              <div className="mt-6">
                <Button className="w-full sm:w-auto" type="submit" form={formId}>
                  <Save className="mr-2 h-4 w-4" />
                  Zapisz zmiany
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function DashboardSettingsPage() {
  return (
    <Suspense>
      <SettingsContent />
    </Suspense>
  )
}
