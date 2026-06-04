"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import {
  ArrowLeft,
  Stethoscope,
  Star,
  Clock,
  Calendar as CalendarIcon,
  Video,
  Phone,
  MessageSquare,
  CheckCircle2,
  Award,
  Users,
  Heart,
  Sparkles,
  GraduationCap,
  Shield,
  Send,
  Paperclip,
  ChevronRight,
  Play,
} from "lucide-react"

const dietitians = [
  {
    id: 1,
    name: "Dr Anna Kowalska",
    title: "Specjalista ds. dietetyki klinicznej",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
    rating: 4.9,
    reviews: 234,
    experience: "12 lat",
    specializations: ["Dietetyka sportowa", "Redukcja masy ciala", "Zaburzenia metaboliczne"],
    education: "Uniwersytet Medyczny w Warszawie",
    languages: ["Polski", "Angielski"],
    nextAvailable: "Dzis, 14:00",
    price: 150,
    bio: "Specjalizuje sie w dietetyce sportowej i klinicznej. Pomogla ponad 1000 pacjentom osiagnac ich cele zdrowotne.",
    featured: true,
  },
  {
    id: 2,
    name: "Mgr Tomasz Nowak",
    title: "Dietetyk kliniczny",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
    rating: 4.8,
    reviews: 187,
    experience: "8 lat",
    specializations: ["Dieta ketogeniczna", "Budowanie masy", "Suplementacja"],
    education: "AWF Krakow",
    languages: ["Polski"],
    nextAvailable: "Jutro, 10:00",
    price: 120,
    bio: "Ekspert w dziedzinie zywienia sportowcow. Wspolpracuje z klubami sportowymi i zawodnikami.",
    featured: false,
  },
  {
    id: 3,
    name: "Dr Marta Wisniowska",
    title: "Dietetyk pediatryczny",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face",
    rating: 5.0,
    reviews: 156,
    experience: "15 lat",
    specializations: ["Dietetyka pediatryczna", "Alergie pokarmowe", "Zaburzenia odzywiania"],
    education: "Uniwersytet Jagiellonski",
    languages: ["Polski", "Niemiecki"],
    nextAvailable: "Pojutrze, 16:00",
    price: 180,
    bio: "Specjalistka zywienia dzieci i mlodziezy. Autorka ksiazek o zdrowym zywieniu rodziny.",
    featured: true,
  },
]

const consultationTypes = [
  {
    id: "video",
    name: "Wideokonsultacja",
    icon: Video,
    description: "Rozmowa twarzą w twarz online",
    duration: "45 min",
    popular: true,
  },
  {
    id: "phone",
    name: "Konsultacja telefoniczna",
    icon: Phone,
    description: "Szybka rozmowa telefoniczna",
    duration: "30 min",
    popular: false,
  },
  {
    id: "chat",
    name: "Konsultacja czatowa",
    icon: MessageSquare,
    description: "Wymiana wiadomosci z dietetykiem",
    duration: "Do 24h na odpowiedz",
    popular: false,
  },
]

const benefits = [
  {
    icon: Sparkles,
    title: "Spersonalizowane plany",
    description: "Dieta dopasowana do Twoich celow, preferencji i stylu zycia",
  },
  {
    icon: Shield,
    title: "Certyfikowani specjalisci",
    description: "Wszyscy nasi dietetycy posiadaja odpowiednie kwalifikacje",
  },
  {
    icon: Clock,
    title: "Elastyczne terminy",
    description: "Konsultacje dostepne 7 dni w tygodniu, rowniez wieczorami",
  },
  {
    icon: Heart,
    title: "Wsparcie ciągle",
    description: "Masz pytania miedzy konsultacjami? Napisz do nas!",
  },
]

const testimonials = [
  {
    name: "Katarzyna M.",
    avatar: "KM",
    rating: 5,
    text: "Dr Kowalska calkowicie zmienila moje podejscie do jedzenia. Schudlam 15kg w 6 miesiecy!",
    date: "2 tygodnie temu",
  },
  {
    name: "Piotr S.",
    avatar: "PS",
    rating: 5,
    text: "Profesjonalne podejscie i konkretne wskazowki. Polecam kazdemu sportowcowi.",
    date: "1 miesiac temu",
  },
  {
    name: "Magdalena K.",
    avatar: "MK",
    rating: 5,
    text: "Dzięki konsultacji moje dziecko w koncu je zdrowo. Jestem bardzo wdzieczna!",
    date: "3 tygodnie temu",
  },
]

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30"
]

export default function ConsultationPage() {
  const [selectedDietitian, setSelectedDietitian] = useState<typeof dietitians[0] | null>(null)
  const [selectedType, setSelectedType] = useState<string>("video")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [bookingStep, setBookingStep] = useState(1)
  const [message, setMessage] = useState("")
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [isBookingComplete, setIsBookingComplete] = useState(false)

  const handleBooking = () => {
    setIsBookingComplete(true)
    setTimeout(() => {
      setIsBookingDialogOpen(false)
      setIsBookingComplete(false)
      setBookingStep(1)
      setSelectedDate(undefined)
      setSelectedTime("")
      setMessage("")
    }, 3000)
  }

  const resetBooking = () => {
    setBookingStep(1)
    setSelectedDate(undefined)
    setSelectedTime("")
    setMessage("")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="mr-1 h-3 w-3" />
            Nowość w FitMeal
          </Badge>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Konsultacje z <span className="text-primary">dietetykiem</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Porozmawiaj z certyfikowanym specjalistą i otrzymaj spersonalizowany plan żywieniowy 
            dopasowany do Twoich celów i stylu życia.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, idx) => (
            <Card key={idx} className="border-border/50 bg-card/50">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dietitians" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="dietitians">Nasi dietetycy</TabsTrigger>
            <TabsTrigger value="how-it-works">Jak to dziala</TabsTrigger>
          </TabsList>

          <TabsContent value="dietitians" className="space-y-6">
            {/* Consultation Types */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Wybierz typ konsultacji</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {consultationTypes.map((type) => (
                  <Card 
                    key={type.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedType === type.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="rounded-lg bg-primary/10 p-2.5">
                          <type.icon className="h-5 w-5 text-primary" />
                        </div>
                        {type.popular && (
                          <Badge variant="secondary" className="text-xs">Popularne</Badge>
                        )}
                      </div>
                      <h3 className="mt-4 font-semibold">{type.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{type.description}</p>
                      <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {type.duration}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Dietitians List */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Wybierz dietetyka</h2>
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {dietitians.map((dietitian) => (
                  <Card 
                    key={dietitian.id} 
                    className={`relative overflow-hidden transition-all hover:shadow-lg ${
                      dietitian.featured ? "border-primary/30" : ""
                    }`}
                  >
                    {dietitian.featured && (
                      <div className="absolute right-0 top-0">
                        <Badge className="rounded-none rounded-bl-lg bg-primary">
                          <Award className="mr-1 h-3 w-3" />
                          Polecany
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16 border-2 border-primary/20">
                          <AvatarImage src={dietitian.avatar} alt={dietitian.name} />
                          <AvatarFallback>{dietitian.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{dietitian.name}</h3>
                          <p className="text-sm text-muted-foreground">{dietitian.title}</p>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{dietitian.rating}</span>
                              <span className="text-xs text-muted-foreground">({dietitian.reviews})</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              {dietitian.experience}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                        {dietitian.bio}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {dietitian.specializations.slice(0, 3).map((spec, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Najbliższy termin</p>
                          <p className="text-sm font-medium text-primary">{dietitian.nextAvailable}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">od</p>
                          <p className="text-lg font-bold">{dietitian.price} zł</p>
                        </div>
                      </div>

                      <Dialog open={isBookingDialogOpen && selectedDietitian?.id === dietitian.id} onOpenChange={(open) => {
                        setIsBookingDialogOpen(open)
                        if (!open) resetBooking()
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            className="mt-4 w-full" 
                            onClick={() => {
                              setSelectedDietitian(dietitian)
                              setIsBookingDialogOpen(true)
                            }}
                          >
                            Umów konsultację
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          {isBookingComplete ? (
                            <div className="py-12 text-center">
                              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                              </div>
                              <DialogTitle className="text-2xl">Zarezerwowano!</DialogTitle>
                              <DialogDescription className="mt-2">
                                Twoja konsultacja z {dietitian.name} została zarezerwowana.
                                Potwierdzenie wysłaliśmy na Twój email.
                              </DialogDescription>
                            </div>
                          ) : (
                            <>
                              <DialogHeader>
                                <DialogTitle>Umów konsultację</DialogTitle>
                                <DialogDescription>
                                  {dietitian.name} - {consultationTypes.find(t => t.id === selectedType)?.name}
                                </DialogDescription>
                              </DialogHeader>

                              {bookingStep === 1 && (
                                <div className="space-y-6 py-4">
                                  <div>
                                    <Label className="mb-2 block">Wybierz datę</Label>
                                    <Calendar
                                      mode="single"
                                      selected={selectedDate}
                                      onSelect={setSelectedDate}
                                      disabled={(date) => date < new Date() || date.getDay() === 0}
                                      className="rounded-md border mx-auto"
                                    />
                                  </div>

                                  {selectedDate && (
                                    <div>
                                      <Label className="mb-2 block">Wybierz godzinę</Label>
                                      <div className="grid grid-cols-4 gap-2">
                                        {timeSlots.map((time) => (
                                          <Button
                                            key={time}
                                            variant={selectedTime === time ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedTime(time)}
                                          >
                                            {time}
                                          </Button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {bookingStep === 2 && (
                                <div className="space-y-6 py-4">
                                  <div>
                                    <Label htmlFor="topic">Temat konsultacji</Label>
                                    <Select>
                                      <SelectTrigger className="mt-2">
                                        <SelectValue placeholder="Wybierz temat" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="weight-loss">Redukcja masy ciala</SelectItem>
                                        <SelectItem value="muscle-gain">Budowanie masy miesniowej</SelectItem>
                                        <SelectItem value="health">Poprawa zdrowia</SelectItem>
                                        <SelectItem value="allergies">Alergie i nietolerancje</SelectItem>
                                        <SelectItem value="sport">Dieta dla sportowca</SelectItem>
                                        <SelectItem value="other">Inne</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label htmlFor="message">Opisz swój cel (opcjonalnie)</Label>
                                    <Textarea
                                      id="message"
                                      placeholder="Opisz krotko czego oczekujesz od konsultacji..."
                                      value={message}
                                      onChange={(e) => setMessage(e.target.value)}
                                      className="mt-2 min-h-[100px]"
                                    />
                                  </div>

                                  <Card className="bg-secondary/50">
                                    <CardContent className="p-4">
                                      <h4 className="font-medium">Podsumowanie</h4>
                                      <div className="mt-2 space-y-1 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Dietetyk:</span>
                                          <span>{dietitian.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Typ:</span>
                                          <span>{consultationTypes.find(t => t.id === selectedType)?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Data:</span>
                                          <span>{selectedDate?.toLocaleDateString("pl-PL")}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Godzina:</span>
                                          <span>{selectedTime}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-border pt-2 mt-2">
                                          <span className="font-medium">Do zapłaty:</span>
                                          <span className="font-bold text-primary">{dietitian.price} zł</span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}

                              <DialogFooter>
                                {bookingStep === 2 && (
                                  <Button variant="outline" onClick={() => setBookingStep(1)}>
                                    Wstecz
                                  </Button>
                                )}
                                {bookingStep === 1 ? (
                                  <Button 
                                    onClick={() => setBookingStep(2)}
                                    disabled={!selectedDate || !selectedTime}
                                  >
                                    Dalej
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button onClick={handleBooking}>
                                    Zarezerwuj i zapłać
                                  </Button>
                                )}
                              </DialogFooter>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="mt-12">
              <h2 className="mb-6 text-xl font-semibold text-center">Co mówią nasi klienci</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {testimonials.map((testimonial, idx) => (
                  <Card key={idx} className="bg-card/50">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {testimonial.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground italic">
                        &quot;{testimonial.text}&quot;
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">{testimonial.date}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="how-it-works" className="space-y-8">
            <div className="mx-auto max-w-3xl">
              <div className="space-y-8">
                {[
                  {
                    step: 1,
                    title: "Wybierz dietetyka i termin",
                    description: "Przejrzyj profile naszych specjalistów, sprawdź ich doswiadczenie i opinie. Wybierz termin, który Ci odpowiada - konsultacje dostępne 7 dni w tygodniu.",
                    icon: CalendarIcon,
                  },
                  {
                    step: 2,
                    title: "Opowiedz o swoich celach",
                    description: "Przed konsultacją wypełnij krótką ankietę o swoim stylu życia, preferencjach żywieniowych i celach. To pomoże dietetykowi przygotować się do rozmowy.",
                    icon: MessageSquare,
                  },
                  {
                    step: 3,
                    title: "Konsultacja online",
                    description: "Połącz się z dietetykiem przez wideo, telefon lub czat. Omów swoje potrzeby, zadaj pytania i otrzymaj profesjonalne wskazówki.",
                    icon: Video,
                  },
                  {
                    step: 4,
                    title: "Otrzymaj spersonalizowany plan",
                    description: "Po konsultacji otrzymasz szczegółowy plan żywieniowy dopasowany do Twoich celów. Plan zostanie automatycznie zsynchronizowany z Twoim kontem FitMeal.",
                    icon: Sparkles,
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                        {item.step}
                      </div>
                      {idx < 3 && <div className="mt-2 h-full w-0.5 bg-border" />}
                    </div>
                    <Card className="flex-1">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <item.icon className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                        </div>
                        <p className="mt-3 text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              <Card className="mt-12 bg-primary/5 border-primary/20">
                <CardContent className="p-8 text-center">
                  <GraduationCap className="mx-auto h-12 w-12 text-primary" />
                  <h3 className="mt-4 text-xl font-semibold">Certyfikowani specjaliści</h3>
                  <p className="mt-2 text-muted-foreground">
                    Wszyscy nasi dietetycy posiadają wykształcenie kierunkowe oraz wieloletnie 
                    doświadczenie w pracy z klientami. Regularnie uczestniczą w szkoleniach 
                    i konferencjach branżowych.
                  </p>
                  <Button className="mt-6" asChild>
                    <Link href="#dietitians">
                      Poznaj naszych specjalistów
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
