import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { SessionProvider } from "@/components/providers/SessionProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Tsena — Petites annonces Madagascar",
    template: "%s | Tsena Madagascar",
  },
  description: "Achetez et vendez près de chez vous à Madagascar — Vidio sy avy eto Madagasikara",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-fond`}>
        {/* SessionProvider rend la session accessible dans tous les composants client */}
        <SessionProvider >
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}