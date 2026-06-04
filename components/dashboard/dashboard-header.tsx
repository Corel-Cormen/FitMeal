"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Home,
  CalendarDays,
  Salad,
  Package,
  Heart,
  HelpCircle,
  Stethoscope
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { NotificationsPanel } from "./notifications-panel"

const navItems = [
  { label: "Panel", href: "/dashboard", icon: Home },
  { label: "Plan tygodnia", href: "/dashboard#plan", icon: CalendarDays },
  { label: "Moje zamówienia", href: "/dashboard#tracking", icon: Package },
  { label: "Preferencje", href: "/dashboard#preferences", icon: Heart },
  { label: "Wybierz dietę", href: "/dashboard/start", icon: Salad },
  { label: "Dietetyk", href: "/dashboard/consultation", icon: Stethoscope },
  { label: "Pomoc", href: "/dashboard/faq", icon: HelpCircle },
]

interface DashboardHeaderProps {
  userName?: string
  userEmail?: string
  userAvatar?: string
}

export function DashboardHeader({
  userName = "Anna Kowalska",
  userEmail = "anna@example.com",
  userAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
}: DashboardHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const initials = userName.split(" ").map(n => n[0]).join("")

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-card/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/FitMeal/images/fitmeal-logo.png"
                alt="FitMeal Logo"
                width={36}
                height={36}
                className="h-9 w-9 object-cover"
              />
              <span className="text-xl font-bold text-foreground">FitMeal</span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <NotificationsPanel />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:block">{userName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings?tab=profile" className="flex w-full items-center px-2 py-1.5 text-sm">
                    <User className="mr-2 h-4 w-4" />
                    Mój profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings?tab=preferences" className="flex w-full items-center px-2 py-1.5 text-sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Ustawienia
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Wyloguj się
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>Nawigacja panelu użytkownika</SheetDescription>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-foreground transition-colors hover:bg-secondary"
                    >
                      <item.icon className="h-5 w-5 text-primary" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
