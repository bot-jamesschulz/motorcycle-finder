'use client'

import { 
  SearchFormSchemaType, 
  Search,
  defaultSort,
  defaultPosition
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
import type { SortMethod } from '@/components/Sort'
import { LocationMiss } from '@/components/LocationMiss'
import { ThemeProvider } from '@/components/theme-provider'
import LoadingIcon from '@/components/LoadingIcon'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { milesToMeters } from '@/lib/utils'
import { Database } from '@/lib/database.types'

export type Loading = 'loading' | 'loaded' | 'no results' |'location not found' | undefined
export type ListingsRow = Database['public']['Functions']['keyword_proximity_search']['Returns']
export type Range = SearchFormSchemaType['range']
export type Position = {
  x: number
  y: number
  range: Range
}
type Query = {
  keyword: string
  pageNum: number
  endOfListings: boolean
  sortMethod: SortMethod
} & Position
type SearchResponsePayload = {
  data: ListingsRow[]
  query: Query
}
export type FetchOptions = {
  reset: boolean
}

export default function Home() {
  
  const [listings, setListings] = useState<ListingsRow[]>([])
  const [position, setPosition] = useState<Position>(defaultPosition)
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
    const currQuery: Query = queryRef.current

    if (currQuery.endOfListings) return
  
    const response = await fetch(`/api/fetchListings?` + new URLSearchParams({
      x: currQuery.x.toString(),
      y: currQuery.y.toString(),
      range: milesToMeters(position.range),
      keyword: currQuery.keyword,
      pageNum: currQuery.pageNum.toString(),
      sortMethod
    }))

    if (!response.ok) return

    const { data }: SearchResponsePayload = await response.json()
    
    setLoadingState('loaded')

    if (!data?.length) {
      if (options.reset) setLoadingState('no results')
      else queryRef.current.endOfListings = true
      return
    }

    if (options.reset) {
      setListings(data)
    } else {
      setListings((prev) => prev.concat(data))
    }

  },[sortMethod, position])

  // Listings fetch trigger for sort and range changes
  useEffect(() => {
    if (!queryRef.current) return
    setLoadingState('loading')
    fetchListings({ reset: true })

  },[sortMethod, fetchListings, position.range])


  // Initial search request
  const searchHandler = async (values: SearchFormSchemaType) => {
    const { keyword, location, range } = values

    const rangeMeters = milesToMeters(range).toString()

    console.log('rangeMeters', rangeMeters)

    setLoadingState('loading')

    const response = await fetch(`/api/search?` + new URLSearchParams({
      keyword,
      location,
      range: rangeMeters,
      sortMethod
    }));

    const { data, query }: SearchResponsePayload = await response.json()

    setPosition((prev) => ({
      x: query.x,
      y: query.y,
      range: prev.range
    }))

    if (response.ok) {

      if (data?.length) {
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
          <div className="flex flex-col justify-center items-center w-full p-3 gap-2">
              <div className={`${!loadingState && 'translate-y-[70%]'} transition-all duration-700 ease-in-out flex flex-col justify-center items-center gap-10 w-full`}>
                
                <div className='relative w-fit'>
                <Search 
                  searchHandler={searchHandler} 
                  setSortMethod={setSortMethod} 
                  sortMethod={sortMethod} 
                  loadingState={loadingState} 
                  position={position}
                  setPosition={setPosition}
                  fetchListings={fetchListings}
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


