'use client'

import { 
  SearchFormSchemaType, 
  Search
} from '@/components/Search'
import { createClient } from '@supabase/supabase-js';
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
import { ThemeProvider } from '@/components/theme-provider'
import LoadingIcon from '@/components/LoadingIcon'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { milesToMeters } from '@/lib/utils'
import { Database } from '@/lib/database.types'

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
                    setQuery={setQuery}
                    loadingState={loadingState}
                  />
              )}
              {loadingState === 'no results' && <NoResults />}
              {loadingState === 'location not found' && <LocationMiss />}
          </div>
        </div>
      </ThemeProvider>
    </body>
  );
}


