import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    description: "Idealny na początek Twojej przygody z zdrowym odżywianiem",
    price: "49",
    period: "dzień",
    features: [
      "3 posiłki dziennie",
      "Plan na 1-2 tygodnie",
      "Podstawowe makra",
      "Dostawa 6:00-8:00",
      "Wsparcie e-mail"
    ],
    popular: false
  },
  {
    name: "Pro",
    description: "Dla osób poważnie traktujących swoje cele fitness",
    price: "69",
    period: "dzień",
    features: [
      "5 posiłków dziennie",
      "Plan na miesiąc",
      "Personalizacja makr",
      "Dostawa o wybranej godzinie",
      "Konsultacja z dietetykiem",
      "Priorytetowe wsparcie"
    ],
    popular: true
  },
  {
    name: "Elite",
    description: "Maksymalne wsparcie dla profesjonalnych sportowców",
    price: "99",
    period: "dzień",
    features: [
      "6 posiłków dziennie",
      "Elastyczny plan",
      "Pełna personalizacja",
      "Dostawa 2x dziennie",
      "Dedykowany dietetyk",
      "Suplementacja w cenie",
      "Wsparcie 24/7"
    ],
    popular: false
  }
]

export function PricingSection() {
  return (
    <section id="cennik" className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Wybierz <span className="text-primary">plan</span> dla siebie
          </h2>
          <p className="text-lg text-muted-foreground">
            Elastyczne plany cenowe dostosowane do Twoich potrzeb i celów treningowych.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border bg-card p-8 transition-all ${
                plan.popular
                  ? "border-primary shadow-xl shadow-primary/10 scale-105"
                  : "border-border/50 hover:border-primary/30 hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                    Najpopularniejszy
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price} zł</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                asChild
              >
                <Link href="#register">Wybierz plan</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
