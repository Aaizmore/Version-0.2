import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Lakambini XI Archives | Grade 11 Digital Heritage",
  description:
    "A professional digital archive platform for Grade 11 Lakambini students to share academic insights, cultural reflections, and scholarly discourse.",
  creator: "Grade 11 Lakambini",
  keywords: ["Lakambini", "Grade 11", "Academic Archive", "Student Publications", "Digital Heritage"],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Lakambini XI Archives",
    description: "Professional digital archive for Grade 11 academic excellence",
    type: "website",
    locale: "en_US",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-lakambini-50 via-royal-50 to-gold-50">
          <Navbar />
          <main className="relative">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
