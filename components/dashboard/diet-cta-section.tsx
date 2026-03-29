import Link from "next/link"
import { Button } from "@/components/ui/button"

export function DietCtaSection() {
  return (
    <div className="rounded-2xl border border-border/50 bg-gradient-to-tr from-secondary/70 via-secondary/50 to-secondary/30 p-6 shadow-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Dopasuj dietę do siebie</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Nasza aplikacja prowadzi Cię krok po kroku: wybierz cel (redukcja, masa, balans lub keto), złóż plan posiłków do aktywności i preferencji,
            a następnie rozpocznij dostawy idealnie pasujące do Twojego trybu życia.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/dashboard/start">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Kontynuuj dietę z FeatMeal</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
