"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

const deliveryAreas = [
  { city: "Warszawa", available: true, deliveryTime: "6:00-9:00", zones: ["Srodmiescie", "Mokotow", "Wola", "Praga", "Zoliborz", "Bielany", "Ursynow", "Wilanow", "Bemowo", "Ochota"] },
  { city: "Kraków", available: true, deliveryTime: "6:30-9:30", zones: ["Stare Miasto", "Kazimierz", "Podgorze", "Nowa Huta", "Krowodrza", "Bronowice"] },
  { city: "Wroclaw", available: true, deliveryTime: "6:00-9:00", zones: ["Stare Miasto", "Krzyki", "Fabryczna", "Psie Pole", "Srodmiescie"] },
  { city: "Poznan", available: true, deliveryTime: "6:30-9:30", zones: ["Stare Miasto", "Jezyce", "Wilda", "Grunwald", "Nowe Miasto"] },
  { city: "Gdansk", available: true, deliveryTime: "6:00-9:00", zones: ["Srodmiescie", "Wrzeszcz", "Oliwa", "Przymorze", "Zaspa"] },
  { city: "Gdynia", available: true, deliveryTime: "6:00-9:00", zones: ["Srodmiescie", "Orłowo", "Redlowo", "Wielki Kack"] },
  { city: "Sopot", available: true, deliveryTime: "6:00-9:00", zones: ["Caly obszar"] },
  { city: "Lodz", available: true, deliveryTime: "6:30-9:30", zones: ["Srodmiescie", "Polesie", "Baluty", "Widzew"] },
  { city: "Katowice", available: "soon", deliveryTime: "Wkrotce", zones: [] },
  { city: "Szczecin", available: "soon", deliveryTime: "Wkrotce", zones: [] },
  { city: "Lublin", available: "soon", deliveryTime: "Wkrotce", zones: [] },
]

const popularCities = ["Warszawa", "Krakow", "Wroclaw", "Poznan", "Gdansk"]

export function DeliveryChecker() {
  const [searchValue, setSearchValue] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [result, setResult] = useState<typeof deliveryAreas[0] | null | "not-found">(null)
  const [showAllCities, setShowAllCities] = useState(false)

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
              Sprawdz dostepnosc
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Czy dostarczamy <span className="text-primary">do Ciebie</span>?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Wpisz nazwe miejscowosci, aby sprawdzic czy realizujemy dostawy w Twojej okolicy
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
                  disabled={!searchValue.trim() || isSearching}
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
                        {result.available === true ? "Dostarczamy do " : "Wkrotce w "}{result.city}!
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
                              <p className="mb-2 text-sm font-medium text-green-800">Obslugiwane dzielnice:</p>
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
                            <a href="#register">
                              Zamow teraz
                              <ChevronRight className="h-4 w-4" />
                            </a>
                          </Button>
                        </>
                      ) : (
                        <div className="mt-3">
                          <p className="text-green-700">
                            Jestesmy w trakcie uruchamiania dostaw w tym miescie. Zostaw swoj email, a powiadomimy Cie gdy zaczniemy dostarczac!
                          </p>
                          <div className="mt-4 flex gap-2">
                            <Input placeholder="Twoj email" className="max-w-xs" />
                            <Button>Powiadom mnie</Button>
                          </div>
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
                        Stale rozszerzamy zasieg dostaw. Zostaw swoj email, a powiadomimy Cie gdy zaczniemy dostarczac w Twojej okolicy!
                      </p>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <Input placeholder="Twoj email" className="max-w-xs" />
                        <Button>Powiadom mnie</Button>
                      </div>
                      <Button
                        variant="ghost"
                        className="mt-4"
                        onClick={resetSearch}
                      >
                        Sprawdz inne miasto
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Miasta z aktywna dostawa</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllCities(!showAllCities)}
              >
                {showAllCities ? "Pokaz mniej" : "Pokaz wszystkie"}
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
                        Wkrotce
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
                  Stale rozszerzamy zasieg dostaw. Jesli chcesz, abysmy dostarczali do Twojej miejscowosci,
                  daj nam znac! Im wiecej osob z danego regionu zgłosi zainteresowanie, tym szybciej
                  uruchomimy tam dostawy.
                </p>
                <Button variant="outline" className="mt-4 gap-2">
                  Zglos swoje miasto
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
