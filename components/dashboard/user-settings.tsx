"use client"

import { useState } from "react"
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

interface UserSettingsProps {
  trigger?: React.ReactNode
}

export function UserSettings({ trigger }: UserSettingsProps) {
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
    emailNotifications: true
  })

  const [security, setSecurity] = useState({
    twoFactorEnabled: false
  })

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }))
  }

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

        <Tabs defaultValue="profile" className="mt-6">
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
                  <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop" />
                  <AvatarFallback className="text-2xl">AK</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
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
                    onChange={(e) => handleProfileChange("firstName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nazwisko</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => handleProfileChange("lastName", e.target.value)}
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
                  onChange={(e) => handleProfileChange("email", e.target.value)}
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
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
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
                <Button variant="outline" className="w-full">
                  <Lock className="mr-2 h-4 w-4" />
                  Zmień hasło
                </Button>
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
                  onChange={(e) => handleAddressChange("street", e.target.value)}
                  placeholder="np. ul. Sportowa 15/3"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">Miasto</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Kod pocztowy</Label>
                  <Input
                    id="postalCode"
                    value={address.postalCode}
                    onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                    placeholder="00-000"
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
                <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-14 items-center justify-center rounded-md bg-blue-500 text-xs font-bold text-white">
                      VISA
                    </div>
                    <div>
                      <p className="text-sm font-medium">**** **** **** 4242</p>
                      <p className="text-xs text-muted-foreground">Wygasa 12/26</p>
                    </div>
                  </div>
                  <Badge>Domyślna</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  Dodaj metodę płatności
                </Button>
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
                      <Label>Tryb ciemny</Label>
                      <p className="text-xs text-muted-foreground">
                        Zmień wygląd aplikacji
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.darkMode}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({ ...prev, darkMode: checked }))
                    }
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
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Powiadomienia SMS</Label>
                    <p className="text-xs text-muted-foreground">
                      Ważne informacje przez SMS
                    </p>
                  </div>
                  <Switch
                    checked={preferences.smsNotifications}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({ ...prev, smsNotifications: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Powiadomienia e-mail</Label>
                    <p className="text-xs text-muted-foreground">
                      Podsumowania i promocje
                    </p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>
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
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Usuń konto
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <SheetFooter className="mt-6">
          <Button className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Zapisz zmiany
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
