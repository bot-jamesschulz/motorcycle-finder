'use client'

import { 
  SearchFormSchemaType, 
  Search,
  defaultSort,
  defaultPosition
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

import type { SortMethod } from '@/components/Sort'
import { LocationMiss } from '@/components/LocationMiss'
import { ThemeProvider } from '@/components/theme-provider'
import LoadingIcon from '@/components/LoadingIcon'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { milesToMeters } from '@/lib/utils'
import { Database } from '@/lib/database.types'

export type Loading = 'loading' | 'loaded' | 'no results' |'location not found' | undefined
export type ListingsRow = Database['public']['Functions']['keyword_proximity_search']['Returns'][0]
export type Range = SearchFormSchemaType['range']
export type Position = {
  x: number
  y: number
  range: Range
}
type Filters = {
  makes: string[],
  models: string[]
}
export type Query = {
  keyword: string
  pageNum: number
  endOfListings: boolean
  sortMethod: SortMethod
  filters: Filters
  position: Position
  initialSearch: boolean
}
export type SetQuery = Dispatch<SetStateAction<Query>>
export type FetchOptions = {
  reset: boolean
}
const defaultQuery: Query = {
  keyword: '',
  pageNum: 0,
  endOfListings: false,
  sortMethod: defaultSort,
  filters: {
    makes: [],
    models: []
  },
  position: defaultPosition,
  initialSearch: false
}

let Supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  
  const [listings, setListings] = useState<ListingsRow[]>([])
  const [loadingState, setLoadingState] = useState<Loading>() // If results are found or not
  const [query, setQuery] = useState<Query>(defaultQuery)

  const setPageNum = useCallback(async (options: FetchOptions = { reset: false }) => {
    
      setQuery((prev) => ({
        ...prev,
        pageNum: options.reset ? 0 : prev.pageNum++
      }))
     
  },[])

  // listings fetch
  useEffect(() => {  
    const fetchListings = async () => {

      if (query.endOfListings || !query.initialSearch) return

      if (query.pageNum === 0) setLoadingState('loading')

      console.log('fetching listings', query)

      if (!Supabase) return
      const { data, error } = await Supabase.rpc('keyword_proximity_search', {
        x: query.position.x,
        y: query.position.y,
        range: milesToMeters(Number(query.position.range)),  
        keyword: query.keyword,  
        sortMethod: query.sortMethod,
        makes: query.filters.makes,
        models: query.filters.models,
        pageNum: query.pageNum
      })

      if (error) {
        console.log('Error fetching listings', error)
        return
      }
    
      setLoadingState('loaded')

      if (!data?.length) {
        if (query.pageNum === 0) setLoadingState('no results')
        else setQuery((prev) => ({...prev, endOfListings: true}))
        return
      }
      
      if (query.pageNum === 0) {
        console.log('reset')
        setListings(data) 
      }
      else setListings((prev) => prev.concat(data))  
    }
    fetchListings()

  },[query])


  // Search submission
  const searchHandler = useCallback(async (values: SearchFormSchemaType) => {

    const { location, keyword, range} = values

    console.log('form values', values)

    setLoadingState('loading')

    const response = await fetch(`/api/getLocation?` + new URLSearchParams({
      location: location
    }));

    if (response.ok) {

      const data: { x: number, y: number } = await response.json()
      console.log('location', data)
      setQuery((prev) => ({
        ...prev,
        keyword: keyword,
        position: {
          x: data.x,
          y: data.y,
          range
        }, 
        initialSearch: true
      }))

    } else { 
      console.error(response.status)
      if (response.status === 404) setLoadingState('location not found')
    }
  }, [])

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
          <div className="flex flex-col justify-center items-center w-full p-3 gap-2">
              <div className={`${!loadingState && 'translate-y-[70%]'} transition-all duration-700 ease-in-out flex flex-col justify-center items-center gap-10 w-full`}>
                
                <div className='relative w-fit'>
                <Search 
                  searchHandler={searchHandler} 
                  loadingState={loadingState} 
                  query={query}
                  setQuery={setQuery}
                />
                <LoadingIcon loadingState={loadingState}/>
                </div>
              </div>
              {loadingState === 'loaded' && (
                  <Results listings={listings} 
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


