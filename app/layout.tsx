import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Motorcycle Finder",
  description: "Fearch your next motorcycle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
