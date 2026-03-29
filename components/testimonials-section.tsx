import Link from "next/link"
import { ArrowRight, Quote } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const testimonials = [
  {
    name: "Kasia",
    meta: "Kraków • redukcja",
    text: "FitMeal uratował mi tydzień — przestałam podjadać, bo zawsze mam pod ręką sensowny posiłek. Kalorie i makra są policzone, a jedzenie smakuje jak z dobrej restauracji.",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    name: "Michał",
    meta: "Warszawa • masa",
    text: "Trenuję 4–5 razy w tygodniu i w końcu jem regularnie. Porcje są konkretne, a dostawa rano działa bez zarzutu. Najbardziej cenię to, że nie muszę planować zakupów.",
    photo: "https://images.unsplash.com/photo-1583500179017-12d75b04e351?w=100&h=100&fit=crop",
  },
  {
    name: "Ola",
    meta: "Wrocław • balans",
    text: "Mega wygodne i naprawdę świeże. Menu jest różnorodne, a w dni zabiegane to po prostu spokój w głowie. Poleciłam już kilku znajomym z pracy.",
    photo: "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=100&h=100&fit=crop",
  },
]

export function TestimonialsSection() {
  return (
    <section id="opinie" className="py-20 sm:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Zadowoleni <span className="text-primary">klienci</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Zobacz, co mówią osoby, które już zamawiają FitMeal.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-border/50">
              <CardHeader className="flex flex-row items-start gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={t.photo}
                    alt={`Zdjęcie klienta: ${t.name}`}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {t.name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground leading-none">{t.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t.meta}</p>
                </div>
                <Quote className="ml-auto h-5 w-5 text-primary/60" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button size="lg" asChild className="group">
            <Link href="/login?mode=login">
              Zamów teraz
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
