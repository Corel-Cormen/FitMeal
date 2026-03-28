import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { MenuSection } from "@/components/menu-section"
import { PricingSection } from "@/components/pricing-section"
import { DeliveryChecker } from "@/components/delivery-checker"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { LiveChat } from "@/components/live-chat"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <MenuSection />
        <PricingSection />
        <DeliveryChecker />
        <FAQSection />
      </main>
      <Footer />
      <LiveChat />
    </div>
  )
}
