"use client"

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Paperclip,
  Smile,
} from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "agent" | "bot"
  timestamp: Date
  agentName?: string
  agentAvatar?: string
}

interface LiveChatContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isMinimized: boolean
  setIsMinimized: (minimized: boolean) => void
}

const LiveChatContext = createContext<LiveChatContextType | undefined>(undefined)

export function useLiveChat() {
  const context = useContext(LiveChatContext)
  if (!context) {
    throw new Error("useLiveChat must be used within LiveChatProvider")
  }
  return context
}

export function LiveChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  return (
    <LiveChatContext.Provider value={{
      isOpen,
      setIsOpen,
      isMinimized,
      setIsMinimized,
    }}>
      {children}
    </LiveChatContext.Provider>
  )
}

const quickReplies = [
  "Gdzie jest moja dostawa?",
  "Chcę zmienić menu",
  "Mam pytanie o dietę",
  "Problem z płatnością",
]

const botResponses: Record<string, string> = {
  "gdzie jest moja dostawa":
    "Sprawdzam status Twojej dostawy... Kurier jest obecnie w drodze i powinien dotrzeć do Ciebie między 7:30 a 8:00. Możesz śledzić dostawę w panelu użytkownika w sekcji „Moje zamówienia”.",

  "chcę zmienić menu":
    "Możesz zmienić menu w sekcji „Plan tygodnia” do godziny 18:00 dnia poprzedzającego dostawę. Jeśli potrzebujesz pomocy przy konkretnej zmianie, połącz się z konsultantem.",

  "mam pytanie o dietę":
    "Chętnie pomogę! Jakie masz pytanie dotyczące diety? Możesz też przejrzeć naszą sekcję FAQ lub skontaktować się z dietetykiem.",

  "problem z płatnością":
    "Przepraszamy za niedogodności. Czy możesz opisać dokładniej problem? Jeśli płatność się nie powiodła, sprawdź, czy masz wystarczające środki na koncie lub spróbuj innej metody płatności.",

  default:
    "Dziękuję za wiadomość! Przeanalizuję Twoje pytanie i odpowiem najszybciej, jak to możliwe. Jeśli sprawa jest pilna, kliknij przycisk „Połącz z konsultantem” poniżej.",
}

export function LiveChat() {
  const { isOpen, setIsOpen, isMinimized, setIsMinimized } = useLiveChat()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Cześć! Jestem asystentem FitMeal. W czym mogę Ci pomóc?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isConnectedToAgent, setIsConnectedToAgent] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
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
      let responseText = botResponses.default

      for (const [key, value] of Object.entries(botResponses)) {
        if (key !== "default" && lowerText.includes(key)) {
          responseText = value
          break
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: isConnectedToAgent ? "Dziękuje za wiadomość. Już sprawdzam..." : responseText,
        sender: isConnectedToAgent ? "agent" : "bot",
        timestamp: new Date(),
        agentName: isConnectedToAgent
          ? "Anna Kowalska"
          : undefined,
        agentAvatar: isConnectedToAgent
          ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
          : undefined,
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1500)
  }

  const handleConnectToAgent = () => {
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setIsConnectedToAgent(true)

      const agentMessage: Message = {
        id: Date.now().toString(),
        text: "Cześć! Jestem Anna z zespołu wsparcia FitMeal. Przejrzałam Twoją rozmowę z botem. W czym mogę Ci pomóc?",
        sender: "agent",
        timestamp: new Date(),
        agentName: "Anna Kowalska",
        agentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      }

      setMessages((prev) => [...prev, agentMessage])
    }, 2000)
  }

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
          1
        </span>
      </Button>
    )
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 z-50 w-96 overflow-hidden shadow-2xl transition-all ${isMinimized ? "h-20" : "h-[600px]"}`}
    >
      <CardHeader
        className={`flex flex-row items-center justify-between ${
          isMinimized ? "h-20 px-4 py-2" : "border-b p-4"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              {isConnectedToAgent ? (
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              )}
            </Avatar>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
          </div>
          <div>
            <CardTitle className="text-sm">
              {isConnectedToAgent
                ? "Anna Kowalska"
                : "FitMeal Support"}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {isConnectedToAgent
                ? "Konsultant"
                : "Asystent AI"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex h-[calc(100%-140px)] flex-col overflow-hidden p-0">
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex max-w-[80%] gap-2 ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                      {message.sender !== "user" && (
                        <Avatar className="h-8 w-8 shrink-0">
                          {message.sender === "agent" && message.agentAvatar ? (
                            <AvatarImage src={message.agentAvatar} />
                          ) : (
                            <AvatarFallback className="bg-primary/10 text-primary">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                      )}
                      <div>
                        {message.sender === "agent" && message.agentName && (
                          <p className="mb-1 text-xs font-medium">{message.agentName}</p>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString("pl-PL", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-2">
                      <Avatar className="h-8 w-8">
                        {isConnectedToAgent ? (
                          <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="rounded-2xl bg-secondary px-4 py-3">
                        <div className="flex gap-1">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {!isConnectedToAgent && messages.length < 4 && (
              <div className="border-t p-3">
                <p className="mb-2 text-xs text-muted-foreground">Szybkie odpowiedzi:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <Badge
                      key={reply}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => handleQuickReply(reply)}
                    >
                      {reply}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {!isConnectedToAgent && messages.length >= 3 && (
              <div className="border-t p-3">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleConnectToAgent}
                >
                  <User className="h-4 w-4" />
                  Polacz z konsultantem
                </Button>
              </div>
            )}
          </CardContent>

          <div className="border-t p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage(inputValue)
              }}
              className="flex gap-2"
            >
              <div className="flex flex-1 items-center gap-2 rounded-full border bg-background px-3">
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Napisz wiadomosc..."
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0"
                />
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-full"
                disabled={!inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </Card>
  )
}

export function LiveChatTrigger({ className }: { className?: string }) {
  const { setIsOpen } = useLiveChat()

  return (
    <Button
      className={className}
      onClick={() => setIsOpen(true)}
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      Czat na żywo
    </Button>
  )
}
