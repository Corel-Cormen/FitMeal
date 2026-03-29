"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { CheckCircle2 } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { errorToastStyle, successToastStyle } from "@/lib/sonner-toast"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [consentError, setConsentError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null)

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const isEmailValid = useMemo(() => validateEmail(email.trim()), [email])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isSubmitting || isSubscribed) return

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      toast.error("Proszę wpisać email.", { style: errorToastStyle })
      return
    }

    if (!validateEmail(trimmedEmail)) {
      toast.error("Email nie jest w prawidłowym formacie.", { style: errorToastStyle })
      return
    }

    if (!consent) {
      setConsentError(true)
      toast.error("Aby się zapisać, musisz wyrazić zgodę na przetwarzanie danych.", { style: errorToastStyle })
      return
    }

    setConsentError(false)

    setIsSubmitting(true)

    setTimeout(() => {
      toast.success("Dziękujemy! Zapis do newslettera został przyjęty.", { style: successToastStyle })
      setIsSubscribed(true)
      setSubscribedEmail(trimmedEmail)
      setIsSubmitting(false)
    }, 1200)
  }

  return (
    <section id="newsletter" className="py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-3xl bg-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle>Zapisz się do newslettera</CardTitle>
            <CardDescription>
              Otrzymuj informacje o nowych dietach, promocjach i aktualnościach FitMeal.
              <span className="block mt-1">
                Bonus: <span className="font-medium text-foreground">-10%</span> na pierwsze zamówienie — kod promocyjny otrzymasz w e-mailu.
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubscribed && (
              <Alert className="mb-4">
                <CheckCircle2 />
                <AlertTitle>Zapis się udał</AlertTitle>
                <AlertDescription>
                  <p>
                    Jesteś zapisany do newslettera{subscribedEmail ? `: ${subscribedEmail}` : ""}.
                  </p>
                </AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid gap-2">
                <Label htmlFor="newsletter-email">Email</Label>
                <Input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="np. jan@example.com"
                  autoComplete="email"
                  aria-invalid={email.trim().length > 0 && !isEmailValid}
                  disabled={isSubscribed}
                />
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="newsletter-consent"
                  checked={consent}
                  onCheckedChange={(checked) => {
                    const next = checked === true
                    setConsent(next)
                    if (next) setConsentError(false)
                  }}
                  disabled={isSubscribed}
                  aria-invalid={consentError}
                  className={
                    consentError
                      ? "size-5 border-2 border-destructive ring-2 ring-destructive/20"
                      : "size-5 border-2 border-foreground/40"
                  }
                />
                <div className="grid gap-1">
                  <Label htmlFor="newsletter-consent" className="leading-snug">
                    Wyrażam zgodę na przetwarzanie danych osobowych w celu otrzymywania newslettera.
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Zgodę możesz wycofać w dowolnym momencie.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button type="submit" disabled={isSubmitting || isSubscribed}>
                  {isSubscribed ? "Zapisano" : isSubmitting ? "Wysyłanie…" : "Zapisz się"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
