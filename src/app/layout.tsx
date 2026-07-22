import type { Metadata } from "next"
import { Geist, Geist_Mono, Instrument_Sans, Roboto_Slab } from "next/font/google"

import { AppProviders } from "@/components/shared/layout/app-providers"
import { cn } from "@/lib/utils"

import "./globals.css"

const robotoSlabHeading = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-heading",
})

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Components Playground",
  description: "ERP UI boilerplate",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        instrumentSans.variable,
        robotoSlabHeading.variable,
      )}
    >
      <body className="h-svh overflow-hidden">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
