"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/fitmeal-logo.jpg"
            alt="FitMeal Logo"
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg object-cover"
          />
          <span className="text-xl font-bold text-foreground">FitMeal</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#oferta" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Oferta
          </Link>
          <Link href="#menu" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Menu
          </Link>
          <Link href="#cennik" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Cennik
          </Link>
          <Link href="#sprawdz-dostepnosc" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Zasięg dostaw
          </Link>
          <Link href="#faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Pomoc
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/login">Zaloguj się</Link>
          </Button>
          <Button asChild>
            <Link href="/login?mode=register">Rozpocznij</Link>
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
            <Link href="#oferta" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              Oferta
            </Link>
            <Link href="#menu" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              Menu
            </Link>
            <Link href="#cennik" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              Cennik
            </Link>
            <Link href="#sprawdz-dostepnosc" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              Zasięg dostaw
            </Link>
            <Link href="#faq" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              Pomoc
            </Link>
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="outline" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/login">Zaloguj się</Link>
              </Button>
              <Button asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/login?mode=register">Rozpocznij</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
