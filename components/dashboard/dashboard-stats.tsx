"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Flame,
  Dumbbell,
  Calendar,
  TrendingUp
} from "lucide-react"

const stats = [
  {
    label: "Dzisiejsze kalorie",
    value: "2,150",
    unit: "kcal",
    target: "/ 2,400 kcal",
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    label: "Bialko",
    value: "148",
    unit: "g",
    target: "/ 160g cel",
    icon: Dumbbell,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Aktywna subskrypcja",
    value: "Pro",
    unit: "",
    target: "do 15.04.2024",
    icon: Calendar,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    label: "Trend wagi",
    value: "-2.3",
    unit: "kg",
    target: "w tym miesiacu",
    icon: TrendingUp,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                    <span className="text-sm font-medium text-muted-foreground">{stat.unit}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.target}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
