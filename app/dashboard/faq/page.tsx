"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useLiveChat } from "@/components/live-chat"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Play,
} from "lucide-react"

const faqCategories = [
  {
    id: "zamowienia",
    label: "Zamowienia",
    icon: Truck,
    color: "bg-blue-500",
    questions: [
      {
        q: "Jak mogę złożyć zamówienie?",
        a: "Aby złożyć zamówienie, przejdź do panelu zakupu diety. Wybierz typ diety, liczbę kalorii, plan cenowy i okres trwania. Po zakończeniu procesu zamówienia otrzymasz potwierdzenie na email oraz w aplikacji.",
        helpful: 142,
        related: ["Jak zmienić zamówienie?", "Jak anulować zamówienie?"]
      },
      {
        q: "Czy mogę zmienić zamówienie po jego złożeniu?",
        a: "Tak, możesz wprowadzać zmiany do zamówienia do godziny 18:00 dnia poprzedzającego dostawę. Zmiany możesz wprowadzić w sekcji 'Plan tygodnia' klikając na konkretny posiłek i wybierając 'Zamień' lub 'Edytuj'.",
        helpful: 98,
        related: ["Do kiedy mogę zmienić menu?", "Jak dodać własne preferencje?"]
      },
      {
        q: "Jak anulować zamówienie?",
        a: "Zamówienie możesz anulować do 48 godzin przed planowaną dostawą. Wejdź w szczegóły zamówienia w sekcji 'Moje zamówienia' i kliknij 'Anuluj zamówienie'. Zwrot środków nastąpi w ciągu 3-5 dni roboczych na konto, z którego dokonano płatności.",
        helpful: 76,
        related: ["Jak otrzymać zwrot?", "Czy mogę wstrzymać dostawy?"]
      },
      {
        q: "O której godzinie jest dostawa?",
        a: "Dostawy realizujemy w godzinach 6:00-9:00 rano. Możesz ustawić preferowane okno czasowe w Ustawieniach > Dostawa. Przed dostawą otrzymasz SMS z informacją o przybliżonej godzinie przyjazdu kuriera.",
        helpful: 203,
        related: ["Czy mogę zmienić godzinę dostawy?", "Co jeśli nie ma mnie w domu?"]
      },
      {
        q: "Co jeśli nie ma mnie w domu podczas dostawy?",
        a: "Możesz ustawić miejsce pozostawienia paczki (np. pod drzwiami, u sąsiada, w paczkomacie). Kurier zrobi zdjęcie potwierdzające dostawę. Możesz też podać kod do domofonu i instrukcje dla kuriera.",
        helpful: 167,
        related: ["Jak zmienić adres dostawy?", "Czy kurier dzwoni przed dostawą?"]
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
        a: "Oferujemy 4 główne typy diet: Masa (wysokokaloryczna dla osób budujących masę mięśniową, 2500-4000 kcal), Redukcja (niskokaloryczna dla osób odchudzających się, 1200-1800 kcal), Balans (zbilansowana dieta utrzymująca, 1800-2200 kcal), Keto (dieta ketogeniczna, wysokotłuszczowa, niskowęglowodanowa).",
        helpful: 312,
        related: ["Która dieta dla mnie?", "Czy mogę zmienić typ diety?"]
      },
      {
        q: "Czy mogę dostosować dietę do moich preferencji?",
        a: "Tak! W panelu preferencji możesz: wybrać tryb diety (wegetariańska, wegańska, bez glutenu), oznaczyć alergeny, wykluczyć składniki których nie lubisz, dodać ulubione produkty. System automatycznie dobierze posiłki zgodne z Twoimi preferencjami.",
        helpful: 245,
        related: ["Jak dodać alergen?", "Gdzie zmieniam preferencje?"]
      },
      {
        q: "Ile kalorii zawierają posiłki?",
        a: "Każdy posiłek ma dokładnie wyliczone wartości odżywcze. Możesz wybrać dzienny limit kalorii od 1200 do 4000 kcal w krokach co 100 kcal. Szczegółowe informacje o każdym posiłku (kalorie, białko, węglowodany, tłuszcze, błonnik) znajdziesz w planie tygodniowym.",
        helpful: 189,
        related: ["Jak zmienić liczbę kalorii?", "Czy makra są wyliczone?"]
      },
      {
        q: "Czy posiłki są świeże?",
        a: "Tak, wszystkie posiłki są przygotowywane codziennie rano z świeżych, lokalnych składników. Nie używamy konserwantów, sztucznych barwników ani wzmacniaczy smaku. Posiłki należy spożyć w ciągu 48 godzin od dostawy - przechowuj je w lodówce.",
        helpful: 278,
        related: ["Jak przechowywać posiłki?", "Czy mogę zamrozić posiłki?"]
      },
      {
        q: "Czy oferujecie diety specjalistyczne?",
        a: "Tak! Poza standardowymi dietami oferujemy również: dietę bezlaktozową, bezglutenową, wegańską, dla diabetyków (indeks glikemiczny), dla osób z nadciśnieniem (niskosodowa). Skontaktuj się z nami, jeśli potrzebujesz indywidualnej diety.",
        helpful: 134,
        related: ["Jak zamówić dietę specjalistyczną?", "Czy macie dietetyka?"]
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
        q: "Jakie metody płatności akceptujecie?",
        a: "Akceptujemy: karty płatnicze (Visa, Mastercard, American Express), BLIK, szybkie przelewy online (PayU, Przelewy24, Tpay), płatność przy odbiorze (gotówka lub karta), Apple Pay i Google Pay.",
        helpful: 156,
        related: ["Czy mogę płacić przy odbiorze?", "Czy akceptujecie BLIK?"]
      },
      {
        q: "Czy mogę płacić miesięcznie?",
        a: "Tak, oferujemy elastyczne opcje płatności. Możesz opłacić cały okres z góry (z rabatem do 15%) lub rozłożyć płatność na raty miesięczne bez dodatkowych kosztów. Raty 0% dostępne przy zamówieniach powyżej 500 zł.",
        helpful: 123,
        related: ["Jakie są rabaty?", "Jak działa płatność ratalna?"]
      },
      {
        q: "Jak otrzymam fakturę?",
        a: "Faktura VAT jest automatycznie generowana po każdej płatności i wysyłana na Twój adres email w ciągu 24 godzin. Możesz też pobrać wszystkie faktury z sekcji Ustawienia > Historia płatności. Jeśli potrzebujesz faktury na firmę, uzupełnij dane firmy w ustawieniach.",
        helpful: 89,
        related: ["Jak pobrać fakturę?", "Czy mogę mieć fakturę na firmę?"]
      },
      {
        q: "Co jeśli płatność się nie powiodła?",
        a: "Jeśli płatność się nie powiodła, otrzymasz powiadomienie email i w aplikacji z instrukcją ponowienia płatności. Masz 24 godziny na uregulowanie płatności. Po tym czasie zamówienie zostanie wstrzymane do momentu zaksięgowania płatności.",
        helpful: 67,
        related: ["Jak ponowić płatność?", "Dlaczego płatność nie przeszła?"]
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
        q: "Jak zmienić hasło?",
        a: "Wejdź w Ustawienia > Profil > Bezpieczeństwo i kliknij 'Zmień hasło'. Będziesz musiał podać aktualne hasło oraz nowe hasło. Nowe hasło musi mieć minimum 8 znaków, w tym co najmniej jedną cyfrę i jeden znak specjalny.",
        helpful: 134,
        related: ["Zapomniałem hasła", "Jak włączyć 2FA?"]
      },
      {
        q: "Jak usunąć konto?",
        a: "Aby usunąć konto, wejdź w Ustawienia > Opcje > Usuń konto. Pamiętaj, że ta operacja jest nieodwracalna - wszystkie Twoje dane, historia zamówień i preferencje zostaną trwale usunięte. Przed usunięciem musisz anulować wszystkie aktywne subskrypcje.",
        helpful: 45,
        related: ["Czy mogę odzyskać konto?", "Co się stanie z moimi danymi?"]
      },
      {
        q: "Jak zmienić adres dostawy?",
        a: "Adres dostawy możesz zmienić w Ustawieniach > Dostawa. Kliknij 'Edytuj' przy obecnym adresie lub 'Dodaj nowy adres'. Zmiana adresu wejdzie w życie od następnej dostawy. Możesz mieć do 3 zapisanych adresów.",
        helpful: 187,
        related: ["Czy mogę mieć kilka adresów?", "Jak ustawić domyślny adres?"]
      },
      {
        q: "Jak wstrzymać subskrypcję na czas urlopu?",
        a: "W sekcji Plan tygodnia możesz oznaczyć konkretne dni jako 'bez dostawy'. Możesz też tymczasowo zawiesić całą subskrypcję w Ustawieniach > Subskrypcja > Wstrzymaj. Subskrypcja zostanie wznowiona automatycznie po wybranym okresie.",
        helpful: 156,
        related: ["Na jak długo mogę wstrzymać?", "Czy stracę niewykorzystane dni?"]
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
    title: "Jak zaplanować tygodniowe menu",
    duration: "5:12",
    thumbnail: "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=200&fit=crop",
    views: 8921,
  },
  {
    title: "Śledzenie dostawy krok po kroku",
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
    description: "Jak rozpocząć przygodę z FitMeal",
    icon: BookOpen,
    steps: [
      "Wybierz plan dietetyczny dopasowany do Twoich celów",
      "Ustaw preferencje żywieniowe i wyklucz alergeny",
      "Podaj adres dostawy i wybierz preferowane godziny",
      "Dokonaj płatności i czekaj na pierwszą dostawę"
    ]
  },
  {
    title: "Planowanie posiłków",
    description: "Jak korzystać z planera tygodniowego",
    icon: FileText,
    steps: [
      "Przejdź do sekcji 'Plan tygodnia' w panelu",
      "Kliknij na dzień, który chcesz edytować",
      "Dodaj, zamień lub usuń posiłki według preferencji",
      "Zapisz zmiany przed godziną 18:00 poprzedniego dnia"
    ]
  },
  {
    title: "Śledzenie dostawy",
    description: "Jak śledzić swoje zamówienie w czasie rzeczywistym",
    icon: Truck,
    steps: [
      "Przejdź do sekcji 'Moje zamówienia'",
      "Kliknij na aktywne zamówienie aby zobaczyć szczegóły",
      "Śledź status dostawy na mapie w czasie rzeczywistym",
      "Skontaktuj się z kierowcą przez aplikację w razie potrzeby"
    ]
  },
]

export default function FAQPage() {
  const { setIsOpen, setIsMinimized } = useLiveChat()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({})
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [activeVideo, setActiveVideo] = useState<(typeof videoGuides)[number] | null>(null)
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
              Jak możemy Ci <span className="text-primary">pomóc</span>?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Przeszukaj bazę wiedzy lub wybierz kategorię poniżej
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
                Wyczyść
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
                              Czy ta odpowiedź była pomocna?
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
                    <p className="text-lg font-medium">Nie znaleziono wyników</p>
                    <p className="mt-1 text-muted-foreground">
                      Spróbuj innych słów kluczowych lub skontaktuj się z nami
                    </p>
                    <Button className="mt-4" onClick={() => setSearchQuery("")}>
                      Wyczyść wyszukiwanie
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
                    Najczęściej wyszukiwane
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
            </>
          )}

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
                <Card
                  key={idx}
                  className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
                  onClick={() => {
                    setActiveVideo(video)
                    setVideoDialogOpen(true)
                  }}
                >
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

          <Dialog
            open={videoDialogOpen}
            onOpenChange={(open) => {
              setVideoDialogOpen(open)
              if (!open) setActiveVideo(null)
            }}
          >
            <DialogContent className="sm:max-w-3xl p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle>{activeVideo?.title ?? "Odtwarzacz"}</DialogTitle>
                <DialogDescription>
                  Symulacja odtwarzacza wideo.
                </DialogDescription>
              </DialogHeader>

              <div className="overflow-hidden rounded-xl border border-border/50 bg-secondary">
                <div className="relative aspect-video w-full">
                  {activeVideo?.thumbnail ? (
                    <img
                      src={activeVideo.thumbnail}
                      alt={activeVideo.title}
                      className="h-full w-full object-cover opacity-70"
                    />
                  ) : null}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90">
                      <Play className="h-7 w-7 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-white">Odtwarzanie</p>
                    {activeVideo?.duration ? (
                      <p className="text-xs text-white/80">Czas trwania: {activeVideo.duration}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

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

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Nadal potrzebujesz pomocy?
              </CardTitle>
              <CardDescription>
                Skontaktuj się z naszym zespołem wsparcia
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
                <Card
                  className="cursor-pointer border-2 border-primary/20 bg-primary/5 transition-colors hover:bg-primary/10"
                  onClick={() => {
                    setIsMinimized(false)
                    setIsOpen(true)
                  }}
                >
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
                  <h3 className="text-xl font-medium">Wiadomość wysłana!</h3>
                  <p className="mt-1 text-muted-foreground">
                    Odpowiemy najszybciej jak to możliwe
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-medium">Wyślij wiadomość</h4>
                  <Select
                    value={contactForm.topic}
                    onValueChange={(value) => setContactForm(prev => ({ ...prev, topic: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz temat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order">Problem z zamówieniem</SelectItem>
                      <SelectItem value="delivery">Dostawa</SelectItem>
                      <SelectItem value="payment">Płatności</SelectItem>
                      <SelectItem value="diet">Pytanie o dietę</SelectItem>
                      <SelectItem value="account">Konto użytkownika</SelectItem>
                      <SelectItem value="feedback">Opinia / Sugestia</SelectItem>
                      <SelectItem value="other">Inne</SelectItem>
                    </SelectContent>
                  </Select>

                  <Textarea
                    placeholder="Opisz swój problem lub pytanie..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                  />

                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Średni czas odpowiedzi: {"< 2 godziny"}
                    </p>
                    <Button
                      onClick={handleSubmitContact}
                      disabled={!contactForm.topic || !contactForm.message}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Wyślij
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
