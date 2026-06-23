import { Geist_Mono, Noto_Sans_Hebrew } from "next/font/google"
import { Toaster } from "sonner"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { DirectionProvider } from "@/components/ui/direction"
import { CartProvider } from "@/components/cart/cart-provider"
import { cn } from "@/lib/utils"

const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ["hebrew"],
  variable: "--font-sans",
  display: "swap",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "מאפיית רונית",
  description: "הזמנת מוצרי מאפייה טריים",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, notoSansHebrew.variable)}
    >
      <body>
        <DirectionProvider direction="rtl">
          <ThemeProvider>
            <CartProvider>
              {children}
            </CartProvider>
            <Toaster dir="rtl" richColors position="top-center" />
          </ThemeProvider>
        </DirectionProvider>
      </body>
    </html>
  )
}
