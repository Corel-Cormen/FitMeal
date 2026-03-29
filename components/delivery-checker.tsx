"use client"

import { useState } from "react"
import Link from "next/link"
import { toastError, toastSuccess } from "@/lib/sonner-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  MapPin,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  Loader2,
  ChevronRight,
  Info,
  Send,
} from "lucide-react"

const deliveryAreas = [
  { city: "Warszawa", available: true, deliveryTime: "6:00-9:00", zones: ["Śródmiescie", "Mokotów", "Wola", "Praga", "Żoliborz", "Bielany", "Ursynów", "Wilanów", "Bemowo", "Ochota"] },
  { city: "Kraków", available: true, deliveryTime: "6:30-9:30", zones: ["Stare Miasto", "Kazimierz", "Podgórze", "Nowa Huta", "Krowodrza", "Bronowice"] },
  { city: "Wrocław", available: true, deliveryTime: "6:00-9:00", zones: ["Stare Miasto", "Krzyki", "Fabryczna", "Psie Pole", "Śródmiescie"] },
  { city: "Poznań", available: true, deliveryTime: "6:30-9:30", zones: ["Stare Miasto", "Jezyce", "Wilda", "Grunwald", "Nowe Miasto"] },
  { city: "Gdańsk", available: true, deliveryTime: "6:00-9:00", zones: ["Śródmiescie", "Wrzeszcz", "Oliwa", "Przymorze", "Zaspa"] },
  { city: "Gdynia", available: true, deliveryTime: "6:00-9:00", zones: ["Śródmiescie", "Orłowo", "Redłowo", "Wielki Kack"] },
  { city: "Sopot", available: true, deliveryTime: "6:00-9:00", zones: ["Cały obszar"] },
  { city: "Łódź", available: true, deliveryTime: "6:30-9:30", zones: ["Śródmiescie", "Polesie", "Bałuty", "Widzew"] },
  { city: "Katowice", available: "soon", deliveryTime: "Wkrótce", zones: [] },
  { city: "Szczecin", available: "soon", deliveryTime: "Wkrótce", zones: [] },
  { city: "Lublin", available: "soon", deliveryTime: "Wkrótce", zones: [] },
]

const popularCities = ["Warszawa", "Kraków", "Wrocław", "Poznań", "Gdańsk"]

export function DeliveryChecker() {
  const [searchValue, setSearchValue] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [result, setResult] = useState<typeof deliveryAreas[0] | null | "not-found">(null)
  const [showAllCities, setShowAllCities] = useState(false)
  const [notifyEmails, setNotifyEmails] = useState<Record<string, string>>({})
  const [sentEmails, setSentEmails] = useState<Record<string, boolean>>({})
  const [notifyEmailErrors, setNotifyEmailErrors] = useState<Record<string, boolean>>({})
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [reportCity, setReportCity] = useState("")
  const [reportEmail, setReportEmail] = useState("")
  const [reportMessage, setReportMessage] = useState("")
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)

  const [reportCityError, setReportCityError] = useState(false)
  const [reportEmailError, setReportEmailError] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleNotifySubmit = (identifier: string) => {
    const email = notifyEmails[identifier] || ""
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setNotifyEmailErrors((prev) => ({ ...prev, [identifier]: true }))
      toastError("Proszę wpisać email.")
      return
    }

    if (!validateEmail(trimmedEmail)) {
      setNotifyEmailErrors((prev) => ({ ...prev, [identifier]: true }))
      toastError("Email nie jest w prawidłowym formacie.")
      return
    }

    toastSuccess("Email został wysłany. Powiadomimy Cię wkrótce!")
    setNotifyEmails({ ...notifyEmails, [identifier]: "" })
    setSentEmails({ ...sentEmails, [identifier]: true })
    setNotifyEmailErrors((prev) => ({ ...prev, [identifier]: false }))
  }

  const handleReportCitySubmit = async () => {
    const trimmedCity = reportCity.trim()
    const trimmedEmail = reportEmail.trim()

    const nextCityError = !trimmedCity
    const nextEmailError = !trimmedEmail || !validateEmail(trimmedEmail)

    setReportCityError(nextCityError)
    setReportEmailError(nextEmailError)

    if (!trimmedCity) {
      toastError("Proszę wpisać nazwę miasta.")
      return
    }

    if (!trimmedEmail) {
      toastError("Proszę wpisać email.")
      return
    }

    if (!validateEmail(trimmedEmail)) {
      toastError("Email nie jest w prawidłowym formacie.")
      return
    }

    setIsSubmittingReport(true)

    // Symulacja wysyłania zgłoszenia
    setTimeout(() => {
      toastSuccess("Zgłoszenie zostało wysłane! Dziękujemy za pomoc w rozwoju naszej sieci dostaw.")
      setReportCity("")
      setReportEmail("")
      setReportMessage("")
      setReportCityError(false)
      setReportEmailError(false)
      setIsReportDialogOpen(false)
      setIsSubmittingReport(false)
    }, 1500)
  }

  const handleSearch = (cityName?: string) => {
    const query = cityName || searchValue
    if (!query.trim()) return

    setIsSearching(true)
    setResult(null)

    setTimeout(() => {
      const found = deliveryAreas.find(
        (area) => area.city.toLowerCase() === query.toLowerCase().trim()
      )
      setResult(found || "not-found")
      setIsSearching(false)
    }, 800)
  }

  const handleCityClick = (city: string) => {
    setSearchValue(city)
    handleSearch(city)
  }

  const resetSearch = () => {
    setSearchValue("")
    setResult(null)
  }

  return (
    <section id="sprawdz-dostepnosc" className="py-20 sm:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <Badge className="mb-4 gap-1">
              <Truck className="h-3 w-3" />
              Sprawdź dostępność
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Czy dostarczamy <span className="text-primary">do Ciebie</span>?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Wpisz nazwę miejscowości, aby sprawdzić czy realizujemy dostawy w Twojej okolicy
            </p>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSearch()
                }}
                className="flex gap-3"
              >
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value)
                      if (result) setResult(null)
                    }}
                    placeholder="Wpisz nazwe miasta..."
                    className="h-14 pl-12 text-lg"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-14 px-8"
                  disabled={Boolean(!searchValue.trim() || isSearching)}
                  suppressHydrationWarning
                >
                  {isSearching ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Sprawdz
                    </>
                  )}
                </Button>
              </form>

              {!result && !isSearching && (
                <div className="mt-6">
                  <p className="mb-3 text-sm text-muted-foreground">Popularne miasta:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularCities.map((city) => (
                      <Badge
                        key={city}
                        variant="outline"
                        className="cursor-pointer px-4 py-2 text-sm hover:bg-secondary"
                        onClick={() => handleCityClick(city)}
                      >
                        {city}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {result && result !== "not-found" && (
                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-green-100 p-3">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-green-800">
                        {result.available === true ? "Dostarczamy do " : "Wkrótce w "}{result.city}!
                      </h3>
                      {result.available === true ? (
                        <>
                          <div className="mt-3 flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 text-green-700">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">Godziny dostawy: {result.deliveryTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-700">
                              <Truck className="h-4 w-4" />
                              <span className="text-sm">Darmowa dostawa od 150 zł</span>
                            </div>
                          </div>
                          {result.zones.length > 0 && (
                            <div className="mt-4">
                              <p className="mb-2 text-sm font-medium text-green-800">Obsługiwane dzielnice:</p>
                              <div className="flex flex-wrap gap-2">
                                {result.zones.map((zone) => (
                                  <Badge key={zone} variant="secondary" className="bg-green-100 text-green-800">
                                    {zone}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          <Button className="mt-6 gap-2" asChild>
                            <Link href="/login?mode=register">
                              Zamów teraz
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </>
                      ) : (
                        <div className="mt-3">
                          <p className="text-green-700">
                            Jesteśmy w trakcie uruchamiania dostaw w tym miescie. Zostaw swój email, a powiadomimy Cię gdy zaczniemy dostarczać!
                          </p>
                          {sentEmails[`soon-${result.city}`] ? (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-green-800 font-medium">Dziękujemy za powiadomienie nas o nowym mieście!</p>
                              <p className="text-green-700 text-sm mt-1">Będziemy Cię informować o postępach.</p>
                            </div>
                          ) : (
                            <div className="mt-4 flex gap-2">
                              <Input 
                                placeholder="Twój email" 
                                className={`max-w-xs ${
                                  notifyEmailErrors[`soon-${result.city}`]
                                    ? "border-destructive ring-2 ring-destructive/20"
                                    : ""
                                }`}
                                value={notifyEmails[`soon-${result.city}`] || ""}
                                aria-invalid={Boolean(notifyEmailErrors[`soon-${result.city}`])}
                                onChange={(e) => {
                                  const next = e.target.value
                                  setNotifyEmails({ ...notifyEmails, [`soon-${result.city}`]: next })
                                  if (notifyEmailErrors[`soon-${result.city}`] && validateEmail(next.trim())) {
                                    setNotifyEmailErrors((prev) => ({ ...prev, [`soon-${result.city}`]: false }))
                                  }
                                }}
                              />
                              <Button onClick={() => handleNotifySubmit(`soon-${result.city}`)}>Powiadom mnie</Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {result === "not-found" && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-amber-100 p-3">
                      <XCircle className="h-8 w-8 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-amber-800">
                        Jeszcze nie dostarczamy do {searchValue}
                      </h3>
                      <p className="mt-2 text-amber-700">
                        Stale rozszerzamy zasięg dostaw. Zostaw swój email, a powiadomimy Cię gdy zaczniemy dostarczać w Twojej okolicy!
                      </p>
                      {sentEmails["not-found"] ? (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800 font-medium">Dziękujemy za powiadomienie nas o nowym mieście!</p>
                          <p className="text-green-700 text-sm mt-1">Będziemy Cię informować o postępach.</p>
                        </div>
                      ) : (
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                          <Input 
                            placeholder="Twój email" 
                            className={`max-w-xs ${
                              notifyEmailErrors["not-found"]
                                ? "border-destructive ring-2 ring-destructive/20"
                                : ""
                            }`}
                            value={notifyEmails["not-found"] || ""}
                            aria-invalid={Boolean(notifyEmailErrors["not-found"]) }
                            onChange={(e) => {
                              const next = e.target.value
                              setNotifyEmails({ ...notifyEmails, ["not-found"]: next })
                              if (notifyEmailErrors["not-found"] && validateEmail(next.trim())) {
                                setNotifyEmailErrors((prev) => ({ ...prev, ["not-found"]: false }))
                              }
                            }}
                          />
                          <Button onClick={() => handleNotifySubmit("not-found")}>Powiadom mnie</Button>
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        className="mt-4"
                        onClick={resetSearch}
                      >
                        Sprawdź inne miasto
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Miasta z aktywną dostawą</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllCities(!showAllCities)}
              >
                {showAllCities ? "Pokaż mniej" : "Pokaż wszystkie"}
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(showAllCities ? deliveryAreas : deliveryAreas.slice(0, 6)).map((area) => (
                <Card
                  key={area.city}
                  className={`cursor-pointer transition-colors ${
                    area.available === true
                      ? "hover:border-primary/50"
                      : "opacity-70"
                  }`}
                  onClick={() => handleCityClick(area.city)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className={`h-5 w-5 ${area.available === true ? "text-primary" : "text-muted-foreground"}`} />
                      <div>
                        <p className="font-medium">{area.city}</p>
                        <p className="text-xs text-muted-foreground">
                          {area.available === true ? area.deliveryTime : "Wkrotce"}
                        </p>
                      </div>
                    </div>
                    {area.available === true ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Aktywne
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Wkrótce
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="flex items-start gap-4 p-6">
              <Info className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <h4 className="font-semibold">Nie widzisz swojego miasta?</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Stale rozszerzamy zasięg dostaw. Jesli chcesz, abyśmy dostarczali do Twojej miejscowosci,
                  daj nam znać! Im wiecej osób z danego regionu zgłosi zainteresowanie, tym szybciej
                  uruchomimy tam dostawy.
                </p>
                <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-4 gap-2">
                      Zgłoś swoje miasto
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Zgłoś miasto do dostawy</DialogTitle>
                      <DialogDescription>
                        Pomóż nam rozszerzyć zasięg dostaw! Podaj nazwę miasta, w którym chciałbyś otrzymywać nasze posiłki.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="city">Nazwa miasta</Label>
                        <Input
                          id="city"
                          placeholder="np. Rzeszów, Kielce, Toruń..."
                          value={reportCity}
                          onChange={(e) => {
                            const next = e.target.value
                            setReportCity(next)
                            if (reportCityError && next.trim()) setReportCityError(false)
                          }}
                          aria-invalid={reportCityError}
                          className={`mt-1 ${reportCityError ? "border-destructive ring-2 ring-destructive/20" : ""}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Twój email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="twoj@email.com"
                          value={reportEmail}
                          onChange={(e) => {
                            const next = e.target.value
                            setReportEmail(next)
                            if (reportEmailError && validateEmail(next.trim())) setReportEmailError(false)
                          }}
                          aria-invalid={reportEmailError}
                          className={`mt-1 ${reportEmailError ? "border-destructive ring-2 ring-destructive/20" : ""}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Dodatkowe informacje (opcjonalne)</Label>
                        <Textarea
                          id="message"
                          placeholder="Czy jest jakieś konkretne osiedle? Ile osób mogłoby być zainteresowanych?"
                          value={reportMessage}
                          onChange={(e) => setReportMessage(e.target.value)}
                          className="mt-1 resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsReportDialogOpen(false)}
                          className="flex-1"
                        >
                          Anuluj
                        </Button>
                        <Button 
                          onClick={handleReportCitySubmit}
                          disabled={isSubmittingReport}
                          className="flex-1"
                        >
                          {isSubmittingReport ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Send className="h-4 w-4 mr-2" />
                          )}
                          Wyślij zgłoszenie
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
