'use client'

import { FormSchemaType, Search } from '@/components/Search'
import { useState } from 'react'
import { Results, NoResults } from '@/components/Results'
import { LocationMiss } from '@/components/LocationMiss'
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { LoaderCircle } from 'lucide-react'
import type { Database } from '@/lib/database.types';
import Moto from '@/public/Moto'

type ListingsRow = Database['public']['Functions']['keyword_proximity_search']['Returns'];

export default function Home() {
  
  const [listings, setListings] = useState<ListingsRow[]>([])
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
      if (response.status === 404) setLoadingState('location not found')
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
        <div className={`flex justify-center items-center`}>
          <div className="flex flex-col justify-center items-center w-full p-3 gap-10">
              <div className={`${!loadingState && 'translate-y-[70%]'} relative transition-all duration-700 ease-in-out flex flex-col justify-center items-center gap-10`}>
                
                <div className='relative'>
                <Search searchHandler={searchHandler} />
                <div className={`absolute left-1/2 transform -translate-x-1/2 pointer-events-none ${loadingState === 'loading' ? 'opacity-1':  'opacity-0'}`}>
                  <div className='relative mt-10 min-w-56 animate-bounce'>
                  <Moto />
                  <LoaderCircle className="absolute top-[3rem] right-[8.3rem] animate-spin duration-2000" strokeWidth={2.5} size={65} />
                  <LoaderCircle className="absolute top-[3.4rem] left-[9.4rem] animate-spin duration-1750" strokeWidth={2} size={58} />
                  </div>
                </div>
                </div>
              </div>
              {loadingState === 'loaded' && <Results listings={listings} />}
              {loadingState === 'no results' && <NoResults />}
              {loadingState === 'location not found' && <LocationMiss />}
          </div>
        </div>
      </ThemeProvider>
    </body>
  );
}


