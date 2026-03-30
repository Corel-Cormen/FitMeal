"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Bell,
  Check,
  CheckCheck,
  Truck,
  ChefHat,
  Package,
  MessageCircle,
  Trash2,
  Clock,
  Sparkles,
  AlertCircle
} from "lucide-react"

type Notification = {
  id: string
  type: "delivery" | "preparation" | "promo" | "system" | "message"
  title: string
  message: string
  time: string
  read: boolean
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "delivery",
    title: "Dostawa w drodze",
    message: "Twoje posiłki są już w drodze. Szacowany czas dostawy: 15 minut.",
    time: "2 min temu",
    read: false
  },
  {
    id: "2",
    type: "preparation",
    title: "Posiłki w przygotowaniu",
    message: "Nasi kucharze właśnie przygotowują Twoje posiłki na jutro.",
    time: "1 godz. temu",
    read: false
  },
  {
    id: "3",
    type: "promo",
    title: "Specjalna oferta!",
    message: "Przedłuż subskrypcję o miesiąc i otrzymaj 20% zniżki.",
    time: "3 godz. temu",
    read: false
  },
  {
    id: "4",
    type: "system",
    title: "Zaktualizuj preferencje",
    message: "Dodaliśmy nowe opcje diet. Sprawdź czy pasują do Twoich celów.",
    time: "Wczoraj",
    read: true
  },
  {
    id: "5",
    type: "delivery",
    title: "Dostawa zrealizowana",
    message: "Twoje posiłki zostały dostarczone. Smacznego!",
    time: "Wczoraj",
    read: true
  },
  {
    id: "6",
    type: "message",
    title: "Wiadomość od dietetyka",
    message: "Świetne postępy! Twoje wyniki są o 15% lepsze niż w poprzednim tygodniu.",
    time: "2 dni temu",
    read: true
  },
]

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "delivery": return <Truck className="h-5 w-5 text-blue-500" />
    case "preparation": return <ChefHat className="h-5 w-5 text-orange-500" />
    case "promo": return <Sparkles className="h-5 w-5 text-yellow-500" />
    case "system": return <AlertCircle className="h-5 w-5 text-gray-500" />
    case "message": return <MessageCircle className="h-5 w-5 text-primary" />
    default: return <Bell className="h-5 w-5" />
  }
}

interface NotificationsPanelProps {
  trigger?: React.ReactNode
}

export function NotificationsPanel({ trigger }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState(initialNotifications)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[calc(100vw-8rem)] sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Powiadomienia
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} nowe
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Zarządzaj powiadomieniami i ustawieniami
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {notifications.length > 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Oznacz wszystkie
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Wyczyść
                </Button>
              </div>

              <ScrollArea className="h-[calc(100vh-240px)]">
                <div className="space-y-2 pr-4 pl-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`group relative rounded-xl border p-4 pr-6 pl-6 transition-all ${
                        notification.read
                          ? "border-border/50 bg-background"
                          : "border-primary/30 bg-primary/5"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="mt-0.5 shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-foreground">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {notification.time}
                            </span>
                            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">Brak powiadomień</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Wszystkie powiadomienia zostały przeczytane
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
