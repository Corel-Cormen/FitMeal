"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toastSuccess } from "@/lib/sonner-toast"
import {
  ChefHat,
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  Navigation,
  RefreshCw,
  Send,
  X
} from "lucide-react"

type OrderStatus = "preparing" | "packing" | "delivering" | "delivered"

interface Order {
  id: string
  date: string
  status: OrderStatus
  meals: string[]
  deliveryTime: string
  driver?: {
    name: string
    phone: string
    photo: string
  }
  estimatedArrival?: string
  progress: number
}

const mockOrders: Order[] = [
  {
    id: "FIT-2026-001",
    date: "Dzisiaj",
    status: "delivering",
    meals: ["Owsianka proteinowa", "Wrap z indykiem", "Power Bowl", "Baton proteinowy", "Sałatka Proteinowa"],
    deliveryTime: "12:00 - 14:00",
    driver: {
      name: "Lakshman Kumar",
      phone: "+48 500 123 456",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    estimatedArrival: "13:15",
    progress: 75
  },
  {
    id: "FIT-2026-002",
    date: "Jutro",
    status: "preparing",
    meals: ["Jajecznica z awokado", "Serek z owocami", "Stek z lososiem", "Orzechy mix", "Keto Plate"],
    deliveryTime: "06:00 - 08:00",
    progress: 20
  },
  {
    id: "FIT-2026-003",
    date: "Pojutrze",
    status: "preparing",
    meals: ["Smoothie bowl", "Jogurt grecki", "Buddha Bowl", "Hummus z warzywami", "Grillowany kurczak"],
    deliveryTime: "12:00 - 14:00",
    progress: 0
  }
]

interface DriverMessage {
  id: string
  text: string
  sender: "user" | "driver"
  timestamp: Date
}

const driverQuickReplies = [
  "Gdzie jesteś?",
  "Ile jeszcze czasu?",
  "Czy mogę zmienić adres dostawy?",
  "Mam problem z dostępem",
]

const driverResponses: Record<string, string> = {
  "gdzie jesteś":
    "Jestem w drodze do Ciebie! Według GPS jestem około 5-10 minut od Twojego adresu. Śledź mnie na mapie w aplikacji.",

  "ile jeszcze czasu":
    "Według nawigacji powinienem dotrzeć za około 8 minut. Jeśli będę miał opóźnienie, natychmiast Cię poinformuję!",

  "czy mogę zmienić adres dostawy":
    "Jeśli jesteś jeszcze w domu, mogę zmienić adres dostawy. Proszę podaj nowy adres i kod do bramy jeśli jest potrzebny.",

  "mam problem z dostępem":
    "Rozumiem! Czy możesz opisać problem z dostępem? Czy to kod do bramy, domofon czy coś innego? Pomożę Ci to rozwiązać.",

  default:
    "Jasne, słyszę Cię! Zaraz sprawdzę i dam znać. Jeśli to coś pilnego, zadzwoń do mnie bezpośrednio.",
}

function DriverChat({ 
  isOpen, 
  onClose, 
  driver 
}: { 
  isOpen: boolean
  onClose: () => void
  driver: { name: string; phone: string; photo: string }
}) {
  const [messages, setMessages] = useState<DriverMessage[]>([
    {
      id: "1",
      text: `Cześć! Rozmawiasz z ${driver.name}, Twoim kierowcą dostawy. W czym mogę Ci pomóc?`,
      sender: "driver",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const userMessage: DriverMessage = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)

      const lowerText = text.toLowerCase()
      let responseText = driverResponses.default

      for (const [key, value] of Object.entries(driverResponses)) {
        if (key !== "default" && lowerText.includes(key)) {
          responseText = value
          break
        }
      }

      const driverMessage: DriverMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "driver",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, driverMessage])
    }, 1500)
  }

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={driver.photo} />
              <AvatarFallback>{driver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{driver.name}</p>
              <p className="text-sm text-muted-foreground">Kierowca dostawy</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-96">
          <div className="flex-1 overflow-y-auto space-y-3 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "driver" && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={driver.photo} />
                    <AvatarFallback className="text-xs">
                      {driver.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {message.text}
                </div>
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="text-xs">TY</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={driver.photo} />
                  <AvatarFallback className="text-xs">
                    {driver.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-secondary rounded-lg px-3 py-2 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length < 4 && (
            <div className="border-t p-3">
              <p className="mb-2 text-xs text-muted-foreground">Szybkie odpowiedzi:</p>
              <div className="flex flex-wrap gap-2">
                {driverQuickReplies.map((reply) => (
                  <Badge
                    key={reply}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary text-xs"
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="border-t p-3">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Napisz wiadomość..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const statusConfig = {
  preparing: {
    label: "Przygotowywanie",
    color: "bg-amber-500",
    badgeVariant: "secondary" as const,
    icon: ChefHat,
  },
  packing: {
    label: "Pakowanie",
    color: "bg-blue-500",
    badgeVariant: "secondary" as const,
    icon: Package,
  },
  delivering: {
    label: "W drodze",
    color: "bg-primary",
    badgeVariant: "default" as const,
    icon: Truck,
  },
  delivered: {
    label: "Dostarczone",
    color: "bg-green-500",
    badgeVariant: "secondary" as const,
    icon: CheckCircle2,
  },
}

const statusSteps = [
  { status: "preparing", label: "Przygotowanie", icon: ChefHat },
  { status: "packing", label: "Pakowanie", icon: Package },
  { status: "delivering", label: "Dostawa", icon: Truck },
  { status: "delivered", label: "Dostarczono", icon: MapPin },
]

function LiveTrackingCard({ order }: { order: Order }) {
  const [currentProgress, setCurrentProgress] = useState(order.progress)
  const [eta, setEta] = useState(order.estimatedArrival)
  const [isDriverChatOpen, setIsDriverChatOpen] = useState(false)
  const [driverChatDriver, setDriverChatDriver] = useState<{ name: string; phone: string; photo: string } | null>(null)

  useEffect(() => {
    if (order.status === "delivering") {
      const interval = setInterval(() => {
        setCurrentProgress(prev => {
          const newProgress = prev + Math.random() * 2
          return newProgress > 95 ? 95 : newProgress
        })
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [order.status])

  const currentStepIndex = statusSteps.findIndex(s => s.status === order.status)

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
              </span>
              Śledzenie na żywo
            </CardTitle>
            <CardDescription>Zamówienie {order.id}</CardDescription>
          </div>
          <Badge className={statusConfig[order.status].color}>
            {statusConfig[order.status].label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <div className="relative z-20 mx-auto flex max-w-md justify-between px-1">
            {statusSteps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = index < currentStepIndex
              const isCurrent = index === currentStepIndex

              return (
                <div key={step.status} className="flex flex-col items-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                        ? "bg-primary/20 text-primary ring-4 ring-primary/30"
                        : "bg-secondary text-muted-foreground"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`mt-2 text-xs font-medium text-center ${
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {order.status === "delivering" && order.driver && (
          <>
            <div className="rounded-xl bg-secondary/50 p-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={order.driver.photo}
                    alt={order.driver.name}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-primary"
                  />
                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <Truck className="h-3 w-3 text-primary-foreground" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{order.driver.name}</p>
                  <p className="text-sm text-muted-foreground">Kierowca dostawy</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (order.driver?.phone) {
                        window.location.href = `tel:${order.driver.phone}`
                      }
                    }}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (order.driver) {
                        setDriverChatDriver(order.driver)
                        setIsDriverChatOpen(true)
                      }
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Postęp dostawy</span>
                <span className="font-medium text-foreground">{Math.round(currentProgress)}%</span>
              </div>
              <Progress value={currentProgress} className="h-2" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Navigation className="h-4 w-4" />
                  <span>Szacowany czas: <strong className="text-foreground">{eta}</strong></span>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  <MapPin className="mr-1 h-4 w-4" />
                  Zobacz na mapie
                </Button>
              </div>
            </div>
          </>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Posiłki w zamówieniu:</p>
          <div className="flex flex-wrap gap-2">
            {order.meals.map((meal, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {meal}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      {driverChatDriver && (
        <DriverChat
          isOpen={isDriverChatOpen}
          onClose={() => {
            setIsDriverChatOpen(false)
            setDriverChatDriver(null)
          }}
          driver={driverChatDriver}
        />
      )}
    </Card>
  )
}

function OrderHistoryCard({ order }: { order: Order }) {
  const StatusIcon = statusConfig[order.status].icon

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-4 transition-all hover:shadow-md sm:flex-row sm:items-center">
      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
        order.status === "delivered" ? "bg-green-500/20" : "bg-secondary"
      }`}>
        <StatusIcon className={`h-6 w-6 ${
          order.status === "delivered" ? "text-green-500" : "text-muted-foreground"
        }`} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-foreground">{order.date}</p>
          <Badge variant={statusConfig[order.status].badgeVariant} className="text-xs">
            {statusConfig[order.status].label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {order.meals.length} posiłków | Dostawa: {order.deliveryTime}
        </p>
      </div>
      <div className="flex flex-col items-start gap-1 text-left sm:items-end sm:text-right">
        <p className="text-xs text-muted-foreground">{order.id}</p>
        {order.status !== "delivered" && (
          <Progress value={order.progress} className="mt-1 h-2 w-full max-w-[140px] sm:max-w-[120px]" />
        )}
      </div>
    </div>
  )
}

export function OrderTracking() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current)
    }
  }, [])

  const handleRefresh = () => {
    if (isRefreshing) return

    setIsRefreshing(true)

    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current)
    refreshTimeoutRef.current = setTimeout(() => {
      setIsRefreshing(false)
      toastSuccess("Odświeżono", {
        description: "Status zamówień został zaktualizowany.",
      })
    }, 1000)
  }

  const activeOrder = mockOrders.find(o => o.status === "delivering")
  const upcomingOrders = mockOrders.filter(o => o.status !== "delivering" && o.status !== "delivered")

  return (
    <section id="tracking" className="scroll-mt-20 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Śledzenie zamówień</h2>
          <p className="text-sm text-muted-foreground">Sprawdź status przygotowania i dostawy</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Odśwież
        </Button>
      </div>

      {activeOrder && <LiveTrackingCard order={activeOrder} />}

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Nadchodzące dostawy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingOrders.map((order) => (
            <OrderHistoryCard key={order.id} order={order} />
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
