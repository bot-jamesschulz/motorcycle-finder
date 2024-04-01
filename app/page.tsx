'use client'

import { SearchFormSchemaType, Search } from '@/components/Search'
import { useState, useRef, useCallback } from 'react'
import { Results, NoResults } from '@/components/Results'
import { LocationMiss } from '@/components/LocationMiss'
import { ThemeProvider } from '@/components/theme-provider'
import LoadingIcon from '@/components/ui/LoadingIcon'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { milesToMeters } from '@/lib/utils'
import type { Database } from '@/lib/database.types'

type ListingsRow = Database['public']['Functions']['keyword_proximity_search']['Returns']
type Query = {
  x: number
  y: number
  range: number
  keyword: string
  pageNum: number
  endOfListings: boolean
}
export type Loading = 'loading' | 'loaded' | 'no results' |'location not found' | undefined
type SearchResponsePayload = {
  data: ListingsRow[]
  query: Query
}

export default function Home() {
  
  const [listings, setListings] = useState<ListingsRow[]>([])
  const queryRef = useRef<Query>()
  const [loadingState, setLoadingState] = useState<Loading>() // If results are found or not

  // New listings for infinite scroll
  const fetchListings = useCallback(async () => {  
    if (!queryRef.current) return

    queryRef.current.pageNum++
    const currQuery = queryRef.current

    if (currQuery.endOfListings) return
  
    const response = await fetch(`/api/fetchListings?` + new URLSearchParams({
      x: currQuery.x.toString(),
      y: currQuery.y.toString(),
      range: currQuery.range.toString(),
      keyword: currQuery.keyword,
      pageNum: currQuery.pageNum.toString()
    }))

    if (response.ok) {
      const { data, query }: SearchResponsePayload = await response.json()
      setLoadingState('loaded')
      if (data.length) setListings((prev) => prev.concat(data))
      else queryRef.current.endOfListings = true
    }

  },[])

  // Initial search request
  const searchHandler = async (values: SearchFormSchemaType) => {
    const { keyword, location, range } = values

    const rangeMeters = milesToMeters(range).toString()

    setLoadingState('loading')

    const response = await fetch(`/api/search?` + new URLSearchParams({
      keyword,
      location,
      range: rangeMeters
    }));

    if (response.ok) {
      const { data, query }: SearchResponsePayload = await response.json()

      if (data.length) {
        setLoadingState('loaded')
        setListings(data)
        queryRef.current = {
          ...query, 
          pageNum: 0
        }
      }
      else {
        setLoadingState('no results')
      }
      
    } else {
      console.error(response.status)
      if (response.status === 404) setLoadingState('location not found')
    }
  }

  return (
    <body >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="relative" >
          <div className="absolute top-0 right-0 m-4">
            <ModeToggle />
          </div>
        </div>
        <div className={`flex justify-center items-center`}>
          <div className="flex flex-col justify-center items-center w-full p-3 gap-10">
              <div className={`${!loadingState && 'translate-y-[70%]'} relative transition-all duration-700 ease-in-out flex flex-col justify-center items-center gap-10`}>
                
                <div className='relative'>
                <Search searchHandler={searchHandler} />
                <LoadingIcon loadingState={loadingState}/>
                </div>
              </div>
              {loadingState === 'loaded' && <Results listings={listings} fetchListings={fetchListings} loadingState={loadingState}/>}
              {loadingState === 'no results' && <NoResults />}
              {loadingState === 'location not found' && <LocationMiss />}
          </div>
        </div>
      </ThemeProvider>
    </body>
  );
}


