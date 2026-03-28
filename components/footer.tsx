import Link from "next/link"
import { Instagram, Facebook, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg">
                <img src="images/fitmeal-logo.jpg" />
              </div>
              <span className="text-xl font-bold text-foreground">FitMeal</span>
            </Link>
            <p className="mb-4 text-sm text-muted-foreground">
              Zdrowe posiłki dla aktywnych ludzi. Catering sportowy z dostawą pod Twoje drzwi.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/" className="text-muted-foreground transition-colors hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/" className="text-muted-foreground transition-colors hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/" className="text-muted-foreground transition-colors hover:text-primary">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Nawigacja</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#oferta" className="text-muted-foreground hover:text-primary">Oferta</Link></li>
              <li><Link href="#menu" className="text-muted-foreground hover:text-primary">Menu</Link></li>
              <li><Link href="#cennik" className="text-muted-foreground hover:text-primary">Cennik</Link></li>
              <li><Link href="#sprawdz-dostepnosc" className="text-muted-foreground hover:text-primary">Zasięg dostaw</Link></li>
              <li><Link href="/login" className="text-muted-foreground hover:text-primary">Logowanie</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Informacje</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">O nas</Link></li>
              <li><Link href="#faq" className="text-muted-foreground hover:text-primary">Pomoc</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Kontakt</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>kontakt@fitmeal.pl</li>
              <li>+48 123 456 789</li>
              <li>ul. Emilii Plater 49</li>
              <li>00-125 Warszawa</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 FitMeal. Wszystkie prawa zastrzeżone.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-primary">Polityka prywatności</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">Regulamin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
