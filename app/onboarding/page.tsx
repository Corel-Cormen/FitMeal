"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeft, Save } from "lucide-react"

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

  const isPostalCodeValid = useMemo(() => {
    if (!postalCode.trim()) return false
    const normalized = postalCode.trim()
    return /^\d{2}-?\d{3}$/.test(normalized)
  }, [postalCode])

  useEffect(() => {
    if (typeof window === "undefined") return

    const pendingName = localStorage.getItem(PENDING_NAME_KEY) ?? ""
    const pendingEmail = localStorage.getItem(PENDING_EMAIL_KEY) ?? ""

    if (pendingName && (!firstName || !lastName)) {
      const { firstName: f, lastName: l } = splitName(pendingName)
      setFirstName((prev) => prev || f)
      setLastName((prev) => prev || l)
    }

    if (pendingEmail) {
      // Email nie jest częścią formularza, ale zachowujemy je przy zapisie profilu.
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
    <div className="min-h-screen bg-secondary/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/login" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Wróć do logowania
          </Link>
        </div>

        <div className="mx-auto max-w-2xl">
          <Card className="border-border/50 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Uzupełnij dane</CardTitle>
              <CardDescription>
                Podaj dane potrzebne do realizacji dostaw. Dodatkowe informacje pomogą nam lepiej dopasować dietę.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">Imię</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => {
                        const next = e.target.value
                        setFirstName(next)
                        if (firstNameError && next.trim()) setFirstNameError(false)
                      }}
                      aria-invalid={firstNameError}
                      className={firstNameError ? "border-destructive ring-2 ring-destructive/20" : undefined}
                      disabled={isSubmitting}
                      autoComplete="given-name"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Nazwisko</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => {
                        const next = e.target.value
                        setLastName(next)
                        if (lastNameError && next.trim()) setLastNameError(false)
                      }}
                      aria-invalid={lastNameError}
                      className={lastNameError ? "border-destructive ring-2 ring-destructive/20" : undefined}
                      disabled={isSubmitting}
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Adres dostawy</Label>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="street" className="text-sm text-muted-foreground">Ulica</Label>
                        <Input
                          id="street"
                          value={street}
                          onChange={(e) => {
                            const next = e.target.value
                            setStreet(next)
                            if (streetError && next.trim()) setStreetError(false)
                          }}
                          aria-invalid={streetError}
                          className={streetError ? "border-destructive ring-2 ring-destructive/20" : undefined}
                          disabled={isSubmitting}
                          autoComplete="address-line1"
                          placeholder="Np. Marszałkowska"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="houseNumber" className="text-sm text-muted-foreground">Nr domu</Label>
                        <Input
                          id="houseNumber"
                          value={houseNumber}
                          onChange={(e) => {
                            const next = e.target.value
                            setHouseNumber(next)
                            if (houseNumberError && next.trim()) setHouseNumberError(false)
                          }}
                          aria-invalid={houseNumberError}
                          className={houseNumberError ? "border-destructive ring-2 ring-destructive/20" : undefined}
                          disabled={isSubmitting}
                          autoComplete="address-line2"
                          placeholder="Np. 10A"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="grid gap-2">
                        <Label htmlFor="apartment" className="text-sm text-muted-foreground">Nr lokalu (opcjonalnie)</Label>
                        <Input
                          id="apartment"
                          value={apartment}
                          onChange={(e) => setApartment(e.target.value)}
                          disabled={isSubmitting}
                          placeholder="Np. 12"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="postalCode" className="text-sm text-muted-foreground">Kod pocztowy</Label>
                        <Input
                          id="postalCode"
                          inputMode="numeric"
                          value={postalCode}
                          onChange={(e) => {
                            const next = e.target.value
                            setPostalCode(next)
                            if (postalCodeError && /^\d{2}-?\d{3}$/.test(next.trim())) setPostalCodeError(false)
                          }}
                          aria-invalid={postalCodeError}
                          className={postalCodeError ? "border-destructive ring-2 ring-destructive/20" : undefined}
                          disabled={isSubmitting}
                          autoComplete="postal-code"
                          placeholder="00-000"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="city" className="text-sm text-muted-foreground">Miasto</Label>
                        <Input
                          id="city"
                          value={city}
                          onChange={(e) => {
                            const next = e.target.value
                            setCity(next)
                            if (cityError && next.trim()) setCityError(false)
                          }}
                          aria-invalid={cityError}
                          className={cityError ? "border-destructive ring-2 ring-destructive/20" : undefined}
                          disabled={isSubmitting}
                          autoComplete="address-level2"
                          placeholder="Np. Warszawa"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="deliveryNotes">Informacje do dostawy (opcjonalne)</Label>
                  <Textarea
                    id="deliveryNotes"
                    value={deliveryNotes}
                    onChange={(e) => {
                      const next = e.target.value
                      setDeliveryNotes(next)
                    }}
                    placeholder="Np. domofon, piętro, instrukcje dla kuriera"
                    className="min-h-20"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Numer telefonu</Label>
                  <Input
                    id="phone"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => {
                      const next = e.target.value
                      setPhone(next)
                      if (phoneError && normalizeDigits(next).length >= 9) setPhoneError(false)
                    }}
                    placeholder="Np. +48 600 700 800"
                    aria-invalid={phoneError}
                    className={phoneError ? "border-destructive ring-2 ring-destructive/20" : undefined}
                    disabled={isSubmitting}
                    autoComplete="tel"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="weight">Waga (opcjonalnie)</Label>
                    <Input
                      id="weight"
                      inputMode="decimal"
                      value={weightKg}
                      onChange={(e) => {
                        const next = e.target.value
                        setWeightKg(next)
                        if (weightError && (next.trim() === "" || Number(next) > 0)) setWeightError(false)
                      }}
                      placeholder="kg"
                      aria-invalid={weightError}
                      className={weightError ? "border-destructive ring-2 ring-destructive/20" : undefined}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="height">Wzrost (opcjonalnie)</Label>
                    <Input
                      id="height"
                      inputMode="decimal"
                      value={heightCm}
                      onChange={(e) => {
                        const next = e.target.value
                        setHeightCm(next)
                        if (heightError && (next.trim() === "" || Number(next) > 0)) setHeightError(false)
                      }}
                      placeholder="cm"
                      aria-invalid={heightError}
                      className={heightError ? "border-destructive ring-2 ring-destructive/20" : undefined}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="about">Coś o sobie (opcjonalnie)</Label>
                  <Textarea
                    id="about"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Np. cele, ograniczenia, alergie"
                    className="min-h-24"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
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
                      className={
                        acceptedTermsError
                          ? "size-5 border-2 border-destructive ring-2 ring-destructive/20"
                          : "size-5 border-2 border-foreground/40"
                      }
                    />
                    <div className="grid gap-1">
                      <Label htmlFor="acceptedTerms" className="leading-snug">
                        Akceptuję regulamin FitMeal (wymagane)
                      </Label>
                      <div className="text-xs text-muted-foreground">
                        <LegalDialogs className="inline" showPrivacy={false} showTerms={true} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="newsletterOptIn"
                      checked={newsletterOptIn}
                      onCheckedChange={(checked) => setNewsletterOptIn(checked === true)}
                      disabled={isSubmitting}
                      className="size-5 border-2 border-foreground/40"
                    />
                    <div className="grid gap-1">
                      <Label htmlFor="newsletterOptIn" className="leading-snug">
                        Chcę otrzymywać newsletter FitMeal (opcjonalne)
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Button type="submit" disabled={isSubmitting} className="gap-2">
                    <Save className="h-4 w-4" />
                    {isSubmitting ? "Zapisywanie…" : "Zapisz i przejdź dalej"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
