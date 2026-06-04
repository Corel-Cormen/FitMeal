"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Sparkles, Utensils, Heart, Leaf } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { errorToastStyle, successToastStyle } from "@/lib/sonner-toast"

const HAS_PURCHASED_DIET_KEY = "fitmeal_hasPurchasedDiet"
const PENDING_NAME_KEY = "fitmeal_pendingProfileName"
const PENDING_EMAIL_KEY = "fitmeal_pendingProfileEmail"

function LoginContent() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [nameInvalid, setNameInvalid] = useState(false)
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [passwordInvalid, setPasswordInvalid] = useState(false)

  const [focusedField, setFocusedField] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const mode = searchParams?.get("mode")
    if (mode === "register") {
      setIsLogin(false)
    } else if (mode === "login") {
      setIsLogin(true)
    }
  }, [searchParams])

  useEffect(() => {
    if (isLogin) setNameInvalid(false)
  }, [isLogin])

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const validate = () => {
    const trimmedEmail = email.trim()

    const nextNameInvalid = !isLogin && !name.trim()
    const nextEmailInvalid = !trimmedEmail || !validateEmail(trimmedEmail)
    const nextPasswordInvalid = !password || password.length < 6

    setNameInvalid(nextNameInvalid)
    setEmailInvalid(nextEmailInvalid)
    setPasswordInvalid(nextPasswordInvalid)

    if (nextNameInvalid) {
      toast.error("Proszę wpisać imię i nazwisko.", { style: errorToastStyle })
      return false
    }

    if (!trimmedEmail) {
      toast.error("Proszę wpisać email.", { style: errorToastStyle })
      return false
    }

    if (!validateEmail(trimmedEmail)) {
      toast.error("Email nie jest w prawidłowym formacie.", { style: errorToastStyle })
      return false
    }

    if (!password) {
      toast.error("Proszę wpisać hasło.", { style: errorToastStyle })
      return false
    }

    if (password.length < 6) {
      toast.error("Hasło musi mieć co najmniej 6 znaków.", { style: errorToastStyle })
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    if (!validate()) return

    const trimmedEmail = email.trim()

    setIsSubmitting(true)

    setTimeout(() => {
      toast.success(isLogin ? "Zalogowano pomyślnie!" : "Konto zostało utworzone!", {
        style: successToastStyle,
      })

      if (isLogin) {
        localStorage.setItem(HAS_PURCHASED_DIET_KEY, "true")
      } else {
        localStorage.setItem(HAS_PURCHASED_DIET_KEY, "false")
        localStorage.setItem(PENDING_NAME_KEY, name.trim())
        localStorage.setItem(PENDING_EMAIL_KEY, trimmedEmail)
      }

      setIsSubmitting(false)
      router.push(isLogin ? "/dashboard" : "/onboarding")
    }, 800)
  }

  const handleSocialAuth = (provider: "Google" | "Facebook") => {
    if (isSubmitting) return

    setIsSubmitting(true)

    setTimeout(() => {
      toast.success(
        isLogin
          ? `Zalogowano przez ${provider}!`
          : `Konto zostało utworzone przez ${provider}!`,
        { style: successToastStyle },
      )

      if (isLogin) {
        localStorage.setItem(HAS_PURCHASED_DIET_KEY, "true")
      } else {
        localStorage.setItem(HAS_PURCHASED_DIET_KEY, "false")
      }

      setIsSubmitting(false)
      router.push(isLogin ? "/dashboard" : "/onboarding")
    }, 800)
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Full-width background image */}
      <div className="fixed inset-0 hidden lg:block">
        <Image
          src="/FitMeal/images/login-hero.png"
          alt="Zdrowe jedzenie"
          fill
          className="object-cover brightness-[0.85] saturate-[1.1]"
          priority
        />
      </div>
      
      <div className="relative flex min-h-screen">
        {/* Left side content - visible on larger screens */}
        <div className="relative hidden w-[30%] flex-col justify-between p-8 lg:flex xl:w-[35%] xl:p-12">
          {/* Subtle backdrop for text readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
          {/* Gradient fade to center */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background via-background/70 to-transparent" />
          
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white/90 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Strona glowna
            </Link>
          </div>
          
          <div className="relative z-10 max-w-sm space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-white xl:text-4xl">
              Odkryj smak zdrowego zycia
            </h1>
            <p className="text-base text-white/80 xl:text-lg">
              Dostarczamy zbilansowane posilki prosto pod Twoje drzwi.
            </p>
            
            {/* Feature badges */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Utensils className="h-4 w-4 text-primary" />
                <span className="text-sm text-white">Swieze skladniki</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Heart className="h-4 w-4 text-red-400" />
                <span className="text-sm text-white">Zbilansowane menu</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Leaf className="h-4 w-4 text-green-400" />
                <span className="text-sm text-white">Eko opakowania</span>
              </div>
            </div>
          </div>
          
          {/* Testimonial */}
          <div className="relative z-10 max-w-sm rounded-xl bg-white/10 p-5 backdrop-blur-md">
            <p className="text-sm text-white/90 italic xl:text-base">
              &quot;FitMeal calkowicie zmienil moje podejscie do jedzenia!&quot;
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs text-primary">
                AK
              </div>
              <div>
                <p className="text-sm font-medium text-white">Anna Kowalska</p>
                <p className="text-xs text-white/60">Klientka od 2023</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Center - Form with blended background */}
        <div className="relative flex w-full items-center justify-center lg:w-[40%] xl:w-[30%]">
          {/* Center panel background - solid for form readability */}
          <div className="absolute inset-0 bg-background lg:bg-background/98" />
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-transparent to-background/98 lg:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-transparent to-background/98 lg:block" />
          
          {/* Mobile back link */}
          <div className="absolute left-4 top-4 z-20 lg:hidden">
            <Link 
              href="/" 
              className="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Wróć
            </Link>
          </div>
          
          {/* Subtle animated accents */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-32 -top-32 h-64 w-64 animate-pulse rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-64 w-64 animate-pulse rounded-full bg-primary/5 blur-3xl" style={{ animationDelay: "1s" }} />
          </div>

          <div className="relative z-10 w-full max-w-md px-6 py-12">
            <Card className="border-border/50 bg-card/95 shadow-2xl backdrop-blur-xl lg:bg-card/90">
              <CardHeader className="space-y-2 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  {isLogin ? "Witaj ponownie!" : "Dołącz do nas"}
                </CardTitle>
                <CardDescription className="text-base">
                  {isLogin
                    ? "Zaloguj się do swojego konta FitMeal"
                    : "Stwórz konto i zacznij zdrową przygodę"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {!isLogin && (
                    <div className="group relative">
                      <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === "name" ? "text-primary" : "text-muted-foreground"}`}>
                        <User className="h-4 w-4" />
                      </div>
                      <Input
                        type="text"
                        placeholder="Imię i nazwisko"
                        value={name}
                        onChange={(e) => {
                          const next = e.target.value
                          setName(next)
                          if (nameInvalid && next.trim()) setNameInvalid(false)
                        }}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        className={`h-12 pl-10 transition-all duration-200 ${
                          focusedField === "name" ? "border-primary ring-2 ring-primary/20" : ""
                        } ${nameInvalid ? "border-destructive ring-2 ring-destructive/20" : ""}`}
                        aria-invalid={nameInvalid}
                        disabled={isSubmitting}
                      />
                    </div>
                  )}

                  <div className="group relative">
                    <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === "email" ? "text-primary" : "text-muted-foreground"}`}>
                      <Mail className="h-4 w-4" />
                    </div>
                    <Input
                      type="email"
                      placeholder="Adres e-mail"
                      value={email}
                      onChange={(e) => {
                        const next = e.target.value
                        setEmail(next)
                        if (emailInvalid && validateEmail(next.trim())) setEmailInvalid(false)
                      }}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className={`h-12 pl-10 transition-all duration-200 ${
                        focusedField === "email" ? "border-primary ring-2 ring-primary/20" : ""
                      } ${emailInvalid ? "border-destructive ring-2 ring-destructive/20" : ""}`}
                      aria-invalid={emailInvalid}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="group relative">
                    <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === "password" ? "text-primary" : "text-muted-foreground"}`}>
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Hasło"
                      value={password}
                      onChange={(e) => {
                        const next = e.target.value
                        setPassword(next)
                        if (passwordInvalid && next.length >= 6) setPasswordInvalid(false)
                      }}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className={`h-12 pl-10 pr-12 transition-all duration-200 ${
                        focusedField === "password" ? "border-primary ring-2 ring-primary/20" : ""
                      } ${passwordInvalid ? "border-destructive ring-2 ring-destructive/20" : ""}`}
                      aria-invalid={passwordInvalid}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {isLogin && (
                    <div className="flex justify-end">
                      <button 
                        type="button" 
                        className="text-sm text-muted-foreground transition-colors hover:text-primary hover:underline"
                      >
                        Zapomniałeś hasła?
                      </button>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="h-12 w-full text-base font-medium shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30" 
                    size="lg" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Przetwarzanie...
                      </span>
                    ) : isLogin ? "Zaloguj się" : "Zarejestruj się"}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-card px-4 text-muted-foreground">lub kontynuuj przez</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      type="button"
                      className="h-12 w-full transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
                      onClick={() => handleSocialAuth("Google")}
                      disabled={isSubmitting}
                    >
                      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      className="h-12 w-full transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
                      onClick={() => handleSocialAuth("Facebook")}
                      disabled={isSubmitting}
                    >
                      <svg className="mr-2 h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      Facebook
                    </Button>
                  </div>
                </form>

                <div className="mt-8 text-center">
                  <div className="rounded-lg bg-muted/50 p-4">
                    {isLogin ? (
                      <p className="text-sm text-muted-foreground">
                        Nie masz jeszcze konta?{" "}
                        <button
                          onClick={() => setIsLogin(false)}
                          className="font-semibold text-primary transition-colors hover:underline"
                        >
                          Zarejestruj się za darmo
                        </button>
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Masz już konto?{" "}
                        <button
                          onClick={() => setIsLogin(true)}
                          className="font-semibold text-primary transition-colors hover:underline"
                        >
                          Zaloguj się
                        </button>
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Right side content - visible on larger screens */}
        <div className="relative hidden w-[30%] flex-col justify-center p-8 lg:flex xl:w-[35%] xl:p-12">
          {/* Gradient fade from center */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background via-background/70 to-transparent" />
          {/* Subtle backdrop for text readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/40 via-black/20 to-transparent" />
          
          <div className="relative z-10 max-w-sm space-y-6 ml-auto">
            <div className="rounded-xl bg-white/10 p-5 backdrop-blur-md">
              <h3 className="mb-3 text-lg font-semibold text-white">Dlaczego FitMeal?</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-white/80">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                    <span className="text-xs text-primary">1</span>
                  </div>
                  Oszczedzasz czas na gotowaniu
                </li>
                <li className="flex items-center gap-3 text-sm text-white/80">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                    <span className="text-xs text-primary">2</span>
                  </div>
                  Zdrowe, zbilansowane posilki
                </li>
                <li className="flex items-center gap-3 text-sm text-white/80">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                    <span className="text-xs text-primary">3</span>
                  </div>
                  Dostawa prosto pod drzwi
                </li>
              </ul>
            </div>
            
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">50k+</p>
                <p className="text-xs text-white/60">Klientów</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">4.9</p>
                <p className="text-xs text-white/60">Ocena</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">99%</p>
                <p className="text-xs text-white/60">Na czas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
