'use client'

import { 
  SearchFormSchemaType, 
  Search
} from '@/components/Search'
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  useState, 
  useCallback, 
  useEffect,
  type Dispatch,
  type SetStateAction
} from 'react'
import { 
  Results, 
  NoResults
} from '@/components/Results'
import { SubmitHandler } from "react-hook-form"
import { defaultQuery } from '@/lib/defaults'
import type { SortMethod } from '@/components/Sort'
import type { ModelOption } from '@/components/ModelFilter'
import { LocationMiss } from '@/components/LocationMiss'
import LoadingIcon from '@/components/LoadingIcon'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { Separator } from "@/components/ui/separator"
import { milesToMeters } from '@/lib/utils'
import { Database } from '@/lib/database.types'
import { Mail } from 'lucide-react';

export type PriceRange = [number, number]
export type YearRange = [number, number]

export type Loading = 'loading' | 'loaded' | 'no results' |'location not found' | undefined
export type ListingsRow = Database['public']['Functions']['proximity_search']['Returns'][0]
export type MileRange = SearchFormSchemaType['range']
export type Position = {
  x: number
  y: number
  range: MileRange
}
type Filters = {
  makes: string[]
  models: ModelOption[]
  price: PriceRange
  hideNullPrices: boolean
  year: YearRange
}
export type SupabasePublic = SupabaseClient<Database, 'public', Database['public']>
export type Query = {
  keyword: string
  pageNum: number
  endOfListings: boolean
  sortMethod: SortMethod
  filters: Filters
  position: Position
  zipCode: string
  cityState: string
  initialSearch: boolean
}
export type SetQuery = Dispatch<SetStateAction<Query>>
export type FetchOptions = {
  reset: boolean
}

let Supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  
  const [listings, setListings] = useState<ListingsRow[]>([])
  const [loadingState, setLoadingState] = useState<Loading>() // If results are found or not
  const [query, setQuery] = useState<Query>(defaultQuery)

  // listings fetch
  useEffect(() => {  
    const fetchListings = async () => {

      if (!query.initialSearch || (query.endOfListings && query.pageNum)) return

      if (query.pageNum === 0) setLoadingState('loading')

      if (!Supabase) return

      const { data, error } = await Supabase.rpc('proximity_search', {
        x: query.position.x,
        y: query.position.y,
        range: milesToMeters(Number(query.position.range)),  
        keyword: query.keyword,  
        sortMethod: query.sortMethod,
        makeFilter: query.filters.makes,
        modelFilter: query.filters.models.map(m => m.model),
        priceFilter: query.filters.price,
        hideNullPrices: query.filters.hideNullPrices,
        yearFilter: query.filters.year,
        pageNum: query.pageNum
      })

      if (error) {
        console.error('Error fetching listings', error)
        return
      }
    
      setLoadingState('loaded')

      if (!data?.length) {
        if (query.pageNum === 0) setLoadingState('no results')
        else setQuery((prev) => ({...prev, endOfListings: true}))
        return
      } 
      
      if (query.pageNum === 0) {
        setListings(data) 
      }
      else setListings((prev) => prev.concat(data))  
    }
    fetchListings()

  },[query])


  // Search submission
  const searchHandler: SubmitHandler<SearchFormSchemaType> = useCallback(async (values: SearchFormSchemaType) => {

    const { location, keyword, range} = values

    setLoadingState('loading')

    const res = await Supabase
      .rpc('autocomplete', { search: location})
            
    const data = res.data?.[0]

    if (data) {

      setQuery((prev) => ({
        ...prev,
        keyword: keyword,
        position: {
          x: data.longitude,
          y: data.latitude,
          range
        }, 
        zipCode: data.zip_code,
        cityState: data.city_state,
        pageNum: 0,
        initialSearch: true,
        endOfListings: false
      }))

    } else { 
      console.error('No results')
      setLoadingState('location not found')
    }
  }, [])

  return (
    <div className='flex flex-col justify-between min-h-screen'>
        <main>
          <div className="relative">
            <div className="absolute top-0 right-0 m-4">
              <ModeToggle />
            </div>
          </div>
          <div className='flex justify-center items-center'>
            <div className="flex flex-col justify-center items-center w-full p-3 gap-2">
                <div className={`${!loadingState && 'translate-y-[70%]'} transition-all duration-700 ease-in-out flex flex-col justify-center items-center gap-10 w-full`}>  
                  <div className='relative w-fit'>
                    <Search 
                      searchHandler={searchHandler} 
                      loadingState={loadingState} 
                      query={query}
                      setQuery={setQuery}
                      Supabase={Supabase}
                    />
                    <LoadingIcon loadingState={loadingState}/>
                  </div>
                </div>
                {loadingState === 'loaded' && (
                    <Results 
                      endOfListings={query.endOfListings}
                      listings={listings} 
                      keyword={query.keyword}
                      setQuery={setQuery}
                      loadingState={loadingState}
                    />
                )}
                {loadingState === 'no results' && <NoResults />}
                {loadingState === 'location not found' && <LocationMiss />}
            </div>
          </div> 
        </main>
        {!loadingState && 
          <div className='mt-48 mb-12 sm:mt-8 flex-col mx-auto w-3/4 rounded-xl p-8 border bg-slate-50 shadow'>
            <p className='text-2xl font-semibold'>Motorcycle Finder <span className='font-normal text-base'>offers the most complete dataset of dealership listings. Listings are sourced directly from each dealer&apos;s website, so it&apos;s not necessary for them to share their inventory in order for their listings to show up.</span></p>
          </div>}
        <footer className='flex flex-col justify-center items-center w-full py-4 bg-slate-200 shadow dark:bg-slate-950 dark:text-slate-50 text-center rounded-t-2xl'>
          <div className='w-3/4 font-light flex flex-col justify-center items-center gap-2'>
            <h2 className="text-lg tracking-tight">
              Motorcycle Finder currently only aggregates <span className='font-normal'>California dealerships</span>.
              <Separator className='bg-slate-800 dark:bg-slate-200 w-3/4 mx-auto'/>
            </h2>
            
            <p> 
              <span className='flex items-center gap-2 text-sm'><Mail size={17}/> botjameschulz@gmail.com</span>
            </p>
          </div>
        </footer>
    </div>
  );
}


