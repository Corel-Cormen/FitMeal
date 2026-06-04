"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { 
  ArrowLeft, 
  Save, 
  User, 
  MapPin, 
  Phone, 
  Scale, 
  Ruler, 
  FileText,
  Truck,
  CheckCircle2,
  Sparkles,
  Clock,
  Shield,
  Star
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LegalDialogs } from "@/components/legal-dialogs"
import { errorToastStyle, successToastStyle } from "@/lib/sonner-toast"

const PENDING_NAME_KEY = "fitmeal_pendingProfileName"
const PENDING_EMAIL_KEY = "fitmeal_pendingProfileEmail"
const PROFILE_DETAILS_KEY = "fitmeal_profileDetails"

type ProfileDetails = {
  firstName: string
  lastName: string
  address: {
    street: string
    houseNumber: string
    apartment?: string
    postalCode: string
    city: string
  }
  deliveryNotes?: string
  phone: string
  acceptedTerms: boolean
  newsletterOptIn: boolean
  weightKg?: number
  heightCm?: number
  about?: string
  email?: string
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName
    .split(" ")
    .map((p) => p.trim())
    .filter(Boolean)

  if (parts.length === 0) return { firstName: "", lastName: "" }
  if (parts.length === 1) return { firstName: parts[0]!, lastName: "" }
  return { firstName: parts[0]!, lastName: parts.slice(1).join(" ") }
}

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "")
}

// Progress indicator component
function ProgressStep({ 
  step, 
  currentStep, 
  label, 
  icon: Icon 
}: { 
  step: number
  currentStep: number
  label: string
  icon: React.ComponentType<{ className?: string }>
}) {
  const isActive = currentStep >= step
  const isCurrent = currentStep === step
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
          isActive 
            ? "border-primary bg-primary text-primary-foreground" 
            : "border-muted-foreground/30 bg-background text-muted-foreground"
        } ${isCurrent ? "scale-110 shadow-lg shadow-primary/25" : ""}`}
      >
        {isActive && !isCurrent ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </div>
      <span className={`hidden text-xs font-medium transition-colors sm:block ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  )
}

// Section wrapper component
function FormSection({ 
  title, 
  description, 
  icon: Icon, 
  children 
}: { 
  title: string
  description?: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4 rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all duration-200 hover:border-border">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

// Enhanced input with floating label effect
function FloatingInput({
  id,
  label,
  value,
  onChange,
  error,
  disabled,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  icon: Icon,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: boolean
  disabled?: boolean
  placeholder?: string
  type?: string
  inputMode?: "text" | "numeric" | "tel" | "decimal"
  autoComplete?: string
  icon?: React.ComponentType<{ className?: string }>
}) {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value.length > 0
  const showFloating = isFocused || hasValue

  return (
    <div className="group relative">
      {Icon && (
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
          isFocused ? "text-primary" : "text-muted-foreground"
        }`}>
          <Icon className="h-4 w-4" />
        </div>
      )}
      <Input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={showFloating ? placeholder : ""}
        aria-invalid={error}
        className={`h-12 transition-all duration-200 ${Icon ? "pl-10" : ""} ${
          isFocused ? "border-primary ring-2 ring-primary/20" : ""
        } ${error ? "border-destructive ring-2 ring-destructive/20" : ""}`}
        disabled={disabled}
        autoComplete={autoComplete}
      />
      <Label
        htmlFor={id}
        className={`pointer-events-none absolute left-0 transition-all duration-200 ${Icon ? "left-10" : "left-3"} ${
          showFloating
            ? "-top-2.5 bg-background px-1 text-xs"
            : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
        } ${isFocused ? "text-primary" : error ? "text-destructive" : ""}`}
      >
        {label}
      </Label>
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [street, setStreet] = useState("")
  const [houseNumber, setHouseNumber] = useState("")
  const [apartment, setApartment] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [city, setCity] = useState("")
  const [deliveryNotes, setDeliveryNotes] = useState("")
  const [phone, setPhone] = useState("")

  const [weightKg, setWeightKg] = useState("")
  const [heightCm, setHeightCm] = useState("")
  const [about, setAbout] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [newsletterOptIn, setNewsletterOptIn] = useState(false)

  const [firstNameError, setFirstNameError] = useState(false)
  const [lastNameError, setLastNameError] = useState(false)
  const [streetError, setStreetError] = useState(false)
  const [houseNumberError, setHouseNumberError] = useState(false)
  const [postalCodeError, setPostalCodeError] = useState(false)
  const [cityError, setCityError] = useState(false)
  const [phoneError, setPhoneError] = useState(false)
  const [weightError, setWeightError] = useState(false)
  const [heightError, setHeightError] = useState(false)
  const [acceptedTermsError, setAcceptedTermsError] = useState(false)

  // Calculate current progress step
  const currentStep = useMemo(() => {
    if (!firstName.trim() || !lastName.trim()) return 1
    if (!street.trim() || !houseNumber.trim() || !postalCode.trim() || !city.trim()) return 2
    if (!phone.trim()) return 3
    return 4
  }, [firstName, lastName, street, houseNumber, postalCode, city, phone])

  const isPostalCodeValid = useMemo(() => {
    if (!postalCode.trim()) return false
    const normalized = postalCode.trim()
    return /^\d{2}-?\d{3}$/.test(normalized)
  }, [postalCode])

  useEffect(() => {
    if (typeof window === "undefined") return

    const pendingName = localStorage.getItem(PENDING_NAME_KEY) ?? ""

    if (pendingName && (!firstName || !lastName)) {
      const { firstName: f, lastName: l } = splitName(pendingName)
      setFirstName((prev) => prev || f)
      setLastName((prev) => prev || l)
    }
  }, [firstName, lastName])

  const isPhoneValid = useMemo(() => {
    const digits = normalizeDigits(phone)
    return digits.length >= 9 && digits.length <= 15
  }, [phone])

  const isWeightValid = useMemo(() => {
    if (!weightKg.trim()) return true
    const value = Number(weightKg)
    return Number.isFinite(value) && value > 0
  }, [weightKg])

  const isHeightValid = useMemo(() => {
    if (!heightCm.trim()) return true
    const value = Number(heightCm)
    return Number.isFinite(value) && value > 0
  }, [heightCm])

  function saveProfile(details: ProfileDetails) {
    if (typeof window === "undefined") return
    localStorage.setItem(PROFILE_DETAILS_KEY, JSON.stringify(details))
    localStorage.removeItem(PENDING_NAME_KEY)
    localStorage.removeItem(PENDING_EMAIL_KEY)
  }

  function validate() {
    const nextFirstNameError = !firstName.trim()
    const nextLastNameError = !lastName.trim()
    const nextStreetError = !street.trim()
    const nextHouseNumberError = !houseNumber.trim()
    const nextPostalCodeError = !postalCode.trim() || !isPostalCodeValid
    const nextCityError = !city.trim()
    const nextPhoneError = !phone.trim() || !isPhoneValid
    const nextAcceptedTermsError = !acceptedTerms

    const nextWeightError = !isWeightValid
    const nextHeightError = !isHeightValid

    setFirstNameError(nextFirstNameError)
    setLastNameError(nextLastNameError)
    setStreetError(nextStreetError)
    setHouseNumberError(nextHouseNumberError)
    setPostalCodeError(nextPostalCodeError)
    setCityError(nextCityError)
    setPhoneError(nextPhoneError)
    setWeightError(nextWeightError)
    setHeightError(nextHeightError)
    setAcceptedTermsError(nextAcceptedTermsError)

    if (nextFirstNameError) {
      toast.error("Proszę wpisać imię.", { style: errorToastStyle })
      return false
    }

    if (nextLastNameError) {
      toast.error("Proszę wpisać nazwisko.", { style: errorToastStyle })
      return false
    }

    if (nextStreetError) {
      toast.error("Proszę wpisać ulicę.", { style: errorToastStyle })
      return false
    }

    if (nextHouseNumberError) {
      toast.error("Proszę wpisać numer domu.", { style: errorToastStyle })
      return false
    }

    if (!postalCode.trim()) {
      toast.error("Proszę wpisać kod pocztowy.", { style: errorToastStyle })
      return false
    }

    if (!isPostalCodeValid) {
      toast.error("Kod pocztowy jest w nieprawidłowym formacie (np. 00-000).", { style: errorToastStyle })
      return false
    }

    if (nextCityError) {
      toast.error("Proszę wpisać miasto.", { style: errorToastStyle })
      return false
    }

    if (!phone.trim()) {
      toast.error("Proszę wpisać numer telefonu.", { style: errorToastStyle })
      return false
    }

    if (!isPhoneValid) {
      toast.error("Numer telefonu jest w nieprawidłowym formacie.", { style: errorToastStyle })
      return false
    }

    if (nextAcceptedTermsError) {
      toast.error("Musisz zaakceptować regulamin FitMeal.", { style: errorToastStyle })
      return false
    }

    if (nextWeightError) {
      toast.error("Waga musi być dodatnią liczbą.", { style: errorToastStyle })
      return false
    }

    if (nextHeightError) {
      toast.error("Wzrost musi być dodatnią liczbą.", { style: errorToastStyle })
      return false
    }

    return true
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isSubmitting) return
    if (!validate()) return

    setIsSubmitting(true)

    const pendingEmail = typeof window !== "undefined" ? localStorage.getItem(PENDING_EMAIL_KEY) ?? undefined : undefined

    const details: ProfileDetails = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: {
        street: street.trim(),
        houseNumber: houseNumber.trim(),
        apartment: apartment.trim() ? apartment.trim() : undefined,
        postalCode: postalCode.trim(),
        city: city.trim(),
      },
      deliveryNotes: deliveryNotes.trim() ? deliveryNotes.trim() : undefined,
      phone: phone.trim(),
      acceptedTerms,
      newsletterOptIn,
      about: about.trim() ? about.trim() : undefined,
      email: pendingEmail,
    }

    if (weightKg.trim()) details.weightKg = Number(weightKg)
    if (heightCm.trim()) details.heightCm = Number(heightCm)

    setTimeout(() => {
      saveProfile(details)
      toast.success("Dane zapisane. Dokończymy konfigurację w panelu.", { style: successToastStyle })
      setIsSubmitting(false)
      router.push("/dashboard/start")
    }, 600)
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Full-width background image */}
      <div className="fixed inset-0 hidden lg:block">
        <Image
          src="/FitMeal/images/onboarding-hero.png"
          alt="Przygotowane posilki"
          fill
          className="object-cover brightness-[0.85] saturate-[1.1]"
          priority
        />
      </div>
      
      <div className="relative flex min-h-screen">
        {/* Left side content - visible on larger screens */}
        <div className="relative hidden w-[22%] flex-col justify-between p-6 lg:flex xl:w-[25%] xl:p-10">
          {/* Subtle backdrop for text readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
          {/* Gradient fade to center */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background via-background/70 to-transparent" />
          
          <div className="relative z-10">
            <Link href="/login" className="inline-flex items-center gap-2 text-white/90 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Wróć do logowania
            </Link>
          </div>
          
          <div className="relative z-10 max-w-xs space-y-5">
            <h1 className="text-2xl font-bold tracking-tight text-white xl:text-3xl">
              Prawie gotowe!
            </h1>
            <p className="text-sm text-white/80 xl:text-base">
              Uzupelnij swoje dane, abysmy mogli dostarczac Ci swieze posilki.
            </p>
            
            {/* Benefits */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Dostawa 6:00-9:00</p>
                  <p className="text-xs text-white/60">Swieze sniadanie co rano</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <Shield className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Bezpieczne dane</p>
                  <p className="text-xs text-white/60">Twoje dane sa u nas bezpieczne</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="relative z-10 flex gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-white">50k+</p>
              <p className="text-xs text-white/60">Klientów</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">4.9</p>
              <p className="text-xs text-white/60">Ocena</p>
            </div>
          </div>
        </div>

        {/* Center - Form with blended background */}
        <div className="relative flex w-full flex-col lg:w-[56%] xl:w-[50%]">
          {/* Center panel background - solid for form readability */}
          <div className="absolute inset-0 bg-background lg:bg-background/98" />
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-12 bg-gradient-to-r from-transparent to-background/98 lg:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-12 bg-gradient-to-l from-transparent to-background/98 lg:block" />
          
          {/* Mobile back link */}
          <div className="relative z-10 p-4 lg:hidden">
            <Link 
              href="/login" 
              className="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Wróć do logowania
            </Link>
          </div>
          
          {/* Subtle animated accents */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-32 -top-32 h-64 w-64 animate-pulse rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-64 w-64 animate-pulse rounded-full bg-primary/5 blur-3xl" style={{ animationDelay: "1s" }} />
          </div>

          <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-10">
            {/* Progress indicator */}
            <div className="mx-auto mb-8 max-w-2xl">
              <div className="flex items-center justify-between">
                <ProgressStep step={1} currentStep={currentStep} label="Dane osobowe" icon={User} />
                <div className={`h-0.5 flex-1 mx-2 transition-colors duration-300 ${currentStep > 1 ? "bg-primary" : "bg-muted"}`} />
                <ProgressStep step={2} currentStep={currentStep} label="Adres" icon={MapPin} />
                <div className={`h-0.5 flex-1 mx-2 transition-colors duration-300 ${currentStep > 2 ? "bg-primary" : "bg-muted"}`} />
                <ProgressStep step={3} currentStep={currentStep} label="Kontakt" icon={Phone} />
                <div className={`h-0.5 flex-1 mx-2 transition-colors duration-300 ${currentStep > 3 ? "bg-primary" : "bg-muted"}`} />
                <ProgressStep step={4} currentStep={currentStep} label="Dodatkowe" icon={Sparkles} />
              </div>
            </div>

            <div className="mx-auto max-w-2xl">
                <Card className="border-border/50 bg-card/95 shadow-2xl backdrop-blur-xl lg:bg-card/90">
                <CardHeader className="space-y-2 text-center">
                  <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tight">Uzupełnij swój profil</CardTitle>
                  <CardDescription className="text-base">
                    Podaj dane potrzebne do realizacji dostaw. Dodatkowe informacje pomogą nam lepiej dopasować dietę.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    {/* Personal data section */}
                    <FormSection title="Dane osobowe" description="Jak się nazywasz?" icon={User}>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FloatingInput
                          id="firstName"
                          label="Imię"
                          value={firstName}
                          onChange={(v) => {
                            setFirstName(v)
                            if (firstNameError && v.trim()) setFirstNameError(false)
                          }}
                          error={firstNameError}
                          disabled={isSubmitting}
                          placeholder="np. Jan"
                          autoComplete="given-name"
                        />
                        <FloatingInput
                          id="lastName"
                          label="Nazwisko"
                          value={lastName}
                          onChange={(v) => {
                            setLastName(v)
                            if (lastNameError && v.trim()) setLastNameError(false)
                          }}
                          error={lastNameError}
                          disabled={isSubmitting}
                          placeholder="np. Kowalski"
                          autoComplete="family-name"
                        />
                      </div>
                    </FormSection>

                    {/* Address section */}
                    <FormSection title="Adres dostawy" description="Gdzie mamy dostarczyć posiłki?" icon={MapPin}>
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="sm:col-span-2">
                            <FloatingInput
                              id="street"
                              label="Ulica"
                              value={street}
                              onChange={(v) => {
                                setStreet(v)
                                if (streetError && v.trim()) setStreetError(false)
                              }}
                              error={streetError}
                              disabled={isSubmitting}
                              placeholder="np. Marszałkowska"
                              autoComplete="address-line1"
                            />
                          </div>
                          <FloatingInput
                            id="houseNumber"
                            label="Nr domu"
                            value={houseNumber}
                            onChange={(v) => {
                              setHouseNumber(v)
                              if (houseNumberError && v.trim()) setHouseNumberError(false)
                            }}
                            error={houseNumberError}
                            disabled={isSubmitting}
                            placeholder="np. 10A"
                            autoComplete="address-line2"
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                          <FloatingInput
                            id="apartment"
                            label="Nr lokalu (opcjonalnie)"
                            value={apartment}
                            onChange={setApartment}
                            disabled={isSubmitting}
                            placeholder="np. 12"
                          />
                          <FloatingInput
                            id="postalCode"
                            label="Kod pocztowy"
                            value={postalCode}
                            onChange={(v) => {
                              setPostalCode(v)
                              if (postalCodeError && /^\d{2}-?\d{3}$/.test(v.trim())) setPostalCodeError(false)
                            }}
                            error={postalCodeError}
                            disabled={isSubmitting}
                            placeholder="00-000"
                            inputMode="numeric"
                            autoComplete="postal-code"
                          />
                          <FloatingInput
                            id="city"
                            label="Miasto"
                            value={city}
                            onChange={(v) => {
                              setCity(v)
                              if (cityError && v.trim()) setCityError(false)
                            }}
                            error={cityError}
                            disabled={isSubmitting}
                            placeholder="np. Warszawa"
                            autoComplete="address-level2"
                          />
                        </div>
                      </div>
                    </FormSection>

                    {/* Delivery notes section */}
                    <FormSection title="Informacje dla kuriera" description="Opcjonalne wskazówki" icon={Truck}>
                      <Textarea
                        id="deliveryNotes"
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        placeholder="Np. domofon 123, piętro 3, pozostaw przy drzwiach..."
                        className="min-h-20 resize-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        disabled={isSubmitting}
                      />
                    </FormSection>

                    {/* Contact section */}
                    <FormSection title="Kontakt" description="Numer telefonu do kontaktu" icon={Phone}>
                      <FloatingInput
                        id="phone"
                        label="Numer telefonu"
                        value={phone}
                        onChange={(v) => {
                          setPhone(v)
                          if (phoneError && normalizeDigits(v).length >= 9) setPhoneError(false)
                        }}
                        error={phoneError}
                        disabled={isSubmitting}
                        placeholder="+48 600 700 800"
                        inputMode="tel"
                        autoComplete="tel"
                        icon={Phone}
                      />
                    </FormSection>

                    {/* Additional info section */}
                    <FormSection title="Dodatkowe informacje" description="Pomóż nam lepiej dopasować dietę (opcjonalne)" icon={Sparkles}>
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <FloatingInput
                            id="weight"
                            label="Waga (kg)"
                            value={weightKg}
                            onChange={(v) => {
                              setWeightKg(v)
                              if (weightError && (v.trim() === "" || Number(v) > 0)) setWeightError(false)
                            }}
                            error={weightError}
                            disabled={isSubmitting}
                            placeholder="np. 70"
                            inputMode="decimal"
                            icon={Scale}
                          />
                          <FloatingInput
                            id="height"
                            label="Wzrost (cm)"
                            value={heightCm}
                            onChange={(v) => {
                              setHeightCm(v)
                              if (heightError && (v.trim() === "" || Number(v) > 0)) setHeightError(false)
                            }}
                            error={heightError}
                            disabled={isSubmitting}
                            placeholder="np. 175"
                            inputMode="decimal"
                            icon={Ruler}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="about" className="flex items-center gap-2 text-sm font-medium">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            Coś o sobie
                          </Label>
                          <Textarea
                            id="about"
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            placeholder="Np. cele dietetyczne, ograniczenia, alergie pokarmowe, preferencje..."
                            className="min-h-24 resize-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    </FormSection>

                    {/* Terms and newsletter */}
                    <div className="space-y-4 rounded-xl border border-border/50 bg-card/50 p-5">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          id="acceptedTerms"
                          checked={acceptedTerms}
                          onCheckedChange={(checked) => {
                            const next = checked === true
                            setAcceptedTerms(next)
                            if (next) setAcceptedTermsError(false)
                          }}
                          aria-invalid={acceptedTermsError}
                          disabled={isSubmitting}
                          className={`mt-0.5 h-5 w-5 rounded border-2 transition-all duration-200 ${
                            acceptedTermsError
                              ? "border-destructive"
                              : acceptedTerms 
                                ? "border-primary bg-primary" 
                                : "border-muted-foreground/40"
                          }`}
                        />
                        <div className="grid gap-1.5">
                          <Label 
                            htmlFor="acceptedTerms" 
                            className={`cursor-pointer leading-relaxed ${acceptedTermsError ? "text-destructive" : ""}`}
                          >
                            Akceptuję regulamin FitMeal <span className="text-destructive">*</span>
                          </Label>
                          <div className="text-xs text-muted-foreground">
                            <LegalDialogs className="inline" showPrivacy={false} showTerms={true} />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Checkbox
                          id="newsletterOptIn"
                          checked={newsletterOptIn}
                          onCheckedChange={(checked) => setNewsletterOptIn(checked === true)}
                          disabled={isSubmitting}
                          className={`mt-0.5 h-5 w-5 rounded border-2 transition-all duration-200 ${
                            newsletterOptIn ? "border-primary bg-primary" : "border-muted-foreground/40"
                          }`}
                        />
                        <div className="grid gap-1">
                          <Label htmlFor="newsletterOptIn" className="cursor-pointer leading-relaxed">
                            Chcę otrzymywać newsletter FitMeal
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Będziemy wysyłać Ci informacje o promocjach i nowościach
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Submit button */}
                    <div className="flex items-center justify-end pt-2">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting} 
                        size="lg"
                        className="gap-2 px-8 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                            Zapisywanie...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Zapisz i przejdź dalej
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Right side content - visible on larger screens */}
        <div className="relative hidden w-[22%] flex-col justify-center p-6 lg:flex xl:w-[25%] xl:p-10">
          {/* Gradient fade from center */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background via-background/70 to-transparent" />
          {/* Subtle backdrop for text readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/40 via-black/20 to-transparent" />
          
          <div className="relative z-10 max-w-xs space-y-5 ml-auto">
            <div className="rounded-xl bg-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-yellow-400" />
                <h3 className="text-base font-semibold text-white">Personalizacja menu</h3>
              </div>
              <p className="text-sm text-white/80">
                Dieta dopasowana do Twoich celów i preferencji. Powiedz nam czego potrzebujesz!
              </p>
            </div>
            
            <div className="rounded-xl bg-white/10 p-5 backdrop-blur-md">
              <h3 className="mb-3 text-base font-semibold text-white">Co zyskujesz?</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Spersonalizowane posilki
                </li>
                <li className="flex items-center gap-2 text-sm text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Elastyczne zmiany menu
                </li>
                <li className="flex items-center gap-2 text-sm text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Pelne wsparcie dietetyka
                </li>
              </ul>
            </div>
            
            <div className="text-center">
              <p className="text-xl font-bold text-white">99%</p>
              <p className="text-xs text-white/60">Dostaw na czas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
