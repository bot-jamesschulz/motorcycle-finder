'use client'

import { 
  SearchFormSchemaType, 
  Search 
} from '@/components/Search'
import { 
  useState, 
  useRef, 
  useCallback, 
  useEffect 
} from 'react'
import { 
  Results, 
  NoResults
} from '@/components/Results'
import { SortMethod } from '@/components/Sort'
import { LocationMiss } from '@/components/LocationMiss'
import { ThemeProvider } from '@/components/theme-provider'
import LoadingIcon from '@/components/LoadingIcon'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { milesToMeters } from '@/lib/utils'
import { Database } from '@/lib/database.types'


export type Loading = 'loading' | 'loaded' | 'no results' |'location not found' | undefined
export type ListingsRow = Database['public']['Functions']['keyword_proximity_search']['Returns']
type Query = {
  x: number
  y: number
  range: number
  keyword: string
  pageNum: number
  endOfListings: boolean
  sortMethod: SortMethod
}
type SearchResponsePayload = {
  data: ListingsRow[]
  query: Query
}
type FetchOptions = {
  reset: boolean
}
export const defaultSort: SortMethod = 'Relevance'

export default function Home() {
  
  const [listings, setListings] = useState<ListingsRow[]>([])
  const [loadingState, setLoadingState] = useState<Loading>() // If results are found or not
  const [sortMethod, setSortMethod] = useState<SortMethod>(defaultSort)
  const queryRef = useRef<Query>()

  // New listings for infinite scroll
  const fetchListings = useCallback(async (options: FetchOptions = { reset: false }) => {  
    if (!queryRef.current) return

    
    if (options.reset) {
      queryRef.current.pageNum = 0
    } else {
      queryRef.current.pageNum++
    }
    const currQuery = queryRef.current

    if (currQuery.endOfListings) return
  
    const response = await fetch(`/api/fetchListings?` + new URLSearchParams({
      x: currQuery.x.toString(),
      y: currQuery.y.toString(),
      range: currQuery.range.toString(),
      keyword: currQuery.keyword,
      pageNum: currQuery.pageNum.toString(),
      sortMethod
    }))

    if (!response.ok) return

    const { data }: SearchResponsePayload = await response.json()
    setLoadingState('loaded')
    if (!data.length) {
      queryRef.current.endOfListings = true
      return
    }

    if (options.reset) {
      setListings(data)
    } else {
      setListings((prev) => prev.concat(data))
    }


  },[sortMethod])

  useEffect(() => {
    
    if (!queryRef.current) return
    setLoadingState('loading')
    fetchListings({ reset: true })

  },[sortMethod, fetchListings])

  // Initial search request
  const searchHandler = async (values: SearchFormSchemaType) => {
    const { keyword, location, range } = values

    const rangeMeters = milesToMeters(range).toString()

    setLoadingState('loading')

    const response = await fetch(`/api/search?` + new URLSearchParams({
      keyword,
      location,
      range: rangeMeters,
      sortMethod
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

  console.log(listings.map(el => ({score: el.matchScore, model: el.model})))

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
                  setSortMethod={setSortMethod} 
                  sortMethod={sortMethod} 
                  loadingState={loadingState} 
                />
                <LoadingIcon loadingState={loadingState}/>
                </div>
              </div>
              {loadingState === 'loaded' && (
                  <Results listings={listings} 
                    fetchListings={fetchListings}
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


