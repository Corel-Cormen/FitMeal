"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  User,
  Settings,
  CreditCard,
  MapPin,
  Lock,
  Camera,
  Save,
  Trash2,
  LogOut,
  Phone,
  Mail,
  Calendar,
  Shield,
  Bell,
  Moon,
  Sun,
  Globe
} from "lucide-react"
import { toastError, toastSuccess } from "@/lib/sonner-toast"

interface UserSettingsProps {
  trigger?: React.ReactNode
}

export type UserSettingsTab = "profile" | "delivery" | "preferences"

const PROFILE_DETAILS_KEY = "fitmeal_profileDetails"
const MAX_AVATAR_BYTES = 2 * 1024 * 1024

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "")
}

function isEmailValid(value: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

function normalizePostalCode(value: string) {
  const trimmed = value.trim().replace(/\s/g, "")
  if (/^\d{5}$/.test(trimmed)) return `${trimmed.slice(0, 2)}-${trimmed.slice(2)}`
  return trimmed
}

function splitStreetAndHouse(streetLine: string): { street: string; houseNumber?: string } {
  const trimmed = streetLine.trim()
  if (!trimmed) return { street: "" }

  // Attempts: "Marszałkowska 10", "Sportowa 15/3", "Jana Pawła II 10A"
  const match = trimmed.match(/^(.*?)(?:\s+(\d+[0-9A-Za-z]*(?:\/\d+[0-9A-Za-z]*)?))$/)
  if (!match) return { street: trimmed }
  return { street: match[1]!.trim(), houseNumber: match[2]!.trim() }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("read_error"))
    reader.onload = () => {
      const result = reader.result
      if (typeof result === "string") resolve(result)
      else reject(new Error("read_error"))
    }
    reader.readAsDataURL(file)
  })
}

type PaymentBrand = "VISA" | "MASTERCARD"

type PaymentMethod = {
  id: string
  brand: PaymentBrand
  last4: string
  expires: string
}

function createClientId(prefix: string) {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return `${prefix}-${(crypto as Crypto).randomUUID()}`
    }
  } catch {
    // ignore
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function isLast4Valid(value: string) {
  return /^\d{4}$/.test(value.trim())
}

function isExpiryValid(value: string) {
  // MM/YY
  return /^(0[1-9]|1[0-2])\/(\d{2})$/.test(value.trim())
}

export function UserSettingsForm({
  defaultTab = "profile",
  formId = "user-settings-form",
}: {
  defaultTab?: UserSettingsTab
  formId?: string
}) {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [themeMounted, setThemeMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false)

  const [profileErrors, setProfileErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
  })

  const [addressErrors, setAddressErrors] = useState({
    street: false,
    city: false,
    postalCode: false,
  })

  const [profile, setProfile] = useState({
    firstName: "Anna",
    lastName: "Kowalska",
    email: "anna@example.com",
    phone: "+48 123 456 789",
    birthDate: "1995-06-15",
    bio: "Aktywna sportowczynka, pasjonatka zdrowego odżywiania i crossfitu."
  })

  const [address, setAddress] = useState({
    street: "ul. Sportowa 15/3",
    city: "Warszawa",
    postalCode: "00-001",
    deliveryInstructions: "Zostawić przy drzwiach, zadzwonić domofonem."
  })

  const [preferences, setPreferences] = useState({
    darkMode: false,
    language: "pl",
    deliveryTime: "morning",
    weekendDelivery: true,
    smsNotifications: true,
    emailNotifications: false
  })

  const [notificationSettings, setNotificationSettings] = useState([
    { id: "push", label: "Powiadomienia push", description: "Otrzymuj powiadomienia na urządzenie", enabled: true },
    { id: "email", label: "Powiadomienia e-mail", description: "Otrzymuj podsumowania na e-mail", enabled: preferences.emailNotifications },
    { id: "sms", label: "Powiadomienia SMS", description: "Ważne informacje przez SMS", enabled: preferences.smsNotifications },
    { id: "delivery", label: "Status dostawy", description: "Aktualizacje o statusie dostaw", enabled: true },
    { id: "preparation", label: "Przygotowanie posiłków", description: "Informacje o przygotowaniu", enabled: true },
    { id: "promo", label: "Promocje i oferty", description: "Informacje o zniżkach i promocjach", enabled: false },
    { id: "tips", label: "Porady dietetyczne", description: "Wskazówki od naszych ekspertów", enabled: true },
  ])

  const [security, setSecurity] = useState({
    twoFactorEnabled: false
  })

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "pm-visa-4242", brand: "VISA", last4: "4242", expires: "12/26" },
  ])

  const [addPaymentOpen, setAddPaymentOpen] = useState(false)
  const [addPaymentAttempted, setAddPaymentAttempted] = useState(false)
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [paymentBrand, setPaymentBrand] = useState<PaymentBrand>("VISA")
  const [paymentLast4, setPaymentLast4] = useState("")
  const [paymentExpires, setPaymentExpires] = useState("")
  const [paymentErrors, setPaymentErrors] = useState({
    last4: false,
    expires: false,
  })

  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [changePasswordAttempted, setChangePasswordAttempted] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [changePasswordErrors, setChangePasswordErrors] = useState({
    current: false,
    next: false,
    confirm: false,
  })

  useEffect(() => {
    setThemeMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const raw = localStorage.getItem(PROFILE_DETAILS_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw)
      const methods = parsed?.paymentMethods
      if (Array.isArray(methods)) {
        const normalized: PaymentMethod[] = methods
          .map((m: any) => {
            if (!m || typeof m !== "object") return null
            const brand = m.brand === "MASTERCARD" ? "MASTERCARD" : "VISA"
            const last4 = typeof m.last4 === "string" ? m.last4.trim() : ""
            const expires = typeof m.expires === "string" ? m.expires.trim() : ""
            if (!isLast4Valid(last4) || !isExpiryValid(expires)) return null
            return {
              id: typeof m.id === "string" && m.id ? m.id : createClientId("pm"),
              brand,
              last4,
              expires,
            } satisfies PaymentMethod
          })
          .filter(Boolean) as PaymentMethod[]

        if (normalized.length > 0) setPaymentMethods(normalized)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (!themeMounted) return
    if (resolvedTheme !== "light" && resolvedTheme !== "dark") return

    const isDark = resolvedTheme === "dark"
    setPreferences(prev => (prev.darkMode === isDark ? prev : { ...prev, darkMode: isDark }))
  }, [resolvedTheme, themeMounted])

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }))
  }

  const toggleNotificationSetting = (id: string) => {
    setNotificationSettings(prev =>
      prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    )
  }

  function validate() {
    const nextFirstNameError = !profile.firstName.trim()
    const nextLastNameError = !profile.lastName.trim()

    const nextEmailError = !profile.email.trim() || !isEmailValid(profile.email.trim())

    const phoneDigits = normalizeDigits(profile.phone)
    const nextPhoneError = !profile.phone.trim() || phoneDigits.length < 9 || phoneDigits.length > 15

    const nextStreetError = !address.street.trim()
    const nextCityError = !address.city.trim()
    const postal = normalizePostalCode(address.postalCode)
    const nextPostalCodeError = !postal || !/^\d{2}-?\d{3}$/.test(postal)

    setProfileErrors({
      firstName: nextFirstNameError,
      lastName: nextLastNameError,
      email: nextEmailError,
      phone: nextPhoneError,
    })

    setAddressErrors({
      street: nextStreetError,
      city: nextCityError,
      postalCode: nextPostalCodeError,
    })

    if (nextFirstNameError) {
      toastError("Proszę wpisać imię.")
      return false
    }

    if (nextLastNameError) {
      toastError("Proszę wpisać nazwisko.")
      return false
    }

    if (!profile.email.trim()) {
      toastError("Proszę wpisać email.")
      return false
    }

    if (nextEmailError) {
      toastError("Email nie jest w prawidłowym formacie.")
      return false
    }

    if (!profile.phone.trim()) {
      toastError("Proszę wpisać numer telefonu.")
      return false
    }

    if (nextPhoneError) {
      toastError("Numer telefonu jest w nieprawidłowym formacie.")
      return false
    }

    if (nextStreetError) {
      toastError("Proszę wpisać adres (ulica i numer).")
      return false
    }

    if (nextCityError) {
      toastError("Proszę wpisać miasto.")
      return false
    }

    if (!address.postalCode.trim()) {
      toastError("Proszę wpisać kod pocztowy.")
      return false
    }

    if (nextPostalCodeError) {
      toastError("Kod pocztowy jest w nieprawidłowym formacie (np. 00-000).")
      return false
    }

    return true
  }

  function saveToLocalStorage() {
    if (typeof window === "undefined") return

    const existingRaw = localStorage.getItem(PROFILE_DETAILS_KEY)
    let existing: any = undefined
    if (existingRaw) {
      try {
        existing = JSON.parse(existingRaw)
      } catch {
        existing = undefined
      }
    }

    const postalCode = normalizePostalCode(address.postalCode)
    const { street: streetOnly, houseNumber } = splitStreetAndHouse(address.street)

    const next = {
      ...(existing ?? {}),
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      phone: profile.phone.trim(),
      email: profile.email.trim(),
      paymentMethods,
      address: {
        ...(existing?.address ?? {}),
        street: streetOnly || address.street.trim(),
        houseNumber: houseNumber ?? (existing?.address?.houseNumber ?? ""),
        postalCode,
        city: address.city.trim(),
      },
      ui: {
        ...(existing?.ui ?? {}),
        theme: preferences.darkMode ? "dark" : "light",
        language: preferences.language,
      },
      notifications: {
        settings: notificationSettings,
      },
    }

    localStorage.setItem(PROFILE_DETAILS_KEY, JSON.stringify(next))
  }

  function resetAddPaymentState() {
    setAddPaymentAttempted(false)
    setIsAddingPayment(false)
    setPaymentBrand("VISA")
    setPaymentLast4("")
    setPaymentExpires("")
    setPaymentErrors({ last4: false, expires: false })
  }

  function addPaymentMethod() {
    if (isAddingPayment) return
    setAddPaymentAttempted(true)

    const nextLast4Error = !isLast4Valid(paymentLast4)
    const nextExpiresError = !isExpiryValid(paymentExpires)

    setPaymentErrors({
      last4: nextLast4Error,
      expires: nextExpiresError,
    })

    if (nextLast4Error) {
      toastError("Podaj 4 ostatnie cyfry karty.")
      return
    }

    if (nextExpiresError) {
      toastError("Podaj datę ważności w formacie MM/YY (np. 12/26).")
      return
    }

    setIsAddingPayment(true)
    const nextMethod: PaymentMethod = {
      id: createClientId("pm"),
      brand: paymentBrand,
      last4: paymentLast4.trim(),
      expires: paymentExpires.trim(),
    }

    setPaymentMethods(prev => [...prev, nextMethod])
    setTimeout(() => {
      setIsAddingPayment(false)
      setAddPaymentOpen(false)
      resetAddPaymentState()
      toastSuccess("Dodano metodę płatności.")
    }, 250)
  }

  function removePaymentMethod(id: string) {
    setPaymentMethods(prev => prev.filter(m => m.id !== id))
    toastSuccess("Usunięto metodę płatności.")
  }

  async function handleAvatarFileSelected(file: File) {
    if (!file.type.startsWith("image/")) {
      toastError("Wybierz plik graficzny (JPG/PNG/WebP itp.).")
      return
    }

    if (file.size > MAX_AVATAR_BYTES) {
      toastError("Zdjęcie jest za duże. Maksymalny rozmiar to 2 MB.")
      return
    }

    setIsUpdatingAvatar(true)
    try {
      const dataUrl = await readFileAsDataUrl(file)
      setAvatarUrl(dataUrl)

      toastSuccess("Zdjęcie profilu zostało zaktualizowane.")
    } catch {
      toastError("Nie udało się wczytać zdjęcia. Spróbuj ponownie.")
    } finally {
      setIsUpdatingAvatar(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isSaving) return
    if (!validate()) return

    setIsSaving(true)
    saveToLocalStorage()
    toastSuccess("Ustawienia zostały zapisane.")
    setIsSaving(false)
  }

  function resetChangePasswordState() {
    setChangePasswordAttempted(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setChangePasswordErrors({ current: false, next: false, confirm: false })
    setIsChangingPassword(false)
  }

  function validateAndSubmitPasswordChange() {
    if (isChangingPassword) return

    setChangePasswordAttempted(true)

    const nextCurrentError = !currentPassword.trim()
    const nextNewError = !newPassword.trim() || newPassword.trim().length < 8
    const nextConfirmError = !confirmPassword.trim() || confirmPassword !== newPassword

    setChangePasswordErrors({
      current: nextCurrentError,
      next: nextNewError,
      confirm: nextConfirmError,
    })

    if (nextCurrentError) {
      toastError("Wpisz aktualne hasło.")
      return
    }

    if (!newPassword.trim()) {
      toastError("Wpisz nowe hasło.")
      return
    }

    if (nextNewError) {
      toastError("Nowe hasło musi mieć co najmniej 8 znaków.")
      return
    }

    if (!confirmPassword.trim()) {
      toastError("Powtórz nowe hasło.")
      return
    }

    if (nextConfirmError) {
      toastError("Nowe hasła nie są takie same.")
      return
    }

    setIsChangingPassword(true)
    setTimeout(() => {
      setIsChangingPassword(false)
      setChangePasswordOpen(false)
      resetChangePasswordState()
      toastSuccess("Hasło zostało zmienione. Wysłaliśmy powiadomienie e-mail.")
    }, 600)
  }

  return (
    <form id={formId} onSubmit={handleSubmit} noValidate>
      <Tabs defaultValue={defaultTab} className="mt-6">
        <TabsList className="w-full">
          <TabsTrigger value="profile" className="flex-1">
            <User className="mr-2 h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex-1">
            <MapPin className="mr-2 h-4 w-4" />
            Dostawa
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex-1">
            <Settings className="mr-2 h-4 w-4" />
            Opcje
          </TabsTrigger>
        </TabsList>

      {/* Profile Tab */}
      <TabsContent value="profile" className="mt-4 space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl ?? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop"} />
              <AvatarFallback className="text-2xl">
                {(profile.firstName?.[0] ?? "").toUpperCase()}{(profile.lastName?.[0] ?? "").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              type="button"
              size="icon"
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
              aria-label="Zmień zdjęcie profilu"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUpdatingAvatar}
            >
              <Camera className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                e.target.value = ""
                if (!file) return
                void handleAvatarFileSelected(file)
              }}
            />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-foreground">{profile.firstName} {profile.lastName}</h3>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <Badge variant="secondary" className="mt-2">
              Plan Pro
            </Badge>
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Imię</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => {
                  const next = e.target.value
                  handleProfileChange("firstName", next)
                  if (profileErrors.firstName && next.trim()) {
                    setProfileErrors(prev => ({ ...prev, firstName: false }))
                  }
                }}
                aria-invalid={profileErrors.firstName}
                className={profileErrors.firstName ? "border-destructive ring-2 ring-destructive/20" : undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nazwisko</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => {
                  const next = e.target.value
                  handleProfileChange("lastName", next)
                  if (profileErrors.lastName && next.trim()) {
                    setProfileErrors(prev => ({ ...prev, lastName: false }))
                  }
                }}
                aria-invalid={profileErrors.lastName}
                className={profileErrors.lastName ? "border-destructive ring-2 ring-destructive/20" : undefined}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => {
                const next = e.target.value
                handleProfileChange("email", next)
                if (profileErrors.email && isEmailValid(next.trim())) {
                  setProfileErrors(prev => ({ ...prev, email: false }))
                }
              }}
              aria-invalid={profileErrors.email}
              className={profileErrors.email ? "border-destructive ring-2 ring-destructive/20" : undefined}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Telefon
            </Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => {
                const next = e.target.value
                handleProfileChange("phone", next)
                const digits = normalizeDigits(next)
                if (profileErrors.phone && digits.length >= 9 && digits.length <= 15) {
                  setProfileErrors(prev => ({ ...prev, phone: false }))
                }
              }}
              aria-invalid={profileErrors.phone}
              className={profileErrors.phone ? "border-destructive ring-2 ring-destructive/20" : undefined}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Data urodzenia
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={profile.birthDate}
              onChange={(e) => handleProfileChange("birthDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">O mnie</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => handleProfileChange("bio", e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Security Section */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Bezpieczeństwo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weryfikacja dwuetapowa</Label>
                <p className="text-xs text-muted-foreground">
                  Dodatkowa ochrona Twojego konta
                </p>
              </div>
              <Switch
                checked={security.twoFactorEnabled}
                onCheckedChange={(checked) =>
                  setSecurity(prev => ({ ...prev, twoFactorEnabled: checked }))
                }
              />
            </div>
              <Dialog
                open={changePasswordOpen}
                onOpenChange={(open) => {
                  setChangePasswordOpen(open)
                  if (!open) resetChangePasswordState()
                }}
              >
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" className="w-full">
                    <Lock className="mr-2 h-4 w-4" />
                    Zmień hasło
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Zmień hasło</DialogTitle>
                    <DialogDescription>
                      Po zmianie wyślemy powiadomienie na Twój adres e-mail.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Aktualne hasło</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => {
                          const next = e.target.value
                          setCurrentPassword(next)
                          if (changePasswordAttempted && changePasswordErrors.current && next.trim()) {
                            setChangePasswordErrors(prev => ({ ...prev, current: false }))
                          }
                        }}
                        aria-invalid={changePasswordAttempted && changePasswordErrors.current}
                        className={
                          changePasswordAttempted && changePasswordErrors.current
                            ? "border-destructive ring-2 ring-destructive/20"
                            : undefined
                        }
                        autoComplete="current-password"
                        disabled={isChangingPassword}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nowe hasło</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => {
                          const next = e.target.value
                          setNewPassword(next)
                          if (changePasswordAttempted && changePasswordErrors.next && next.trim().length >= 8) {
                            setChangePasswordErrors(prev => ({ ...prev, next: false }))
                          }
                        }}
                        aria-invalid={changePasswordAttempted && changePasswordErrors.next}
                        className={
                          changePasswordAttempted && changePasswordErrors.next
                            ? "border-destructive ring-2 ring-destructive/20"
                            : undefined
                        }
                        autoComplete="new-password"
                        disabled={isChangingPassword}
                      />
                      <p className="text-xs text-muted-foreground">Minimum 8 znaków.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Powtórz nowe hasło</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          const next = e.target.value
                          setConfirmPassword(next)
                          if (changePasswordAttempted && changePasswordErrors.confirm && next === newPassword) {
                            setChangePasswordErrors(prev => ({ ...prev, confirm: false }))
                          }
                        }}
                        aria-invalid={changePasswordAttempted && changePasswordErrors.confirm}
                        className={
                          changePasswordAttempted && changePasswordErrors.confirm
                            ? "border-destructive ring-2 ring-destructive/20"
                            : undefined
                        }
                        autoComplete="new-password"
                        disabled={isChangingPassword}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setChangePasswordOpen(false)}
                      disabled={isChangingPassword}
                    >
                      Anuluj
                    </Button>
                    <Button
                      type="button"
                      onClick={validateAndSubmitPasswordChange}
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? "Zapisywanie…" : "Zapisz nowe hasło"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Delivery Tab */}
      <TabsContent value="delivery" className="mt-4 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Ulica i numer</Label>
            <Input
              id="street"
              value={address.street}
              onChange={(e) => {
                const next = e.target.value
                handleAddressChange("street", next)
                if (addressErrors.street && next.trim()) {
                  setAddressErrors(prev => ({ ...prev, street: false }))
                }
              }}
              placeholder="np. ul. Sportowa 15/3"
              aria-invalid={addressErrors.street}
              className={addressErrors.street ? "border-destructive ring-2 ring-destructive/20" : undefined}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">Miasto</Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) => {
                  const next = e.target.value
                  handleAddressChange("city", next)
                  if (addressErrors.city && next.trim()) {
                    setAddressErrors(prev => ({ ...prev, city: false }))
                  }
                }}
                aria-invalid={addressErrors.city}
                className={addressErrors.city ? "border-destructive ring-2 ring-destructive/20" : undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Kod pocztowy</Label>
              <Input
                id="postalCode"
                value={address.postalCode}
                onChange={(e) => {
                  const next = e.target.value
                  handleAddressChange("postalCode", next)
                  if (addressErrors.postalCode && /^\d{2}-?\d{3}$/.test(normalizePostalCode(next))) {
                    setAddressErrors(prev => ({ ...prev, postalCode: false }))
                  }
                }}
                placeholder="00-000"
                aria-invalid={addressErrors.postalCode}
                className={addressErrors.postalCode ? "border-destructive ring-2 ring-destructive/20" : undefined}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryInstructions">Instrukcje dla kuriera</Label>
            <Textarea
              id="deliveryInstructions"
              value={address.deliveryInstructions}
              onChange={(e) => handleAddressChange("deliveryInstructions", e.target.value)}
              placeholder="np. Zostawić przy drzwiach, zadzwonić domofonem"
              rows={3}
            />
          </div>
        </div>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Preferowany czas dostawy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={preferences.deliveryTime}
              onValueChange={(value) =>
                setPreferences(prev => ({ ...prev, deliveryTime: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Rano (6:00 - 8:00)</SelectItem>
                <SelectItem value="midday">Przed południem (10:00 - 12:00)</SelectItem>
                <SelectItem value="afternoon">Po południu (14:00 - 16:00)</SelectItem>
                <SelectItem value="evening">Wieczorem (18:00 - 20:00)</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dostawy w weekendy</Label>
                <p className="text-xs text-muted-foreground">
                  Otrzymuj posiłki w soboty i niedziele
                </p>
              </div>
              <Switch
                checked={preferences.weekendDelivery}
                onCheckedChange={(checked) =>
                  setPreferences(prev => ({ ...prev, weekendDelivery: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4" />
              Metody płatności
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentMethods.length > 0 ? (
              paymentMethods.map((method, index) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-14 items-center justify-center rounded-md bg-blue-500 text-xs font-bold text-white">
                      {method.brand}
                    </div>
                    <div>
                      <p className="text-sm font-medium">**** **** **** {method.last4}</p>
                      <p className="text-xs text-muted-foreground">Wygasa {method.expires}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {index === 0 && <Badge>Domyślna</Badge>}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-destructive"
                      aria-label="Usuń metodę płatności"
                      onClick={() => removePaymentMethod(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Brak zapisanych metod płatności.</p>
            )}

            <Dialog
              open={addPaymentOpen}
              onOpenChange={(open) => {
                setAddPaymentOpen(open)
                if (!open) resetAddPaymentState()
              }}
            >
              <DialogTrigger asChild>
                <Button type="button" variant="outline" className="w-full">
                  Dodaj metodę płatności
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dodaj metodę płatności</DialogTitle>
                  <DialogDescription>
                    Dla bezpieczeństwa zapisujemy tylko podstawowe dane (bez pełnego numeru karty).
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-brand">Typ karty</Label>
                    <Select
                      value={paymentBrand}
                      onValueChange={(value) => setPaymentBrand(value as PaymentBrand)}
                    >
                      <SelectTrigger id="payment-brand">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VISA">VISA</SelectItem>
                        <SelectItem value="MASTERCARD">MASTERCARD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-last4">Ostatnie 4 cyfry</Label>
                    <Input
                      id="payment-last4"
                      inputMode="numeric"
                      placeholder="np. 4242"
                      value={paymentLast4}
                      onChange={(e) => {
                        const next = e.target.value.replace(/\D/g, "").slice(0, 4)
                        setPaymentLast4(next)
                        if (addPaymentAttempted && paymentErrors.last4 && isLast4Valid(next)) {
                          setPaymentErrors(prev => ({ ...prev, last4: false }))
                        }
                      }}
                      aria-invalid={addPaymentAttempted && paymentErrors.last4}
                      className={
                        addPaymentAttempted && paymentErrors.last4
                          ? "border-destructive ring-2 ring-destructive/20"
                          : undefined
                      }
                      disabled={isAddingPayment}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-expires">Ważna do (MM/YY)</Label>
                    <Input
                      id="payment-expires"
                      placeholder="np. 12/26"
                      value={paymentExpires}
                      onChange={(e) => {
                        const next = e.target.value
                          .replace(/\s/g, "")
                          .replace(/[^\d/]/g, "")
                          .slice(0, 5)
                        setPaymentExpires(next)
                        if (addPaymentAttempted && paymentErrors.expires && isExpiryValid(next)) {
                          setPaymentErrors(prev => ({ ...prev, expires: false }))
                        }
                      }}
                      aria-invalid={addPaymentAttempted && paymentErrors.expires}
                      className={
                        addPaymentAttempted && paymentErrors.expires
                          ? "border-destructive ring-2 ring-destructive/20"
                          : undefined
                      }
                      disabled={isAddingPayment}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddPaymentOpen(false)}
                    disabled={isAddingPayment}
                  >
                    Anuluj
                  </Button>
                  <Button type="button" onClick={addPaymentMethod} disabled={isAddingPayment}>
                    {isAddingPayment ? "Dodawanie…" : "Dodaj"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Preferences Tab */}
      <TabsContent value="preferences" className="mt-4 space-y-6">
        {/* App Preferences */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Wygląd aplikacji</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label htmlFor="pref-dark-mode">Tryb ciemny</Label>
                  <p className="text-xs text-muted-foreground">
                    Zmień wygląd aplikacji
                  </p>
                </div>
              </div>
              <Switch
                id="pref-dark-mode"
                checked={preferences.darkMode}
                onCheckedChange={(checked) => {
                  setPreferences(prev => ({ ...prev, darkMode: checked }))
                  if (!themeMounted) return
                  setTheme(checked ? "dark" : "light")
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label>Język</Label>
                  <p className="text-xs text-muted-foreground">
                    Wybierz język interfejsu
                  </p>
                </div>
              </div>
              <Select
                value={preferences.language}
                onValueChange={(value) =>
                  setPreferences(prev => ({ ...prev, language: value }))
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pl">Polski</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" />
              Powiadomienia
            </CardTitle>
            <CardDescription>
              Wybierz, jakie informacje chcesz otrzymywać.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationSettings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between rounded-xl border border-border/50 p-4"
              >
                <div className="space-y-0.5">
                  <Label htmlFor={`notif-${setting.id}`} className="text-sm font-medium">
                    {setting.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
                <Switch
                  id={`notif-${setting.id}`}
                  checked={setting.enabled}
                  onCheckedChange={() => toggleNotificationSetting(setting.id)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-destructive">Strefa niebezpieczna</CardTitle>
            <CardDescription>
              Te akcje są nieodwracalne
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive/10">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Usuń konto
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Czy na pewno chcesz usunąć konto?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ta akcja jest nieodwracalna. Wszystkie Twoje dane, historia zamówień i preferencje zostaną trwale usunięte.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anuluj</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => router.push("/")}
                  >
                    Usuń konto
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </TabsContent>
      </Tabs>
    </form>
  )
}

export function UserSettings({ trigger }: UserSettingsProps) {
  const formId = "user-settings-sheet-form"

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Ustawienia
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ustawienia konta
          </SheetTitle>
          <SheetDescription>
            Zarządzaj swoim profilem i preferencjami
          </SheetDescription>
        </SheetHeader>

        <UserSettingsForm formId={formId} />

        <SheetFooter className="mt-6">
          <Button className="w-full" type="submit" form={formId}>
            <Save className="mr-2 h-4 w-4" />
            Zapisz zmiany
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
