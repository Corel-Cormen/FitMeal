"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Search,
  ChevronRight,
  Send,
  FileText,
  Truck,
  CreditCard,
  Utensils,
  Settings,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from "lucide-react"

const faqCategories = [
  {
    id: "zamowienia",
    label: "Zamowienia",
    icon: Truck,
    questions: [
      {
        q: "Jak moge zlozyc zamowienie?",
        a: "Aby zlozyc zamowienie, wybierz odpowiedni plan dietetyczny w panelu zakupu. Mozesz wybrac typ diety, liczbe kalorii, okres trwania i metode platnosci. Po zakonczeniu procesu zamowienia, otrzymasz potwierdzenie na email."
      },
      {
        q: "Czy moge zmienic zamowienie po jego zlozeniu?",
        a: "Tak, mozesz wprowadzac zmiany do zamowienia do godziny 18:00 dnia poprzedzajacego dostawe. Zmiany mozesz wprowadzic w sekcji 'Plan tygodnia' lub kontaktujac sie z naszym zespolem wsparcia."
      },
      {
        q: "Jak anulowac zamowienie?",
        a: "Zamowienie mozesz anulowac do 48 godzin przed planowana dostawa. Wejdz w szczegoly zamowienia i kliknij 'Anuluj zamowienie'. Zwrot srodkow nastapi w ciagu 3-5 dni roboczych."
      },
      {
        q: "O ktorej godzinie jest dostawa?",
        a: "Dostawy realizujemy w godzinach 6:00-9:00 rano. Mozesz ustawic preferowane okno czasowe w ustawieniach dostawy. Przed dostawa otrzymasz SMS z informacja o przyblizonej godzinie."
      },
    ]
  },
  {
    id: "diety",
    label: "Diety",
    icon: Utensils,
    questions: [
      {
        q: "Jakie diety oferujecie?",
        a: "Oferujemy 4 glowne typy diet: Masa (dla osob budujacych mase miesniowa), Redukcja (dla osob odchudzajacych sie), Balans (zbilansowana dieta utrzymujaca), Keto (dieta ketogeniczna). Kazda dieta moze byc dostosowana pod katem kalorii i preferencji."
      },
      {
        q: "Czy moge dostosowac diete do moich preferencji?",
        a: "Tak! W panelu preferencji mozesz ustawic swoje wymagania dietetyczne (wegetarianska, weganska, bez glutenu), wykluczyc alergeny oraz dodac skladniki, ktorych nie lubisz lub ktore preferujesz."
      },
      {
        q: "Ile kalorii zawieraja posilki?",
        a: "Kazdy posilek ma dokladnie wyliczone wartosci odzywcze. Mozesz wybrac dzienny limit kalorii od 1200 do 4000 kcal. Szczegolowe informacje o kazdym posilku (kalorie, bialko, weglowodany, tluszcze) znajdziesz w planie tygodniowym."
      },
      {
        q: "Czy posilki sa swieze?",
        a: "Tak, wszystkie posilki sa przygotowywane codziennie rano z swiezych skladnikow. Nie uzywamy konserwantow ani sztucznych dodatkow. Posilki nalezy spozyc w ciagu 48 godzin od dostawy."
      },
    ]
  },
  {
    id: "platnosci",
    label: "Platnosci",
    icon: CreditCard,
    questions: [
      {
        q: "Jakie metody platnosci akceptujecie?",
        a: "Akceptujemy karty platnicze (Visa, Mastercard), BLIK, przelewy online (PayU, Przelewy24) oraz platnosc przy odbiorze gotowka lub karta."
      },
      {
        q: "Czy moge placic miesiecznie?",
        a: "Tak, oferujemy elastyczne opcje platnosci. Mozesz oplacic caly okres z gory (z rabatem do 15%) lub rozlozyc platnosc na raty miesieczne bez dodatkowych kosztow."
      },
      {
        q: "Jak otrzymam fakture?",
        a: "Faktura VAT jest automatycznie generowana po kazdej platnosci i wysylana na Twoj adres email. Mozesz tez pobrac faktury z sekcji 'Historia platnosci' w ustawieniach konta."
      },
      {
        q: "Co jesli platnosc sie nie powiodla?",
        a: "Jesli platnosc sie nie powiodla, otrzymasz powiadomienie z instrukcja ponowienia platnosci. Masz 24 godziny na uregulowanie platnosci, zanim zamowienie zostanie wstrzymane."
      },
    ]
  },
  {
    id: "konto",
    label: "Konto",
    icon: Settings,
    questions: [
      {
        q: "Jak zmienic haslo?",
        a: "Wejdz w Ustawienia > Profil > Bezpieczenstwo i kliknij 'Zmien haslo'. Bedziesz musial podac aktualne haslo oraz nowe haslo (minimum 8 znakow, w tym cyfra i znak specjalny)."
      },
      {
        q: "Jak usunac konto?",
        a: "Aby usunac konto, wejdz w Ustawienia > Opcje > Usun konto. Pamietaj, ze ta operacja jest nieodwracalna. Przed usunieciem musisz anulowac wszystkie aktywne subskrypcje."
      },
      {
        q: "Jak zmienic adres dostawy?",
        a: "Adres dostawy mozesz zmienic w Ustawieniach > Dostawa. Zmiana adresu wejdzie w zycie od nastepnej dostawy. Pamietaj, ze dostarczamy tylko na terenie wybranych miast."
      },
      {
        q: "Czy moge miec kilka adresow dostawy?",
        a: "Tak, mozesz dodac do 3 adresow dostawy (np. dom, praca, silownia). Przed kazda dostawa mozesz wybrac, na ktory adres ma trafic zamowienie."
      },
    ]
  },
]

const quickGuides = [
  {
    title: "Pierwsze kroki",
    description: "Jak rozpoczac przygode z FitMeal",
    icon: BookOpen,
    steps: [
      "Wybierz plan dietetyczny dopasowany do Twoich celow",
      "Ustaw preferencje zywieniowe i wyklucz alergeny",
      "Podaj adres dostawy i wybierz godzine",
      "Dokonaj platnosci i czekaj na pierwsza dostawe"
    ]
  },
  {
    title: "Planowanie posilkow",
    description: "Jak korzystac z planera tygodniowego",
    icon: FileText,
    steps: [
      "Przejdz do sekcji 'Plan tygodnia'",
      "Kliknij na dzien, ktory chcesz edytowac",
      "Dodaj lub zamien posilki wedlug preferencji",
      "Zapisz zmiany przed godzina 18:00"
    ]
  },
  {
    title: "Sledzenie dostawy",
    description: "Jak sledzic swoje zamowienie",
    icon: Truck,
    steps: [
      "Przejdz do sekcji 'Moje zamowienia'",
      "Kliknij na aktywne zamowienie",
      "Sledz status w czasie rzeczywistym",
      "Skontaktuj sie z kierowca w razie potrzeby"
    ]
  },
]

interface HelpCenterProps {
  trigger?: React.ReactNode
}

export function HelpCenter({ trigger }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("zamowienia")
  const [contactForm, setContactForm] = useState({
    topic: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const filteredQuestions = faqCategories.flatMap(cat => 
    cat.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(q => ({ ...q, category: cat.label }))
  )

  const handleSubmitContact = () => {
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setContactForm({ topic: "", message: "" })
    }, 3000)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="relative">
            <HelpCircle className="h-5 w-5" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Centrum pomocy
          </SheetTitle>
          <SheetDescription>
            Znajdz odpowiedzi na pytania lub skontaktuj sie z nami
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Szukaj w FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {searchQuery && filteredQuestions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Wyniki wyszukiwania ({filteredQuestions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredQuestions.slice(0, 5).map((q, idx) => (
                    <AccordionItem key={idx} value={`search-${idx}`} className="border-none">
                      <AccordionTrigger className="rounded-lg bg-secondary/50 px-4 py-3 text-left text-sm hover:bg-secondary hover:no-underline">
                        <div>
                          <Badge variant="outline" className="mb-1 text-xs">
                            {q.category}
                          </Badge>
                          <p>{q.q}</p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-2 text-sm text-muted-foreground">
                        {q.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="guides">Poradniki</TabsTrigger>
              <TabsTrigger value="contact">Kontakt</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                {faqCategories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="gap-2"
                  >
                    <cat.icon className="h-4 w-4" />
                    {cat.label}
                  </Button>
                ))}
              </div>

              <Accordion type="single" collapsible className="space-y-2">
                {faqCategories
                  .find(c => c.id === selectedCategory)
                  ?.questions.map((q, idx) => (
                    <AccordionItem key={idx} value={`faq-${idx}`} className="border-none">
                      <AccordionTrigger className="rounded-lg bg-secondary/50 px-4 py-3 text-left text-sm hover:bg-secondary hover:no-underline">
                        {q.q}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-2 text-sm text-muted-foreground">
                        {q.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="guides" className="mt-4 space-y-4">
              {quickGuides.map((guide, idx) => (
                <Card key={idx}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <guide.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{guide.title}</CardTitle>
                        <CardDescription>{guide.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2">
                      {guide.steps.map((step, stepIdx) => (
                        <li key={stepIdx} className="flex items-start gap-3 text-sm">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                            {stepIdx + 1}
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="contact" className="mt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Card className="cursor-pointer transition-colors hover:bg-secondary/50">
                  <CardContent className="flex flex-col items-center p-4 text-center">
                    <div className="mb-2 rounded-full bg-primary/10 p-3">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium">Telefon</p>
                    <p className="text-xs text-muted-foreground">+48 123 456 789</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer transition-colors hover:bg-secondary/50">
                  <CardContent className="flex flex-col items-center p-4 text-center">
                    <div className="mb-2 rounded-full bg-primary/10 p-3">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-xs text-muted-foreground">pomoc@fitmeal.pl</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer transition-colors hover:bg-secondary/50">
                  <CardContent className="flex flex-col items-center p-4 text-center">
                    <div className="mb-2 rounded-full bg-primary/10 p-3">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium">Chat</p>
                    <p className="text-xs text-muted-foreground">Odpowiedz w 5 min</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Wyslij wiadomosc</CardTitle>
                  <CardDescription>
                    Odpowiemy najszybciej jak to mozliwe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isSubmitted ? (
                    <div className="flex flex-col items-center py-8 text-center">
                      <div className="mb-4 rounded-full bg-green-100 p-3">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium">Wiadomosc wyslana!</h3>
                      <p className="text-sm text-muted-foreground">
                        Odpowiemy w ciagu 24 godzin
                      </p>
                    </div>
                  ) : (
                    <>
                      <Select
                        value={contactForm.topic}
                        onValueChange={(value) => setContactForm(prev => ({ ...prev, topic: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz temat" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="order">Problem z zamowieniem</SelectItem>
                          <SelectItem value="delivery">Dostawa</SelectItem>
                          <SelectItem value="payment">Platnosci</SelectItem>
                          <SelectItem value="diet">Pytanie o diete</SelectItem>
                          <SelectItem value="account">Konto uzytkownika</SelectItem>
                          <SelectItem value="other">Inne</SelectItem>
                        </SelectContent>
                      </Select>

                      <Textarea
                        placeholder="Opisz swoj problem lub pytanie..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        rows={4}
                      />

                      <Button 
                        onClick={handleSubmitContact}
                        disabled={!contactForm.topic || !contactForm.message}
                        className="w-full gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Wyslij wiadomosc
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="flex items-start gap-3 p-4">
                  <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Godziny pracy</p>
                    <p className="text-xs text-amber-700">
                      Pn-Pt: 8:00-20:00, Sb: 9:00-15:00, Nd: nieczynne
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="bg-primary/5">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Sredni czas odpowiedzi</p>
                <p className="text-2xl font-bold text-primary">{"< 2h"}</p>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}
