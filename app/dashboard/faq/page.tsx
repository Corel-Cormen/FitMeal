"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Search,
  Truck,
  CreditCard,
  Utensils,
  Settings,
  Phone,
  Mail,
  MessageCircle,
  Send,
  CheckCircle2,
  BookOpen,
  FileText,
  Video,
  ThumbsUp,
  ThumbsDown,
  Clock,
  ChevronRight,
  Sparkles,
  HelpCircle,
  ExternalLink,
} from "lucide-react"

const faqCategories = [
  {
    id: "zamowienia",
    label: "Zamowienia",
    icon: Truck,
    color: "bg-blue-500",
    questions: [
      {
        q: "Jak moge zlozyc zamowienie?",
        a: "Aby zlozyc zamowienie, przejdz do panelu zakupu diety. Wybierz typ diety, liczbe kalorii, plan cenowy i okres trwania. Po zakonczeniu procesu zamowienia otrzymasz potwierdzenie na email oraz w aplikacji.",
        helpful: 142,
        related: ["Jak zmienic zamowienie?", "Jak anulowac zamowienie?"]
      },
      {
        q: "Czy moge zmienic zamowienie po jego zlozeniu?",
        a: "Tak, mozesz wprowadzac zmiany do zamowienia do godziny 18:00 dnia poprzedzajacego dostawe. Zmiany mozesz wprowadzic w sekcji 'Plan tygodnia' klikajac na konkretny posilek i wybierajac 'Zamien' lub 'Edytuj'.",
        helpful: 98,
        related: ["Do kiedy moge zmienic menu?", "Jak dodac wlasne preferencje?"]
      },
      {
        q: "Jak anulowac zamowienie?",
        a: "Zamowienie mozesz anulowac do 48 godzin przed planowana dostawa. Wejdz w szczegoly zamowienia w sekcji 'Moje zamowienia' i kliknij 'Anuluj zamowienie'. Zwrot srodkow nastapi w ciagu 3-5 dni roboczych na konto, z ktorego dokonano platnosci.",
        helpful: 76,
        related: ["Jak otrzymac zwrot?", "Czy moge wstrzymac dostawy?"]
      },
      {
        q: "O ktorej godzinie jest dostawa?",
        a: "Dostawy realizujemy w godzinach 6:00-9:00 rano. Mozesz ustawic preferowane okno czasowe w Ustawieniach > Dostawa. Przed dostawa otrzymasz SMS z informacja o przyblizonej godzinie przyjazdu kuriera.",
        helpful: 203,
        related: ["Czy moge zmienic godzine dostawy?", "Co jesli nie ma mnie w domu?"]
      },
      {
        q: "Co jesli nie ma mnie w domu podczas dostawy?",
        a: "Mozesz ustawic miejsce pozostawienia paczki (np. pod drzwiami, u sasiada, w paczkomacie). Kurier zrobi zdjecie potwierdzajace dostawe. Mozesz tez podac kod do domofonu i instrukcje dla kuriera.",
        helpful: 167,
        related: ["Jak zmienic adres dostawy?", "Czy kurier dzwoni przed dostawa?"]
      },
    ]
  },
  {
    id: "diety",
    label: "Diety",
    icon: Utensils,
    color: "bg-green-500",
    questions: [
      {
        q: "Jakie diety oferujecie?",
        a: "Oferujemy 4 glowne typy diet: Masa (wysokokaloryczna dla osob budujacych mase miesniowa, 2500-4000 kcal), Redukcja (niskokaloryczna dla osob odchudzajacych sie, 1200-1800 kcal), Balans (zbilansowana dieta utrzymujaca, 1800-2200 kcal), Keto (dieta ketogeniczna, wysokotluszczowa, niskowiglowodanowa).",
        helpful: 312,
        related: ["Ktora dieta dla mnie?", "Czy moge zmienic typ diety?"]
      },
      {
        q: "Czy moge dostosowac diete do moich preferencji?",
        a: "Tak! W panelu preferencji mozesz: wybrac tryb diety (wegetarianska, weganska, bez glutenu), oznaczyc alergeny, wykluczyc skladniki ktorych nie lubisz, dodac ulubione produkty. System automatycznie dobierze posilki zgodne z Twoimi preferencjami.",
        helpful: 245,
        related: ["Jak dodac alergen?", "Gdzie zmieniam preferencje?"]
      },
      {
        q: "Ile kalorii zawieraja posilki?",
        a: "Kazdy posilek ma dokladnie wyliczone wartosci odzywcze. Mozesz wybrac dzienny limit kalorii od 1200 do 4000 kcal w krokach co 100 kcal. Szczegolowe informacje o kazdym posilku (kalorie, bialko, weglowodany, tluszcze, blonnik) znajdziesz w planie tygodniowym.",
        helpful: 189,
        related: ["Jak zmienic liczbe kalorii?", "Czy makra sa wyliczone?"]
      },
      {
        q: "Czy posilki sa swieze?",
        a: "Tak, wszystkie posilki sa przygotowywane codziennie rano z swiezych, lokalnych skladnikow. Nie uzywamy konserwantow, sztucznych barwnikow ani wzmacniaczy smaku. Posilki nalezy spozyc w ciagu 48 godzin od dostawy - przechowuj je w lodowce.",
        helpful: 278,
        related: ["Jak przechowywac posilki?", "Czy moge zamrozic posilki?"]
      },
      {
        q: "Czy oferujecie diety specjalistyczne?",
        a: "Tak! Poza standardowymi dietami oferujemy rowniez: diete bezlaktozowa, bezglutenowa, weganska, dla diabetykow (indeks glikemiczny), dla osob z nadcisnieniem (niskosodowa). Skontaktuj sie z nami, jesli potrzebujesz indywidualnej diety.",
        helpful: 134,
        related: ["Jak zamowic diete specjalistyczna?", "Czy macie dietetyka?"]
      },
    ]
  },
  {
    id: "platnosci",
    label: "Platnosci",
    icon: CreditCard,
    color: "bg-purple-500",
    questions: [
      {
        q: "Jakie metody platnosci akceptujecie?",
        a: "Akceptujemy: karty platnicze (Visa, Mastercard, American Express), BLIK, szybkie przelewy online (PayU, Przelewy24, Tpay), platnosc przy odbiorze (gotowka lub karta), Apple Pay i Google Pay.",
        helpful: 156,
        related: ["Czy moge placic przy odbiorze?", "Czy akceptujecie BLIK?"]
      },
      {
        q: "Czy moge placic miesiecznie?",
        a: "Tak, oferujemy elastyczne opcje platnosci. Mozesz oplacic caly okres z gory (z rabatem do 15%) lub rozlozyc platnosc na raty miesieczne bez dodatkowych kosztow. Raty 0% dostepne przy zamowieniach powyzej 500 zl.",
        helpful: 123,
        related: ["Jakie sa rabaty?", "Jak dziala platnosc ratalna?"]
      },
      {
        q: "Jak otrzymam fakture?",
        a: "Faktura VAT jest automatycznie generowana po kazdej platnosci i wysylana na Twoj adres email w ciagu 24 godzin. Mozesz tez pobrac wszystkie faktury z sekcji Ustawienia > Historia platnosci. Jesli potrzebujesz faktury na firme, uzupelnij dane firmy w ustawieniach.",
        helpful: 89,
        related: ["Jak pobrac fakture?", "Czy moge miec fakture na firme?"]
      },
      {
        q: "Co jesli platnosc sie nie powiodla?",
        a: "Jesli platnosc sie nie powiodla, otrzymasz powiadomienie email i w aplikacji z instrukcja ponowienia platnosci. Masz 24 godziny na uregulowanie platnosci. Po tym czasie zamowienie zostanie wstrzymane do momentu zaksiegowania platnosci.",
        helpful: 67,
        related: ["Jak ponowic platnosc?", "Dlaczego platnosc nie przeszla?"]
      },
    ]
  },
  {
    id: "konto",
    label: "Konto",
    icon: Settings,
    color: "bg-orange-500",
    questions: [
      {
        q: "Jak zmienic haslo?",
        a: "Wejdz w Ustawienia > Profil > Bezpieczenstwo i kliknij 'Zmien haslo'. Bedziesz musial podac aktualne haslo oraz nowe haslo. Nowe haslo musi miec minimum 8 znakow, w tym co najmniej jedna cyfre i jeden znak specjalny.",
        helpful: 134,
        related: ["Zapomnialem hasla", "Jak wlaczyc 2FA?"]
      },
      {
        q: "Jak usunac konto?",
        a: "Aby usunac konto, wejdz w Ustawienia > Opcje > Usun konto. Pamietaj, ze ta operacja jest nieodwracalna - wszystkie Twoje dane, historia zamowien i preferencje zostana trwale usuniete. Przed usunieciem musisz anulowac wszystkie aktywne subskrypcje.",
        helpful: 45,
        related: ["Czy moge odzyskac konto?", "Co sie stanie z moimi danymi?"]
      },
      {
        q: "Jak zmienic adres dostawy?",
        a: "Adres dostawy mozesz zmienic w Ustawieniach > Dostawa. Kliknij 'Edytuj' przy obecnym adresie lub 'Dodaj nowy adres'. Zmiana adresu wejdzie w zycie od nastepnej dostawy. Mozesz miec do 3 zapisanych adresow.",
        helpful: 187,
        related: ["Czy moge miec kilka adresow?", "Jak ustawic domyslny adres?"]
      },
      {
        q: "Jak wstrzymac subskrypcje na czas urlopu?",
        a: "W sekcji Plan tygodnia mozesz oznaczyc konkretne dni jako 'bez dostawy'. Mozesz tez tymczasowo zawiesic cala subskrypcje w Ustawieniach > Subskrypcja > Wstrzymaj. Subskrypcja zostanie wznowiona automatycznie po wybranym okresie.",
        helpful: 156,
        related: ["Na jak dlugo moge wstrzymac?", "Czy strace niewykorzystane dni?"]
      },
    ]
  },
]

const videoGuides = [
  {
    title: "Pierwsze kroki z FitMeal",
    duration: "3:24",
    thumbnail: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=300&h=200&fit=crop",
    views: 12453,
  },
  {
    title: "Jak zaplanowac tygodniowe menu",
    duration: "5:12",
    thumbnail: "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=200&fit=crop",
    views: 8921,
  },
  {
    title: "Sledzenie dostawy krok po kroku",
    duration: "2:45",
    thumbnail: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=300&h=200&fit=crop",
    views: 6234,
  },
  {
    title: "Ustawianie preferencji dietetycznych",
    duration: "4:08",
    thumbnail: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
    views: 5678,
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
      "Podaj adres dostawy i wybierz preferowane godziny",
      "Dokonaj platnosci i czekaj na pierwsza dostawe"
    ]
  },
  {
    title: "Planowanie posilkow",
    description: "Jak korzystac z planera tygodniowego",
    icon: FileText,
    steps: [
      "Przejdz do sekcji 'Plan tygodnia' w panelu",
      "Kliknij na dzien, ktory chcesz edytowac",
      "Dodaj, zamien lub usun posilki wedlug preferencji",
      "Zapisz zmiany przed godzina 18:00 poprzedniego dnia"
    ]
  },
  {
    title: "Sledzenie dostawy",
    description: "Jak sledzic swoje zamowienie w czasie rzeczywistym",
    icon: Truck,
    steps: [
      "Przejdz do sekcji 'Moje zamowienia'",
      "Kliknij na aktywne zamowienie aby zobaczyc szczegoly",
      "Sledz status dostawy na mapie w czasie rzeczywistym",
      "Skontaktuj sie z kierowca przez aplikacje w razie potrzeby"
    ]
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({})
  const [contactForm, setContactForm] = useState({
    topic: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const allQuestions = faqCategories.flatMap(cat => 
    cat.questions.map(q => ({ ...q, category: cat.label, categoryId: cat.id }))
  )

  const filteredQuestions = searchQuery
    ? allQuestions.filter(q => 
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : selectedCategory
      ? allQuestions.filter(q => q.categoryId === selectedCategory)
      : []

  const handleVote = (questionId: string, isHelpful: boolean) => {
    setHelpfulVotes(prev => ({ ...prev, [questionId]: isHelpful }))
  }

  const handleSubmitContact = () => {
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setContactForm({ topic: "", message: "" })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Centrum pomocy</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Jak mozemy Ci <span className="text-primary">pomoc</span>?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Przeszukaj baze wiedzy lub wybierz kategorie ponizej
            </p>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Wpisz pytanie lub slowo kluczowe..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (e.target.value) setSelectedCategory(null)
              }}
              className="h-14 pl-12 text-lg"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                Wyczysc
              </Button>
            )}
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {faqCategories.map((cat) => (
              <Card 
                key={cat.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCategory === cat.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
                  setSearchQuery("")
                }}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className={`rounded-lg ${cat.color} p-3`}>
                    <cat.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{cat.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {cat.questions.length} pytan
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {(searchQuery || selectedCategory) && (
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {searchQuery 
                    ? `Wyniki wyszukiwania (${filteredQuestions.length})`
                    : `${faqCategories.find(c => c.id === selectedCategory)?.label}`
                  }
                </h3>
                {(searchQuery || selectedCategory) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory(null)
                    }}
                  >
                    Pokaz wszystkie kategorie
                  </Button>
                )}
              </div>

              {filteredQuestions.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-3">
                  {filteredQuestions.map((q, idx) => {
                    const questionId = `${q.categoryId}-${idx}`
                    return (
                      <AccordionItem 
                        key={idx} 
                        value={questionId}
                        className="rounded-xl border border-border bg-card shadow-sm"
                      >
                        <AccordionTrigger className="px-5 py-4 text-left hover:no-underline">
                          <div className="flex items-start gap-3">
                            <Badge variant="outline" className="shrink-0 text-xs">
                              {q.category}
                            </Badge>
                            <span className="font-medium">{q.q}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-5 pb-5">
                          <p className="mb-4 text-muted-foreground">{q.a}</p>
                          
                          {q.related && q.related.length > 0 && (
                            <div className="mb-4 rounded-lg bg-secondary/50 p-3">
                              <p className="mb-2 text-xs font-medium text-muted-foreground">Powiazane pytania:</p>
                              <div className="flex flex-wrap gap-2">
                                {q.related.map((rel, relIdx) => (
                                  <Badge 
                                    key={relIdx} 
                                    variant="outline"
                                    className="cursor-pointer hover:bg-secondary"
                                    onClick={() => setSearchQuery(rel)}
                                  >
                                    {rel}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between border-t border-border pt-4">
                            <p className="text-sm text-muted-foreground">
                              Czy ta odpowiedz byla pomocna?
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                variant={helpfulVotes[questionId] === true ? "default" : "outline"}
                                size="sm"
                                className="gap-1"
                                onClick={() => handleVote(questionId, true)}
                              >
                                <ThumbsUp className="h-4 w-4" />
                                Tak ({q.helpful + (helpfulVotes[questionId] === true ? 1 : 0)})
                              </Button>
                              <Button
                                variant={helpfulVotes[questionId] === false ? "default" : "outline"}
                                size="sm"
                                className="gap-1"
                                onClick={() => handleVote(questionId, false)}
                              >
                                <ThumbsDown className="h-4 w-4" />
                                Nie
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              ) : (
                <Card className="py-12 text-center">
                  <CardContent>
                    <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-lg font-medium">Nie znaleziono wynikow</p>
                    <p className="mt-1 text-muted-foreground">
                      Sprobuj innych slow kluczowych lub skontaktuj sie z nami
                    </p>
                    <Button className="mt-4" onClick={() => setSearchQuery("")}>
                      Wyczysc wyszukiwanie
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {!searchQuery && !selectedCategory && (
            <>
              <div className="mb-12">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Popularne pytania</h3>
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    Najczesciej wyszukiwane
                  </Badge>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {allQuestions
                    .sort((a, b) => b.helpful - a.helpful)
                    .slice(0, 6)
                    .map((q, idx) => (
                      <Card 
                        key={idx}
                        className="cursor-pointer transition-colors hover:bg-secondary/50"
                        onClick={() => setSearchQuery(q.q)}
                      >
                        <CardContent className="flex items-center gap-3 p-4">
                          <Badge variant="outline" className="shrink-0 text-xs">
                            {q.category}
                          </Badge>
                          <p className="line-clamp-1 flex-1 text-sm">{q.q}</p>
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              <div className="mb-12">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Poradniki wideo</h3>
                  <Button variant="ghost" size="sm" className="gap-1">
                    Zobacz wszystkie
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {videoGuides.map((video, idx) => (
                    <Card key={idx} className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md">
                      <div className="relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="aspect-video w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="rounded-full bg-white/90 p-3">
                            <Video className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <Badge className="absolute bottom-2 right-2 bg-black/70">
                          {video.duration}
                        </Badge>
                      </div>
                      <CardContent className="p-3">
                        <p className="line-clamp-2 text-sm font-medium">{video.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {video.views.toLocaleString()} wyswietlen
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h3 className="mb-6 text-xl font-semibold">Poradniki krok po kroku</h3>
                <div className="grid gap-4 lg:grid-cols-3">
                  {quickGuides.map((guide, idx) => (
                    <Card key={idx}>
                      <CardHeader>
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
                        <ol className="space-y-3">
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
                </div>
              </div>
            </>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Nadal potrzebujesz pomocy?
              </CardTitle>
              <CardDescription>
                Skontaktuj sie z naszym zespolem wsparcia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <Card className="cursor-pointer border-2 border-transparent transition-colors hover:border-primary/20 hover:bg-secondary/50">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-3 rounded-full bg-primary/10 p-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium">Telefon</p>
                    <p className="text-sm text-muted-foreground">+48 123 456 789</p>
                    <p className="mt-2 text-xs text-muted-foreground">Pn-Pt: 8:00-20:00</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer border-2 border-transparent transition-colors hover:border-primary/20 hover:bg-secondary/50">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-3 rounded-full bg-primary/10 p-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">pomoc@fitmeal.pl</p>
                    <p className="mt-2 text-xs text-muted-foreground">Odpowiedz w 24h</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer border-2 border-primary/20 bg-primary/5 transition-colors hover:bg-primary/10">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-3 rounded-full bg-primary p-4">
                      <MessageCircle className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Dostepny teraz</p>
                    <div className="mt-2 flex items-center gap-1">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {isSubmitted ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="mb-4 rounded-full bg-green-100 p-4">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium">Wiadomosc wyslana!</h3>
                  <p className="mt-1 text-muted-foreground">
                    Odpowiemy najszybciej jak to mozliwe
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-medium">Wyslij wiadomosc</h4>
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
                      <SelectItem value="feedback">Opinia / Sugestia</SelectItem>
                      <SelectItem value="other">Inne</SelectItem>
                    </SelectContent>
                  </Select>

                  <Textarea
                    placeholder="Opisz swoj problem lub pytanie..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                  />

                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Sredni czas odpowiedzi: {"< 2 godziny"}
                    </p>
                    <Button 
                      onClick={handleSubmitContact}
                      disabled={!contactForm.topic || !contactForm.message}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Wyslij
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
