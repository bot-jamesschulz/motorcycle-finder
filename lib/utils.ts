import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { 
  defaultPriceRange, 
  defaultYearRange,
  defaultSort,
  defaultZip,
  defaultPosition,
  type PriceRange,
  type YearRange
} from '@/lib/defaults'
import { useSearchParams } from "next/navigation"
import { useRef } from 'react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function milesToMeters(miles: number): number {
  const defaultMiles = 50;
  return Math.round(1609.344 * (miles || defaultMiles))
}

export type Filters = {
  page: string,
  long: string,
  lat: string,
  zip: string,
  keywordFilter: string,
  makeFilter: string[], 
  modelFilter: string[],
  rangeFilter: string,
  priceFilter: PriceRange,
  yearFilter: YearRange,
  hideNullPrices: boolean,
  sort: string
}

export function useFilters() {
  const searchParams = useSearchParams()
  const filtersRef = useRef<Filters | undefined>()
  const makeFilterRef = useRef<string[]>([])
  const modelFilterRef = useRef<string[]>([])
  const priceFilterRef = useRef<PriceRange>([defaultPriceRange[0], defaultPriceRange[1]])
  const yearFilterRef = useRef<YearRange>([defaultYearRange[0], defaultYearRange[1]])
  
  const page = searchParams.get("page") || '1'
  const long = searchParams.get("long") || defaultPosition.long.toString()
  const lat = searchParams.get("lat") || defaultPosition.lat.toString()
  const zip = searchParams.get("zip") || defaultZip
  const keywordFilter = searchParams.get('keyword') || ''
  const rangeFilter = searchParams.get("range") || defaultPosition.range.toString()
  const sort = searchParams.get("sort") || defaultSort
  const modelFilter = searchParams.getAll("model")
  const makeFilter = searchParams.getAll("make")
  const priceFilter: PriceRange = [
    Number(searchParams.get("priceMin")) || defaultPriceRange[0],
    Number(searchParams.get("priceMax")) || defaultPriceRange[1]
  ]
  const yearFilter: YearRange = [
    Number(searchParams.get("yearMin")) || defaultYearRange[0],
    Number(searchParams.get("yearMax")) || defaultYearRange[1]
  ]
  const hideNullPrices = searchParams.has("hideNullPrices")


  if (JSON.stringify(makeFilter) !== JSON.stringify(makeFilterRef.current)) {
    makeFilterRef.current = makeFilter
  }

  if (JSON.stringify(modelFilter) !== JSON.stringify(modelFilterRef.current)) {
    modelFilterRef.current = modelFilter
  }

  if (JSON.stringify(priceFilter) !== JSON.stringify(priceFilterRef.current)) {
    priceFilterRef.current = priceFilter
  }

  if (JSON.stringify(yearFilter) !== JSON.stringify(yearFilterRef.current)) {
    yearFilterRef.current = yearFilter
  }

  return {
    page,
    long,
    lat,
    zip,
    keywordFilter,
    rangeFilter,
    hideNullPrices,
    sort,
    makeFilter: makeFilterRef.current,
    modelFilter: modelFilterRef.current,
    priceFilter: priceFilterRef.current,
    yearFilter: yearFilterRef.current,
  }
}