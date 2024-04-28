import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { Footer } from '@/components/Footer'
import { Suspense } from 'react'
import { 
  Search
} from '@/components/Search'
import LoadingContextProvider, { useLoadingContext } from '@/app/contexts/loadingContext'
import SupabaseContextProvider from '@/app/contexts/supabaseContext'
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from "@/components/ui/mode-toggle"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Motorcycle Finder, California: New and Used Dealership motorcycles for sale in California.",
  description: "Find your next motorcycle, with the most comprehensive database of new and used dealership motorcycle listings available.",
};

export default function RootLayout({
  children, 
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col justify-between min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense>
            <div className="absolute top-0 right-0 m-4">
              <ModeToggle />
            </div>
            <LoadingContextProvider>
              <SupabaseContextProvider>
                  <Search />
                  <main>
                  {children}
                  </main>
                  <Analytics />  
              </SupabaseContextProvider>
            </LoadingContextProvider>
            <footer className='flex flex-col justify-center items-center w-full mt-12  py-4 bg-slate-200 shadow dark:bg-slate-950 dark:text-slate-50 text-center rounded-t-2xl'>
              <Footer />
            </footer>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
