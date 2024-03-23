'use client'

import { FormSchemaType, Search } from '@/components/Search'
import { useState } from 'react'
import { Results, NoResults, ListingType } from '@/components/Results'
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { LoaderCircle } from 'lucide-react'
import Moto from '@/public/Moto'

export default function Home() {
  const [listings, setListings] = useState<ListingType[]>([])
  const [loadingState, setLoadingState] = useState<null | string>(null) // If results are found or not

  const searchHandler = async (values: FormSchemaType) => {
    setLoadingState('loading')
    const response = await fetch(`/api/search?` + new URLSearchParams({
      keyword: values.keyword,
      location: values.location,
      range: values.range
    }));
    
    if (response.ok) {
      const results = await response.json()
      if (results.length) setLoadingState('loaded')
      else setLoadingState('no results')

      setListings(results)
    } else {
      console.error(response.status)
      setListings([])
    }
  }

  return (
    <body>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="relative">
          <div className="absolute top-0 right-0 m-4">
            <ModeToggle />
          </div>
        </div>
        <div className={`flex justify-center items-center ${!loadingState && `translate-y-[70%]`}  transition-all duration-1000 ease-in-out`}>
          <div className="flex flex-col justify-center items-center w-full p-3 gap-10">
            <Search searchHandler={searchHandler} />
            {loadingState === 'loading' ? 
              (
                <div className="relative animate-bounce">
                  <Moto />
                  <LoaderCircle className="absolute top-[3rem] right-[5.8rem] animate-spin duration-2000" strokeWidth={3} size={65} />
                  <LoaderCircle className="absolute top-[3.4rem] left-[7.0rem] animate-spin duration-1750" strokeWidth={2.5} size={58} />
                </div>
              ) :
              (
                loadingState === 'no results' ? 
                  <NoResults /> :
                  <Results listings={listings} />
              )
            }
            

            
            
              
          </div>
        </div>
      </ThemeProvider>
    </body>
  );
}


