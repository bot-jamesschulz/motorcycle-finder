import type { 
  SortMethod 
} from '@/components/Sort'
import { 
  type SearchFormSchemaType
} from '@/components/Search'

export type Loading = 'loading' | 'loaded' | 'no results' |'location not found' | undefined
export type PriceRange = [number, number]
export type YearRange = [number, number]
export type MileRange = SearchFormSchemaType['range']
export type Position = {
  long: number
  lat: number
  range: MileRange
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

export const defaultSort: SortMethod = 'Relevance'
export const defaultZip = '93654'
export const defaultCityState = 'Reedley, California'
export const defaultMileRange: MileRange = '1000'
export const defaultPriceRange: PriceRange  = [0, 1_000_000]
export const defaultPosition: Position = {
    long: -119.401274,
    lat: 36.658709,
    range: defaultMileRange
}
export const defaultYearRange: YearRange = [
    1900, 
    new Date().getFullYear() + 2
  ]
export const yearOptions: number[] = []
for (let year = defaultYearRange[1]; year >= defaultYearRange[0]; year--) {
    yearOptions.push(year);
}

export const defaultFilters: Filters = {
  page: '1',
  long: defaultPosition.long.toString(),
  lat: defaultPosition.lat.toString(),
  zip: defaultZip,
  keywordFilter: '',
  makeFilter: [],
  modelFilter: [],
  rangeFilter: defaultPosition.range,
  priceFilter: defaultPriceRange,
  yearFilter: defaultYearRange,
  hideNullPrices: false,
  sort: defaultSort
}
