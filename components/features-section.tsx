import { Dumbbell, Truck, ChefHat, Target, Clock, Heart } from "lucide-react"

const features = [
  {
    icon: Dumbbell,
    title: "Dla sportowców",
    description: "Posiłki dopasowane do Twojego planu treningowego i celów fitness."
  },
  {
    icon: ChefHat,
    title: "Profesjonalni kucharze",
    description: "Nasi szefowie kuchni tworzą posiłki z najwyższej jakości składników."
  },
  {
    icon: Truck,
    title: "Dostawa pod drzwi",
    description: "Świeże posiłki dostarczamy codziennie rano, zanim wyjdziesz z domu."
  },
  {
    icon: Target,
    title: "Makra na miarę",
    description: "Każdy posiłek z dokładnie obliczonymi wartościami odżywczymi."
  },
  {
    icon: Clock,
    title: "Oszczędność czasu",
    description: "Zapomnij o gotowaniu i zakupach. My zajmiemy się wszystkim."
  },
  {
    icon: Heart,
    title: "Zdrowe składniki",
    description: "Bez konserwantów, sztucznych barwników i zbędnych dodatków."
  }
]

export function FeaturesSection() {
  return (
    <section id="oferta" className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Dlaczego <span className="text-primary">FitMeal</span>?
          </h2>
          <p className="text-lg text-muted-foreground">
            Tworzymy posiłki, które wspierają Twój aktywny styl życia i pomagają osiągnąć cele sportowe.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border/50 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
