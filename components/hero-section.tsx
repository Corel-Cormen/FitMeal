import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Leaf, Timer } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              Catering dla sportowców
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Jedz zdrowo,{" "}
              <span className="text-primary">trenuj mocniej</span>
            </h1>

            <p className="max-w-lg text-pretty text-lg text-muted-foreground">
              Dostarczamy zbilansowane posiłki stworzone specjalnie dla aktywnych ludzi.
              Białko, węglowodany i tłuszcze w idealnych proporcjach dla Twoich celów.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button size="lg" asChild className="group">
                <Link href="/login?mode=register">
                  Zamów teraz
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#menu">Zobacz menu</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">100% naturalne</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Timer className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Dostawa 6:00 - 8:00</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-3xl" />
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=500&fit=crop"
                    alt="Zdrowy posiłek z warzywami"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-2xl bg-secondary">
                  <img
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=400&fit=crop"
                    alt="Bowl z kurczakiem i warzywami"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square overflow-hidden rounded-2xl bg-secondary">
                  <img
                    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop"
                    alt="Sałatka z awokado"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
                  <img
                    src="https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=500&fit=crop"
                    alt="Posiłek proteinowy"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
