"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Flame,
  Check,
  RefreshCw,
  Clock,
  CalendarDays,
} from "lucide-react"

const daysOfWeek = [
  { short: "Pon", full: "Poniedziałek" },
  { short: "Wt", full: "Wtorek" },
  { short: "Śr", full: "Środa" },
  { short: "Czw", full: "Czwartek" },
  { short: "Pt", full: "Piątek" },
  { short: "Sob", full: "Sobota" },
  { short: "Nd", full: "Niedziela" },
]

const mealTypes = ["Śniadanie", "II Śniadanie", "Obiad", "Przekąska", "Kolacja"]

const availableMeals = {
  "Śniadanie": [
    { id: 1, name: "Owsianka proteinowa", description: "Owsianka na mleku z odżywką białkową i owocami.", kcal: 420, protein: 28, image: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=100&h=100&fit=crop" },
    { id: 2, name: "Jajecznica z awokado", description: "Jajka z kremowym awokado i świeżymi warzywami.", kcal: 380, protein: 24, image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=100&h=100&fit=crop" },
    { id: 3, name: "Smoothie bowl", description: "Gęsty bowl z owoców, jogurtu i chrupiących dodatków.", kcal: 350, protein: 22, image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=100&h=100&fit=crop" },
    { id: 4, name: "Omlet szpinakowy", description: "Omlet ze szpinakiem i ziołami, lekki i sycący.", kcal: 340, protein: 26, image: "https://images.unsplash.com/photo-1677844592730-ce9c936d8f1a?w=100&h=100&fit=crop" },
  ],
  "II Śniadanie": [
    { id: 5, name: "Serek z owocami", description: "Serek wysokobiałkowy z sezonowymi owocami.", kcal: 250, protein: 18, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=100&h=100&fit=crop" },
    { id: 6, name: "Wrap z indykiem", description: "Pełnoziarnisty wrap z indykiem i warzywami.", kcal: 320, protein: 22, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=100&h=100&fit=crop" },
    { id: 7, name: "Jogurt grecki", description: "Jogurt grecki z miodem i dodatkami.", kcal: 200, protein: 15, image: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=100&h=100&fit=crop" },
  ],
  "Obiad": [
    { id: 8, name: "Power Bowl", description: "Kurczak, ryż i warzywa w energetycznej misce.", kcal: 650, protein: 45, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop" },
    { id: 9, name: "Stek z łososiem", description: "Łosoś z dodatkami warzywnymi i sosem cytrynowym.", kcal: 580, protein: 42, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=100&h=100&fit=crop" },
    { id: 10, name: "Beef & Rice", description: "Wołowina z ryżem i warzywami, solidna porcja białka.", kcal: 720, protein: 52, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=100&h=100&fit=crop" },
    { id: 11, name: "Buddha Bowl", description: "Warzywa, ziarna i białko roślinne w lekkiej kompozycji.", kcal: 520, protein: 22, image: "https://images.unsplash.com/photo-1540914124281-342587941389?w=100&h=100&fit=crop" },
  ],
  "Przekąska": [
    { id: 12, name: "Baton proteinowy", description: "Szybka przekąska na trening i w podróży.", kcal: 180, protein: 20, image: "https://images.unsplash.com/photo-1772986232885-fc9693e5954b?w=100&h=100&fit=crop" },
    { id: 13, name: "Orzechy mix", description: "Mieszanka orzechów i pestek — zdrowe tłuszcze.", kcal: 220, protein: 8, image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=100&h=100&fit=crop" },
    { id: 14, name: "Hummus z warzywami", description: "Kremowy hummus z chrupiącymi warzywami.", kcal: 200, protein: 10, image: "https://images.unsplash.com/photo-1591299177061-2151e53fcaea?w=100&h=100&fit=crop" },
  ],
  "Kolacja": [
    { id: 15, name: "Sałatka Proteinowa", description: "Sałatka z dużą porcją białka i lekkim dressingiem.", kcal: 420, protein: 38, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop" },
    { id: 16, name: "Keto Plate", description: "Talerz keto: białko, warzywa i zdrowe tłuszcze.", kcal: 550, protein: 32, image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=100&h=100&fit=crop" },
    { id: 17, name: "Grillowany kurczak", description: "Soczysty kurczak z warzywami — idealna kolacja.", kcal: 480, protein: 44, image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=100&h=100&fit=crop" },
  ],
}

type Meal = {
  id: number
  name: string
  description: string
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
  0: { "Śniadanie": availableMeals["Śniadanie"][0], "II Śniadanie": availableMeals["II Śniadanie"][0], "Obiad": availableMeals["Obiad"][0], "Przekąska": availableMeals["Przekąska"][0], "Kolacja": availableMeals["Kolacja"][0] },
  1: { "Śniadanie": availableMeals["Śniadanie"][1], "II Śniadanie": availableMeals["II Śniadanie"][1], "Obiad": availableMeals["Obiad"][1], "Przekąska": availableMeals["Przekąska"][1], "Kolacja": availableMeals["Kolacja"][1] },
  2: { "Śniadanie": null, "II Śniadanie": null, "Obiad": null, "Przekąska": null, "Kolacja": null },
  3: { "Śniadanie": null, "II Śniadanie": null, "Obiad": null, "Przekąska": null, "Kolacja": null },
  4: { "Śniadanie": availableMeals["Śniadanie"][2], "II Śniadanie": availableMeals["II Śniadanie"][2], "Obiad": availableMeals["Obiad"][2], "Przekąska": availableMeals["Przekąska"][2], "Kolacja": availableMeals["Kolacja"][2] },
  5: { "Śniadanie": availableMeals["Śniadanie"][3], "II Śniadanie": availableMeals["II Śniadanie"][0], "Obiad": availableMeals["Obiad"][3], "Przekąska": availableMeals["Przekąska"][0], "Kolacja": availableMeals["Kolacja"][0] },
  6: { "Śniadanie": availableMeals["Śniadanie"][0], "II Śniadanie": availableMeals["II Śniadanie"][1], "Obiad": availableMeals["Obiad"][0], "Przekąska": availableMeals["Przekąska"][1], "Kolacja": availableMeals["Kolacja"][1] },
}

export function WeeklyPlanner() {
  const [weekPlan, setWeekPlan] = useState<WeekPlan>(initialWeekPlan)
  const [selectedDay, setSelectedDay] = useState(() => (new Date().getDay() + 6) % 7)
  const [weekOffset, setWeekOffset] = useState(0)
  const [now, setNow] = useState(() => new Date())

  const daysScrollerRef = useRef<HTMLDivElement | null>(null)
  const dayButtonRefs = useRef<Array<HTMLButtonElement | null>>([])

  const getWeekDates = (offset: number) => {
    const today = new Date()
    const startOfWeek = new Date(today)
    const diffToMonday = (today.getDay() + 6) % 7
    startOfWeek.setDate(today.getDate() - diffToMonday + offset * 7)

    return daysOfWeek.map((_, index) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + index)
      return date
    })
  }

  const weekDates = getWeekDates(weekOffset)

  const MS_IN_WEEK = 7 * 24 * 60 * 60 * 1000

  const getWeekStartMonday = (date: Date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    const diffToMonday = (d.getDay() + 6) % 7
    d.setDate(d.getDate() - diffToMonday)
    return d
  }

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

  const isTomorrow = (date: Date) => {
    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)
    const tomorrowStart = new Date(todayStart)
    tomorrowStart.setDate(tomorrowStart.getDate() + 1)

    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    return dayStart.getTime() === tomorrowStart.getTime()
  }

  const isPastDate = (date: Date) => {
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    return dayStart < todayStart
  }

  const getTomorrowLockAt = () => {
    // Cutoff for editing tomorrow's meals: today at 18:00
    const lockAt = new Date(now)
    lockAt.setHours(18, 0, 0, 0)
    return lockAt
  }

  const isAutoLockedForTomorrow = (date: Date) => {
    if (!isTomorrow(date)) return false
    return now.getTime() >= getTomorrowLockAt().getTime()
  }

  const formatCountdown = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }

  const centerDayInScroller = (dayIndex: number) => {
    const scroller = daysScrollerRef.current
    const button = dayButtonRefs.current[dayIndex]
    if (!scroller || !button) return

    const target = button.offsetLeft + button.offsetWidth / 2 - scroller.clientWidth / 2
    scroller.scrollTo({ left: Math.max(0, target), behavior: "smooth" })
  }

  const formatShortDate = (date: Date) =>
    date.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" })

  const weekRangeLabel = `${formatShortDate(weekDates[0])}–${formatShortDate(weekDates[6])}`

  const goToToday = () => {
    const datesForCurrentWeek = weekOffset === 0 ? weekDates : getWeekDates(0)
    const todayIndex = datesForCurrentWeek.findIndex((d) => isToday(d))
    if (todayIndex === -1) return

    setWeekOffset(0)
    setSelectedDay(todayIndex)

    requestAnimationFrame(() => {
      centerDayInScroller(todayIndex)
      requestAnimationFrame(() => centerDayInScroller(todayIndex))
    })
  }

  const goToTomorrow = () => {
    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)
    const tomorrowStart = new Date(todayStart)
    tomorrowStart.setDate(tomorrowStart.getDate() + 1)

    const baseWeekStart = getWeekStartMonday(todayStart)
    const targetWeekStart = getWeekStartMonday(tomorrowStart)
    const targetOffset = Math.round((targetWeekStart.getTime() - baseWeekStart.getTime()) / MS_IN_WEEK)

    const targetWeekDates = getWeekDates(targetOffset)
    const tomorrowIndex = targetWeekDates.findIndex((d) => {
      const dayStart = new Date(d)
      dayStart.setHours(0, 0, 0, 0)
      return dayStart.getTime() === tomorrowStart.getTime()
    })

    if (tomorrowIndex === -1) return

    setWeekOffset(targetOffset)
    setSelectedDay(tomorrowIndex)

    requestAnimationFrame(() => {
      centerDayInScroller(tomorrowIndex)
      requestAnimationFrame(() => centerDayInScroller(tomorrowIndex))
    })
  }

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (weekOffset !== 0) return

    const todayIndex = weekDates.findIndex((d) => isToday(d))
    if (todayIndex === -1) return

    if (selectedDay !== todayIndex) setSelectedDay(todayIndex)

    requestAnimationFrame(() => centerDayInScroller(todayIndex))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekOffset])

  useEffect(() => {
    if (weekOffset !== 0) return
    const todayIndex = weekDates.findIndex((d) => isToday(d))
    if (todayIndex === -1) return
    if (selectedDay !== todayIndex) return

    requestAnimationFrame(() => centerDayInScroller(todayIndex))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay])

  const selectedDate = weekDates[selectedDay]
  const selectedIsTomorrow = isTomorrow(selectedDate)
  const tomorrowLockAt = getTomorrowLockAt()
  const msToTomorrowLock = tomorrowLockAt.getTime() - now.getTime()
  const tomorrowLocked = msToTomorrowLock <= 0
  const showTomorrowLockBanner = !isPastDate(selectedDate)
  const tomorrowStart = (() => {
    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)
    const t = new Date(todayStart)
    t.setDate(t.getDate() + 1)
    return t
  })()

  return (
    <section id="plan" className="scroll-mt-20">
      <Card className="border-border/50">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Plan tygodnia</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Zaplanuj swoje posilki na caly tydzien
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
              onClick={goToToday}
              className="px-3"
            >
              Dzisiaj
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToTomorrow}
              className="px-3"
            >
              Jutro
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
          {/* Mobile layout */}
          <div className="space-y-4 sm:hidden">

            <Select value={selectedDay.toString()} onValueChange={(v) => setSelectedDay(parseInt(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz dzień" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((d, idx) => {
                  const date = weekDates[idx]
                  const stats = getDayStats(idx)
                  const label = `${d.short} • ${formatShortDate(date)} • ${stats.totalKcal} kcal`
                  return (
                    <SelectItem key={d.short} value={idx.toString()}>
                      {label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>

            {showTomorrowLockBanner && (
              <div className="rounded-xl bg-primary/10 p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      Blokada jutrzejszych posiłków ({formatShortDate(tomorrowStart)})
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {tomorrowLocked
                        ? "Jutrzejsze posiłki są już zablokowane."
                        : `Pozostało: ${formatCountdown(msToTomorrowLock)}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Accordion type="multiple" className="space-y-2">
              {mealTypes.map((mealType) => {
                const meal = weekPlan[selectedDay]?.[mealType]
                const isLocked =
                  isPastDate(selectedDate) ||
                  isToday(selectedDate) ||
                  (isTomorrow(selectedDate) && isAutoLockedForTomorrow(selectedDate))

                return (
                  <AccordionItem key={mealType} value={mealType} className="rounded-xl border border-border/50 bg-card px-3">
                    <AccordionTrigger className="py-3 text-left hover:no-underline">
                      <div className="flex w-full items-center justify-between gap-3 pr-2">
                        <span className="text-sm font-medium text-foreground">{mealType}</span>
                        <span className="text-xs text-muted-foreground">
                          {meal ? `${meal.kcal} kcal` : "Brak"}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      {meal ? (
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <img src={meal.image} alt={meal.name} className="h-14 w-14 rounded-xl object-cover" />
                            <div className="min-w-0">
                              <p className="font-medium text-foreground">{meal.name}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground">{meal.description}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {meal.kcal} kcal • {meal.protein}g białka
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            {isLocked ? (
                              <Button variant="outline" size="sm" disabled>
                                Zmień
                              </Button>
                            ) : (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">Zmień</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Zmień posiłek</DialogTitle>
                                    <DialogDescription>
                                      Wybierz inny posiłek na {mealType.toLowerCase()}
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
                                          <img src={option.image} alt={option.name} className="h-14 w-14 rounded-xl object-cover" />
                                          <div className="flex-1 text-left">
                                            <p className="font-medium text-foreground">{option.name}</p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">{option.description}</p>
                                            <p className="text-sm text-muted-foreground">
                                              {option.kcal} kcal | {option.protein}g białka
                                            </p>
                                          </div>
                                          {meal?.id === option.id && <Check className="h-5 w-5 text-primary" />}
                                        </button>
                                      ))}
                                    </div>
                                  </ScrollArea>
                                </DialogContent>
                              </Dialog>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => removeMeal(selectedDay, mealType)}
                              disabled={isLocked}
                            >
                              Usuń
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end">
                          {isLocked ? (
                            <Button variant="outline" size="sm" disabled>
                              Dodaj
                            </Button>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">Dodaj</Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Dodaj posiłek</DialogTitle>
                                  <DialogDescription>
                                    Wybierz posiłek na {mealType.toLowerCase()}
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
                                        <img src={option.image} alt={option.name} className="h-14 w-14 rounded-xl object-cover" />
                                        <div className="flex-1 text-left">
                                          <p className="font-medium text-foreground">{option.name}</p>
                                          <p className="mt-0.5 text-xs text-muted-foreground">{option.description}</p>
                                          <p className="text-sm text-muted-foreground">
                                            {option.kcal} kcal | {option.protein}g białka
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
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>

            <div className="rounded-xl bg-primary/10 p-4">
              <p className="text-sm text-muted-foreground">Podsumowanie dnia</p>
              <p className="text-base font-bold text-foreground">
                {daysOfWeek[selectedDay].full}, {weekDates[selectedDay].getDate()}.{weekDates[selectedDay].getMonth() + 1}
              </p>
              <div className="mt-3 flex gap-6">
                <div>
                  <p className="text-xl font-bold text-primary">{getDayStats(selectedDay).totalKcal}</p>
                  <p className="text-xs text-muted-foreground">kcal</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-primary">{getDayStats(selectedDay).totalProtein}g</p>
                  <p className="text-xs text-muted-foreground">białka</p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop/tablet layout */}
          <div className="hidden sm:block">
            {showTomorrowLockBanner && (
              <div className="mb-4 rounded-xl bg-primary/10 p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Blokada jutrzejszych posiłków ({formatShortDate(tomorrowStart)})
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {tomorrowLocked
                        ? "Jutrzejsze posiłki są już zablokowane."
                        : `Pozostało: ${formatCountdown(msToTomorrowLock)}`}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div ref={daysScrollerRef} className="mb-6 flex gap-2 overflow-x-auto pb-2">
              {daysOfWeek.map((day, index) => {
                const date = weekDates[index]
                const stats = getDayStats(index)
                const today = isToday(date)

                return (
                  <button
                    key={day.short}
                    onClick={() => {
                      setSelectedDay(index)
                      requestAnimationFrame(() => centerDayInScroller(index))
                    }}
                    ref={(el) => {
                      dayButtonRefs.current[index] = el
                    }}
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
                const isLocked =
                  isPastDate(selectedDate) ||
                  isToday(selectedDate) ||
                  (isTomorrow(selectedDate) && isAutoLockedForTomorrow(selectedDate))

                return (
                  <div
                    key={mealType}
                    className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-3 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <div className="shrink-0 sm:w-24">
                      <span className="text-sm font-medium text-muted-foreground">{mealType}</span>
                    </div>

                    {meal ? (
                      <div className="flex flex-1 items-start gap-3">
                        <img
                          src={meal.image}
                          alt={meal.name}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{meal.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{meal.description}</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span>{meal.kcal} kcal</span>
                            <span>{meal.protein}g bialka</span>
                          </div>
                        </div>

                        <div className="ml-auto flex items-center gap-1">
                          {isLocked ? (
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          ) : (
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
                                          className="h-16 w-16 rounded-xl object-cover"
                                        />
                                        <div className="flex-1 text-left">
                                          <p className="font-medium text-foreground">{option.name}</p>
                                          <p className="mt-0.5 text-xs text-muted-foreground">{option.description}</p>
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
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeMeal(selectedDay, mealType)}
                            disabled={isLocked}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      isLocked ? (
                        <Button
                          variant="outline"
                          className="flex-1 justify-start border-dashed text-muted-foreground"
                          disabled
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Dodaj posiłek
                        </Button>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1 justify-start border-dashed text-muted-foreground"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Dodaj posiłek
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Dodaj posiłek</DialogTitle>
                              <DialogDescription>
                                Wybierz posiłek na {mealType.toLowerCase()}
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
                                      className="h-16 w-16 rounded-xl object-cover"
                                    />
                                    <div className="flex-1 text-left">
                                      <p className="font-medium text-foreground">{option.name}</p>
                                      <p className="mt-0.5 text-xs text-muted-foreground">{option.description}</p>
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
                      )
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-xl bg-primary/10 p-4 sm:flex-row sm:items-center sm:justify-between">
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
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
