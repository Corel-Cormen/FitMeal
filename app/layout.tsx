import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { LiveChatProvider } from '@/components/live-chat'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter'
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat'
});

export const metadata: Metadata = {
  title: 'FitMeal - Catering Sportowy',
  description: 'Zdrowe posiłki dla aktywnych. Catering sportowy z dostawą pod Twoje drzwi.',
  icons: {
    icon: [
      {
        url: '/images/fitmeal-logo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/images/fitmeal-logo.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/images/fitmeal-logo.png',
        type: 'image/png',
      },
    ],
    apple: '/images/fitmeal-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LiveChatProvider>
            {children}
            <Toaster />
          </LiveChatProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
