"use client"

import { useState, useRef, useEffect } from "react"
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
  Phone,
  Mail,
  Clock,
  Bot,
  User,
  Paperclip,
  Smile,
  ChevronDown,
} from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "agent" | "bot"
  timestamp: Date
  agentName?: string
  agentAvatar?: string
}

const quickReplies = [
  "Gdzie jest moja dostawa?",
  "Chce zmienic menu",
  "Mam pytanie o diete",
  "Problem z platnoscia",
]

const botResponses: Record<string, string> = {
  "gdzie jest moja dostawa": "Sprawdzam status Twojej dostawy... Kurier jest obecnie w drodze i powinien dotrzec do Ciebie miedzy 7:30 a 8:00. Mozesz sledzic dostawe w panelu uzytkownika w sekcji 'Moje zamowienia'.",
  "chce zmienic menu": "Mozesz zmienic menu w sekcji 'Plan tygodnia' do godziny 18:00 dnia poprzedzajacego dostawe. Jesli potrzebujesz pomocy z konkretna zmiana, polacz sie z konsultantem.",
  "mam pytanie o diete": "Chetnie pomoge! Jaki masz konkretnie problem z dieta? Mozesz tez przejrzec nasza sekcje FAQ lub polaczyc sie z dietetykiem.",
  "problem z platnoscia": "Przepraszam za niedogodnosci. Czy moglbys opisac dokladniej problem? Jesli platnosc sie nie powiodla, sprawdz czy masz wystarczajace srodki na koncie lub sprobuj innej metody platnosci.",
  default: "Dziekuje za wiadomosc! Przeanalizuje Twoje pytanie i odpowiem najszybciej jak to mozliwe. Jesli sprawa jest pilna, kliknij przycisk 'Polacz z konsultantem' ponizej.",
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Czesc! Jestem asystentem FitMeal. W czym moge Ci pomoc?",
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
        text: isConnectedToAgent 
          ? "Dziekuje za wiadomosc. Juz sprawdzam..." 
          : responseText,
        sender: isConnectedToAgent ? "agent" : "bot",
        timestamp: new Date(),
        agentName: isConnectedToAgent ? "Anna Kowalska" : undefined,
        agentAvatar: isConnectedToAgent ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" : undefined,
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
        text: "Czesc! Jestem Anna z zespolu wsparcia FitMeal. Przejrzalam Twoja rozmowe z botem. W czym moge Ci pomoc?",
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
    <Card className={`fixed bottom-6 right-6 z-50 w-96 shadow-2xl transition-all ${isMinimized ? "h-14" : "h-[600px]"}`}>
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
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
              {isConnectedToAgent ? "Anna Kowalska" : "FitMeal Support"}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {isConnectedToAgent ? "Konsultant" : "Asystent AI"}
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
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        className={className}
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        Czat na zywo
      </Button>
      
      {isOpen && <LiveChatWidget onClose={() => setIsOpen(false)} />}
    </>
  )
}

function LiveChatWidget({ onClose }: { onClose: () => void }) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Czesc! Jestem asystentem FitMeal. W czym moge Ci pomoc?",
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
        text: isConnectedToAgent 
          ? "Dziekuje za wiadomosc. Juz sprawdzam..." 
          : responseText,
        sender: isConnectedToAgent ? "agent" : "bot",
        timestamp: new Date(),
        agentName: isConnectedToAgent ? "Anna Kowalska" : undefined,
        agentAvatar: isConnectedToAgent ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" : undefined,
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
        text: "Czesc! Jestem Anna z zespolu wsparcia FitMeal. Przejrzalam Twoja rozmowe z botem. W czym moge Ci pomoc?",
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

  return (
    <Card className={`fixed bottom-6 right-6 z-50 w-96 shadow-2xl transition-all ${isMinimized ? "h-14" : "h-[600px]"}`}>
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
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
              {isConnectedToAgent ? "Anna Kowalska" : "FitMeal Support"}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {isConnectedToAgent ? "Konsultant" : "Asystent AI"}
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
            onClick={onClose}
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
