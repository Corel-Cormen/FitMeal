"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Flame,
  Check,
  RefreshCw
} from "lucide-react"

const daysOfWeek = [
  { short: "Pon", full: "Poniedzialek" },
  { short: "Wt", full: "Wtorek" },
  { short: "Sr", full: "Sroda" },
  { short: "Czw", full: "Czwartek" },
  { short: "Pt", full: "Piatek" },
  { short: "Sob", full: "Sobota" },
  { short: "Nd", full: "Niedziela" },
]

const mealTypes = ["Sniadanie", "II Sniadanie", "Obiad", "Przekaska", "Kolacja"]

const availableMeals = {
  "Sniadanie": [
    { id: 1, name: "Owsianka proteinowa", kcal: 420, protein: 28, image: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=100&h=100&fit=crop" },
    { id: 2, name: "Jajecznica z awokado", kcal: 380, protein: 24, image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=100&h=100&fit=crop" },
    { id: 3, name: "Smoothie bowl", kcal: 350, protein: 22, image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=100&h=100&fit=crop" },
    { id: 4, name: "Omlet szpinakowy", kcal: 340, protein: 26, image: "https://images.unsplash.com/photo-1612240498936-65f5101365d2?w=100&h=100&fit=crop" },
  ],
  "II Sniadanie": [
    { id: 5, name: "Serek z owocami", kcal: 250, protein: 18, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=100&h=100&fit=crop" },
    { id: 6, name: "Wrap z indykiem", kcal: 320, protein: 22, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=100&h=100&fit=crop" },
    { id: 7, name: "Jogurt grecki", kcal: 200, protein: 15, image: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=100&h=100&fit=crop" },
  ],
  "Obiad": [
    { id: 8, name: "Power Bowl", kcal: 650, protein: 45, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop" },
    { id: 9, name: "Stek z lososiem", kcal: 580, protein: 42, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=100&h=100&fit=crop" },
    { id: 10, name: "Beef & Rice", kcal: 720, protein: 52, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=100&h=100&fit=crop" },
    { id: 11, name: "Buddha Bowl", kcal: 520, protein: 22, image: "https://images.unsplash.com/photo-1540914124281-342587941389?w=100&h=100&fit=crop" },
  ],
  "Przekaska": [
    { id: 12, name: "Baton proteinowy", kcal: 180, protein: 20, image: "https://images.unsplash.com/photo-1622484211148-c9b212cd06f5?w=100&h=100&fit=crop" },
    { id: 13, name: "Orzechy mix", kcal: 220, protein: 8, image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=100&h=100&fit=crop" },
    { id: 14, name: "Hummus z warzywami", kcal: 200, protein: 10, image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=100&h=100&fit=crop" },
  ],
  "Kolacja": [
    { id: 15, name: "Protein Salad", kcal: 420, protein: 38, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop" },
    { id: 16, name: "Keto Plate", kcal: 550, protein: 32, image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=100&h=100&fit=crop" },
    { id: 17, name: "Grillowany kurczak", kcal: 480, protein: 44, image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=100&h=100&fit=crop" },
  ],
}

type Meal = {
  id: number
  name: string
  kcal: number
  protein: number
  image: string
}

type WeekPlan = {
  [day: number]: {
    [mealType: string]: Meal | null
  }
}

const initialWeekPlan: WeekPlan = {
  0: { "Sniadanie": availableMeals["Sniadanie"][0], "II Sniadanie": availableMeals["II Sniadanie"][0], "Obiad": availableMeals["Obiad"][0], "Przekaska": availableMeals["Przekaska"][0], "Kolacja": availableMeals["Kolacja"][0] },
  1: { "Sniadanie": availableMeals["Sniadanie"][1], "II Sniadanie": availableMeals["II Sniadanie"][1], "Obiad": availableMeals["Obiad"][1], "Przekaska": availableMeals["Przekaska"][1], "Kolacja": availableMeals["Kolacja"][1] },
  2: { "Sniadanie": availableMeals["Sniadanie"][2], "II Sniadanie": availableMeals["II Sniadanie"][2], "Obiad": availableMeals["Obiad"][2], "Przekaska": availableMeals["Przekaska"][2], "Kolacja": availableMeals["Kolacja"][2] },
  3: { "Sniadanie": availableMeals["Sniadanie"][3], "II Sniadanie": availableMeals["II Sniadanie"][0], "Obiad": availableMeals["Obiad"][3], "Przekaska": availableMeals["Przekaska"][0], "Kolacja": availableMeals["Kolacja"][0] },
  4: { "Sniadanie": availableMeals["Sniadanie"][0], "II Sniadanie": availableMeals["II Sniadanie"][1], "Obiad": availableMeals["Obiad"][0], "Przekaska": availableMeals["Przekaska"][1], "Kolacja": availableMeals["Kolacja"][1] },
  5: { "Sniadanie": null, "II Sniadanie": null, "Obiad": null, "Przekaska": null, "Kolacja": null },
  6: { "Sniadanie": null, "II Sniadanie": null, "Obiad": null, "Przekaska": null, "Kolacja": null },
}

export function WeeklyPlanner() {
  const [weekPlan, setWeekPlan] = useState<WeekPlan>(initialWeekPlan)
  const [selectedDay, setSelectedDay] = useState(0)
  const [weekOffset, setWeekOffset] = useState(0)

  const getWeekDates = () => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7)

    return daysOfWeek.map((_, index) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + index)
      return date
    })
  }

  const weekDates = getWeekDates()

  const setMeal = (day: number, mealType: string, meal: Meal) => {
    setWeekPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: meal
      }
    }))
  }

  const removeMeal = (day: number, mealType: string) => {
    setWeekPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: null
      }
    }))
  }

  const getDayStats = (day: number) => {
    const dayMeals = weekPlan[day]
    let totalKcal = 0
    let totalProtein = 0

    Object.values(dayMeals).forEach(meal => {
      if (meal) {
        totalKcal += meal.kcal
        totalProtein += meal.protein
      }
    })

    return { totalKcal, totalProtein }
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <section id="plan" className="scroll-mt-20">
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Plan tygodnia</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Zaplanuj swoje posilki na caly tydzien
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekOffset(prev => prev - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWeekOffset(0)}
              className="px-3"
            >
              Dzisiaj
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekOffset(prev => prev + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {daysOfWeek.map((day, index) => {
              const date = weekDates[index]
              const stats = getDayStats(index)
              const today = isToday(date)

              return (
                <button
                  key={day.short}
                  onClick={() => setSelectedDay(index)}
                  className={`flex min-w-[100px] flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all ${
                    selectedDay === index
                      ? "border-primary bg-primary/10"
                      : today
                        ? "border-primary/50 bg-secondary/50"
                        : "border-transparent bg-secondary/30 hover:bg-secondary/50"
                  }`}
                >
                  <span className="text-xs font-medium text-muted-foreground">{day.short}</span>
                  <span className={`text-lg font-bold ${today ? "text-primary" : "text-foreground"}`}>
                    {date.getDate()}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Flame className="h-3 w-3" />
                    {stats.totalKcal}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="space-y-3">
            {mealTypes.map((mealType) => {
              const meal = weekPlan[selectedDay]?.[mealType]

              return (
                <div
                  key={mealType}
                  className="flex items-center gap-4 rounded-xl border border-border/50 bg-card p-3"
                >
                  <div className="w-24 shrink-0">
                    <span className="text-sm font-medium text-muted-foreground">{mealType}</span>
                  </div>

                  {meal ? (
                    <div className="flex flex-1 items-center gap-3">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{meal.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{meal.kcal} kcal</span>
                          <span>{meal.protein}g bialka</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Zmien posilek</DialogTitle>
                              <DialogDescription>
                                Wybierz inny posilek na {mealType.toLowerCase()}
                              </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[400px]">
                              <div className="space-y-2 pr-4">
                                {availableMeals[mealType as keyof typeof availableMeals]?.map((option) => (
                                  <button
                                    key={option.id}
                                    onClick={() => setMeal(selectedDay, mealType, option)}
                                    className={`flex w-full items-center gap-3 rounded-xl border p-3 transition-all hover:border-primary/50 hover:bg-secondary/50 ${
                                      meal?.id === option.id ? "border-primary bg-primary/10" : "border-border/50"
                                    }`}
                                  >
                                    <img
                                      src={option.image}
                                      alt={option.name}
                                      className="h-14 w-14 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 text-left">
                                      <p className="font-medium text-foreground">{option.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {option.kcal} kcal | {option.protein}g bialka
                                      </p>
                                    </div>
                                    {meal?.id === option.id && (
                                      <Check className="h-5 w-5 text-primary" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeMeal(selectedDay, mealType)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 justify-start border-dashed text-muted-foreground"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Dodaj posilek
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Dodaj posilek</DialogTitle>
                          <DialogDescription>
                            Wybierz posilek na {mealType.toLowerCase()}
                          </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-[400px]">
                          <div className="space-y-2 pr-4">
                            {availableMeals[mealType as keyof typeof availableMeals]?.map((option) => (
                              <button
                                key={option.id}
                                onClick={() => setMeal(selectedDay, mealType, option)}
                                className="flex w-full items-center gap-3 rounded-xl border border-border/50 p-3 transition-all hover:border-primary/50 hover:bg-secondary/50"
                              >
                                <img
                                  src={option.image}
                                  alt={option.name}
                                  className="h-14 w-14 rounded-lg object-cover"
                                />
                                <div className="flex-1 text-left">
                                  <p className="font-medium text-foreground">{option.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {option.kcal} kcal | {option.protein}g bialka
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl bg-primary/10 p-4">
            <div>
              <p className="text-sm text-muted-foreground">Podsumowanie dnia</p>
              <p className="text-lg font-bold text-foreground">
                {daysOfWeek[selectedDay].full}, {weekDates[selectedDay].getDate()}.{weekDates[selectedDay].getMonth() + 1}
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{getDayStats(selectedDay).totalKcal}</p>
                <p className="text-xs text-muted-foreground">kcal</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{getDayStats(selectedDay).totalProtein}g</p>
                <p className="text-xs text-muted-foreground">bialka</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
