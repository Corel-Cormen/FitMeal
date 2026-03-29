"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

type LegalDialogsProps = {
  className?: string
  showPrivacy?: boolean
  showTerms?: boolean
}

export function LegalDialogs({ className, showPrivacy = true, showTerms = true }: LegalDialogsProps) {
  return (
    <div className={className}>
      {showPrivacy && (
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Polityka prywatności
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[calc(100vh-2rem)] overflow-hidden grid-rows-[auto_1fr]">
            <DialogHeader>
              <DialogTitle>Polityka prywatności</DialogTitle>
              <DialogDescription>
                Informacje o przetwarzaniu danych osobowych w serwisie FitMeal.
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-full pr-4">
              <div className="space-y-6 text-sm text-muted-foreground">
                <section className="space-y-2">
                  <p className="text-foreground font-medium">1. Administrator danych</p>
                  <p>
                    Administratorem danych jest FitMeal. W sprawach związanych z prywatnością skontaktuj się z nami pod adresem:
                    <span className="text-foreground"> pomoc@fitmeal.pl</span>.
                  </p>
                </section>

                <section className="space-y-2">
                  <p className="text-foreground font-medium">2. Zakres danych</p>
                  <p>
                    Możemy przetwarzać dane podane przez Ciebie w formularzach (np. imię, adres e-mail, treść wiadomości),
                    dane potrzebne do realizacji zamówień oraz dane techniczne (np. identyfikatory urządzenia/przeglądarki).
                  </p>
                </section>

                <section className="space-y-2">
                  <p className="text-foreground font-medium">3. Cele i podstawy przetwarzania</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>obsługa zapytań i kontaktu — na podstawie Twojej zgody lub w celu podjęcia działań na Twoje żądanie,</li>
                    <li>realizacja zamówień i rozliczeń — w celu wykonania umowy,</li>
                    <li>bezpieczeństwo i zapobieganie nadużyciom — w ramach naszego prawnie uzasadnionego interesu,</li>
                    <li>marketing (jeśli wyrazisz zgodę) — w zakresie wskazanym w zgodzie.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <p className="text-foreground font-medium">4. Odbiorcy danych</p>
                  <p>
                    Dane mogą być udostępniane podmiotom wspierającym nas w działaniu serwisu (np. dostawcy hostingu, narzędzi analitycznych,
                    operatorzy płatności, firmy kurierskie) wyłącznie w zakresie niezbędnym do realizacji usług.
                  </p>
                </section>

                <section className="space-y-2">
                  <p className="text-foreground font-medium">5. Okres przechowywania</p>
                  <p>
                    Dane przechowujemy przez czas niezbędny do realizacji celów przetwarzania, w tym do czasu przedawnienia roszczeń
                    lub przez okres wymagany przepisami prawa (np. dokumenty księgowe).
                  </p>
                </section>

                <section className="space-y-2">
                  <p className="text-foreground font-medium">6. Twoje prawa</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>dostęp do danych,</li>
                    <li>sprostowanie, usunięcie, ograniczenie przetwarzania,</li>
                    <li>przenoszenie danych,</li>
                    <li>sprzeciw wobec przetwarzania (gdy podstawą jest prawnie uzasadniony interes),</li>
                    <li>cofnięcie zgody (jeśli przetwarzanie odbywa się na podstawie zgody).</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <p className="text-foreground font-medium">7. Pliki cookies</p>
                  <p>
                    Serwis może korzystać z plików cookies i podobnych technologii w celu zapewnienia działania, poprawy jakości oraz analityki.
                    Ustawienia cookies możesz zmienić w swojej przeglądarce.
                  </p>
                </section>

                <section className="space-y-2">
                  <p className="text-foreground font-medium">8. Zmiany dokumentu</p>
                  <p>
                    Możemy aktualizować politykę prywatności. Aktualna wersja jest dostępna w tym oknie.
                  </p>
                </section>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}

      {showTerms && (
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Regulamin
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[calc(100vh-2rem)] overflow-hidden grid-rows-[auto_1fr]">
            <DialogHeader>
              <DialogTitle>Regulamin</DialogTitle>
              <DialogDescription>
                Zasady korzystania z serwisu i składania zamówień FitMeal.
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-full pr-4">
              <div className="space-y-6 text-sm text-muted-foreground">
                <section className="space-y-2">
                  <p className="text-foreground font-medium">1. Postanowienia ogólne</p>
                  <p>
                    Regulamin określa zasady korzystania z serwisu FitMeal, w tym składania zamówień, płatności oraz realizacji dostaw.
                  </p>
                </section>

                <section className="space-y-2">
                  <p className="text-foreground font-medium">2. Konto i zamówienia</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Założenie konta może być wymagane do złożenia zamówienia.</li>
                    <li>Użytkownik zobowiązuje się do podania prawdziwych danych.</li>
                    <li>Szczegóły zamówienia (plan, kaloryczność, adres) wybierasz w trakcie składania zamówienia.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <p className="text-foreground font-medium">3. Płatności</p>
                  <p>
                    Dostępne metody płatności są prezentowane w serwisie. Zamówienie uznaje się za opłacone po potwierdzeniu płatności.
                  </p>
                </section>

                <section className="space-y-2">
                  <p className="text-foreground font-medium">4. Dostawa</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Dostawy realizujemy w obszarach wskazanych w serwisie.</li>
                    <li>Godziny dostaw mogą zależeć od miasta i trasy kuriera.</li>
                    <li>Upewnij się, że podany adres oraz instrukcje dostawy są poprawne.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <p className="text-foreground font-medium">5. Reklamacje i kontakt</p>
                  <p>
                    Reklamacje oraz pytania dotyczące zamówień możesz zgłaszać przez czat lub e-mail:
                    <span className="text-foreground"> pomoc@fitmeal.pl</span>.
                  </p>
                </section>

                <section className="space-y-2">
                  <p className="text-foreground font-medium">6. Zmiany i końcowe postanowienia</p>
                  <p>
                    Możemy aktualizować regulamin. Aktualna wersja jest dostępna w tym oknie.
                  </p>
                </section>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
