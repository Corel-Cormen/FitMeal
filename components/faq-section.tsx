"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Search,
  Truck,
  CreditCard,
  Utensils,
  Settings,
  Phone,
  Mail,
} from "lucide-react"
import { LiveChatTrigger } from "./live-chat"

const faqData = [
  {
    category: "Zamowienia i dostawa",
    icon: Truck,
    questions: [
      {
        q: "Jak moge zlozyc zamowienie?",
        a: "Wybierz plan dietetyczny, dostosuj go do swoich potrzeb (kalorie, preferencje), podaj adres dostawy i dokonaj platnosci. To zajmie tylko kilka minut!"
      },
      {
        q: "O ktorej godzinie dostarczacie posilki?",
        a: "Dostawy realizujemy codziennie w godzinach 6:00-9:00 rano. Mozesz ustawic preferowane okno czasowe w swoim profilu."
      },
      {
        q: "Czy moge zmienic menu po zlozeniu zamowienia?",
        a: "Tak! Zmiany mozesz wprowadzac do godziny 18:00 dnia poprzedzajacego dostawe przez panel uzytkownika."
      },
      {
        q: "W jakich miastach dostarczacie?",
        a: "Obecnie dostarczamy w Warszawie, Krakowie, Wroclawiu, Poznaniu i Gdansku. Stale rozszerzamy zasieg!"
      },
    ]
  },
  {
    category: "Diety i posilki",
    icon: Utensils,
    questions: [
      {
        q: "Jakie typy diet oferujecie?",
        a: "Oferujemy 4 glowne typy: Masa (budowanie miesni), Redukcja (odchudzanie), Balans (utrzymanie wagi) i Keto (dieta ketogeniczna)."
      },
      {
        q: "Czy uwzgledniacie alergie pokarmowe?",
        a: "Tak! W panelu preferencji mozesz oznaczyc wszystkie alergeny i skladniki, ktorych chcesz unikac. Nasz system automatycznie dobierze odpowiednie posilki."
      },
      {
        q: "Czy posilki sa swieze?",
        a: "Wszystkie posilki przygotowujemy codziennie rano z swiezych, lokalnych skladnikow. Nie uzywamy konserwantow ani sztucznych dodatkow."
      },
      {
        q: "Ile kalorii maja posilki?",
        a: "Mozesz wybrac dzienny limit od 1200 do 4000 kcal. Kazdy posilek ma szczegolowo wyliczone makroskładniki (bialko, weglowodany, tluszcze)."
      },
    ]
  },
  {
    category: "Platnosci i subskrypcje",
    icon: CreditCard,
    questions: [
      {
        q: "Jakie metody platnosci akceptujecie?",
        a: "Akceptujemy karty (Visa, Mastercard), BLIK, przelewy online oraz platnosc przy odbiorze. Oferujemy tez raty 0%."
      },
      {
        q: "Czy moge zrezygnowac z subskrypcji?",
        a: "Tak, mozesz anulowac subskrypcje w dowolnym momencie. Zwrot za niewykorzystany okres zostanie przelany w ciagu 5 dni roboczych."
      },
      {
        q: "Czy sa rabaty przy dluzszych subskrypcjach?",
        a: "Tak! Przy 2-miesięcznej subskrypcji otrzymasz 10% rabatu, a przy 3-miesiecznej az 15% znizki."
      },
      {
        q: "Jak otrzymam fakture?",
        a: "Faktura VAT jest automatycznie generowana i wysylana na Twoj email po kazdej platnosci."
      },
    ]
  },
  {
    category: "Konto i ustawienia",
    icon: Settings,
    questions: [
      {
        q: "Jak zmienic adres dostawy?",
        a: "W panelu uzytkownika wejdz w Ustawienia > Dostawa. Mozesz dodac do 3 adresow (dom, praca, silownia) i wybierac miedzy nimi."
      },
      {
        q: "Jak wstrzymac dostawy na czas urlopu?",
        a: "W planie tygodniowym mozesz oznaczyc dni bez dostawy. Mozesz tez tymczasowo zawiesic subskrypcje w ustawieniach."
      },
      {
        q: "Czy moge zmienic typ diety w trakcie subskrypcji?",
        a: "Tak! Mozesz zmienic typ diety, liczbe kalorii i preferencje w dowolnym momencie. Zmiany wejda w zycie od nastepnej dostawy."
      },
      {
        q: "Jak usunac konto?",
        a: "Mozesz usunac konto w Ustawieniach > Opcje. Pamietaj, ze wszystkie dane zostana trwale usuniete."
      },
    ]
  },
]

export function FAQSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredData = searchQuery
    ? faqData.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.questions.length > 0)
    : faqData

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Czesto zadawane <span className="text-primary">pytania</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Znajdz odpowiedzi na najczestsze pytania. Jesli nie znajdziesz odpowiedzi, skontaktuj sie z nami!
          </p>

          <div className="relative mt-8">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Szukaj w FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-12 text-base"
            />
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            onClick={() => setActiveCategory(null)}
          >
            Wszystkie
          </Button>
          {faqData.map((cat) => (
            <Button
              key={cat.category}
              variant={activeCategory === cat.category ? "default" : "outline"}
              onClick={() => setActiveCategory(cat.category)}
              className="gap-2"
            >
              <cat.icon className="h-4 w-4" />
              {cat.category}
            </Button>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-8">
          {filteredData
            .filter(cat => activeCategory === null || cat.category === activeCategory)
            .map((category) => (
              <div key={category.category}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{category.category}</h3>
                </div>

                <Accordion type="single" collapsible className="space-y-3">
                  {category.questions.map((q, idx) => (
                    <AccordionItem
                      key={idx}
                      value={`${category.category}-${idx}`}
                      className="rounded-xl border border-border bg-card px-4 shadow-sm"
                    >
                      <AccordionTrigger className="py-4 text-left text-base font-medium hover:no-underline">
                        {q.q}
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 text-muted-foreground">
                        {q.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
        </div>

        {filteredData.length === 0 && (
          <div className="mx-auto mt-12 max-w-md text-center">
            <p className="text-muted-foreground">
              Nie znaleziono wynikow dla &ldquo;{searchQuery}&rdquo;
            </p>
            <Button
              variant="link"
              onClick={() => setSearchQuery("")}
              className="mt-2"
            >
              Wyczysc wyszukiwanie
            </Button>
          </div>
        )}

        <Card className="mx-auto mt-16 max-w-2xl bg-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle>Nie znalazles odpowiedzi?</CardTitle>
            <CardDescription>
              Skontaktuj sie z nami - chetnie pomozemy!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="gap-2">
                <Phone className="h-4 w-4" />
                +48 123 456 789
              </Button>
              <Button variant="outline" className="gap-2">
                <Mail className="h-4 w-4" />
                pomoc@fitmeal.pl
              </Button>
              <LiveChatTrigger className="gap-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
