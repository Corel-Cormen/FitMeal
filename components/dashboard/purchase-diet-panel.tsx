"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { 
  Check, 
  Dumbbell, 
  Flame, 
  Leaf, 
  Zap,
  Calendar,
  CreditCard,
  ChevronRight,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp
} from "lucide-react"

const dietTypes = [
  { 
    id: "mass", 
    name: "Masa", 
    description: "Budowanie masy mięśniowej", 
    icon: TrendingUp,
    kcal: "2800-3500",
    color: "text-blue-500"
  },
  { 
    id: "reduction", 
    name: "Redukcja", 
    description: "Spalanie tkanki tłuszczowej", 
    icon: TrendingDown,
    kcal: "1800-2200",
    color: "text-orange-500"
  },
  { 
    id: "balance", 
    name: "Balans", 
    description: "Utrzymanie obecnej wagi", 
    icon: Target,
    kcal: "2200-2600",
    color: "text-green-500"
  },
  { 
    id: "keto", 
    name: "Keto", 
    description: "Dieta ketogeniczna", 
    icon: Zap,
    kcal: "2000-2500",
    color: "text-purple-500"
  },
]

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Idealny na początek",
    price: 49,
    meals: 3,
    features: [
      "3 posiłki dziennie",
      "Podstawowe makra",
      "Dostawa 6:00-8:00",
    ],
    popular: false
  },
  {
    id: "pro",
    name: "Pro",
    description: "Dla aktywnych sportowców",
    price: 69,
    meals: 5,
    features: [
      "5 posiłków dziennie",
      "Personalizacja makr",
      "Dostawa o wybranej godzinie",
      "Konsultacja z dietetykiem",
    ],
    popular: true
  },
  {
    id: "elite",
    name: "Elite",
    description: "Maksymalne wsparcie",
    price: 99,
    meals: 6,
    features: [
      "6 posiłków dziennie",
      "Pełna personalizacja",
      "Dostawa 2x dziennie",
      "Dedykowany dietetyk",
    ],
    popular: false
  }
]

const durations = [
  { days: 7, label: "1 tydzień", discount: 0 },
  { days: 14, label: "2 tygodnie", discount: 5 },
  { days: 30, label: "1 miesiąc", discount: 10 },
  { days: 90, label: "3 miesiące", discount: 15 },
]

interface PurchaseDietPanelProps {
  onPurchase: () => void
}

export function PurchaseDietPanel({ onPurchase }: PurchaseDietPanelProps) {
  const [step, setStep] = useState(1)
  const [selectedDiet, setSelectedDiet] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("")
  const [selectedDuration, setSelectedDuration] = useState(14)
  const [kcalTarget, setKcalTarget] = useState([2500])

  const selectedPlanData = plans.find(p => p.id === selectedPlan)
  const selectedDurationData = durations.find(d => d.days === selectedDuration)
  
  const calculatePrice = () => {
    if (!selectedPlanData || !selectedDurationData) return 0
    const basePrice = selectedPlanData.price * selectedDurationData.days
    const discount = (basePrice * selectedDurationData.discount) / 100
    return basePrice - discount
  }

  const canProceed = () => {
    if (step === 1) return selectedDiet !== ""
    if (step === 2) return selectedPlan !== ""
    if (step === 3) return selectedDuration > 0
    return false
  }

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Rozpocznij swoją przygodę z FitMeal</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Skonfiguruj dietę dopasowaną do Twoich celów
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Cel", icon: Target },
              { num: 2, label: "Plan", icon: Dumbbell },
              { num: 3, label: "Okres", icon: Calendar },
              { num: 4, label: "Płatność", icon: CreditCard },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                      step >= s.num 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className={`text-xs font-medium ${
                    step >= s.num ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {s.label}
                  </span>
                </div>
                {i < 3 && (
                  <div className={`mx-2 h-0.5 w-12 sm:w-20 ${
                    step > s.num ? "bg-primary" : "bg-border"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select Diet Type */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Wybierz typ diety
            </h3>
            <RadioGroup value={selectedDiet} onValueChange={setSelectedDiet}>
              <div className="grid gap-3 sm:grid-cols-2">
                {dietTypes.map((diet) => (
                  <div
                    key={diet.id}
                    onClick={() => setSelectedDiet(diet.id)}
                    className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all ${
                      selectedDiet === diet.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border/50 hover:border-primary/30"
                    }`}
                  >
                    <RadioGroupItem value={diet.id} id={diet.id} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <diet.icon className={`h-5 w-5 ${diet.color}`} />
                        <span className="font-semibold text-foreground">{diet.name}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{diet.description}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        <Flame className="mr-1 inline h-3 w-3" />
                        {diet.kcal} kcal/dzień
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {selectedDiet && (
              <div className="mt-6 rounded-xl bg-secondary/50 p-4">
                <Label className="text-sm font-medium">Docelowe kalorie dziennie</Label>
                <div className="mt-4 px-2">
                  <Slider 
                    value={kcalTarget}
                    onValueChange={setKcalTarget}
                    min={1500}
                    max={4000}
                    step={100}
                  />
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">1500 kcal</span>
                    <span className="font-bold text-primary">{kcalTarget[0]} kcal</span>
                    <span className="text-muted-foreground">4000 kcal</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Plan */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Wybierz plan
            </h3>
            <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
              <div className="grid gap-4 sm:grid-cols-3">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all ${
                      selectedPlan === plan.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border/50 hover:border-primary/30"
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary">
                        Polecany
                      </Badge>
                    )}
                    <RadioGroupItem value={plan.id} id={plan.id} className="sr-only" />
                    <div className="text-center">
                      <h4 className="font-bold text-foreground">{plan.name}</h4>
                      <p className="text-xs text-muted-foreground">{plan.description}</p>
                      <div className="my-3">
                        <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                        <span className="text-muted-foreground"> zł/dzień</span>
                      </div>
                      <Badge variant="secondary" className="mb-3">
                        {plan.meals} posiłków
                      </Badge>
                      <ul className="space-y-2 text-left">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs">
                            <Check className="h-3 w-3 text-primary" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 3: Select Duration */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Wybierz okres
            </h3>
            <RadioGroup 
              value={selectedDuration.toString()} 
              onValueChange={(v) => setSelectedDuration(parseInt(v))}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {durations.map((duration) => (
                  <div
                    key={duration.days}
                    onClick={() => setSelectedDuration(duration.days)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all ${
                      selectedDuration === duration.days 
                        ? "border-primary bg-primary/5" 
                        : "border-border/50 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={duration.days.toString()} id={`duration-${duration.days}`} />
                      <div>
                        <span className="font-semibold text-foreground">{duration.label}</span>
                        <p className="text-xs text-muted-foreground">{duration.days} dni</p>
                      </div>
                    </div>
                    {duration.discount > 0 && (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                        -{duration.discount}%
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </RadioGroup>

            {selectedPlanData && (
              <div className="mt-6 rounded-xl bg-secondary/50 p-4">
                <h4 className="font-semibold text-foreground">Podsumowanie</h4>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan {selectedPlanData.name}</span>
                    <span className="text-foreground">{selectedPlanData.price} zł/dzień</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Okres</span>
                    <span className="text-foreground">{selectedDurationData?.label}</span>
                  </div>
                  {selectedDurationData && selectedDurationData.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Rabat</span>
                      <span>-{selectedDurationData.discount}%</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Suma</span>
                      <span className="text-xl font-bold text-primary">{calculatePrice()} zł</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">
              Potwierdź zamówienie
            </h3>

            <div className="rounded-xl border border-border/50 p-4">
              <h4 className="font-semibold text-foreground">Twoje zamówienie</h4>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Typ diety</span>
                  <span className="font-medium text-foreground">
                    {dietTypes.find(d => d.id === selectedDiet)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium text-foreground">{selectedPlanData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Okres</span>
                  <span className="font-medium text-foreground">{selectedDurationData?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kalorie dziennie</span>
                  <span className="font-medium text-foreground">{kcalTarget[0]} kcal</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-foreground">Do zapłaty</span>
                    <span className="text-2xl font-bold text-primary">{calculatePrice()} zł</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-primary/10 p-4">
              <div className="flex items-start gap-3">
                <Leaf className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Gwarancja satysfakcji</p>
                  <p className="text-sm text-muted-foreground">
                    Jeśli nie będziesz zadowolony, zwrócimy Ci pieniądze za niewykorzystane dni.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={onPurchase}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Zapłać {calculatePrice()} zł
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Wstecz
            </Button>
          ) : (
            <div />
          )}
          
          {step < 4 && (
            <Button 
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
            >
              Dalej
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
