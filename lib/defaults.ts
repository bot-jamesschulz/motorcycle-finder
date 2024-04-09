import type { 
    YearRange,
    PriceRange,
    Position,
    MileRange,
    Query
} from '@/app/page'
import type { SortMethod } from '@/components/Sort'

export const defaultSort: SortMethod = 'Relevance'
export const defaultZip = '93654'
export const defaultMileRange: MileRange = '1000'
export const defaultPriceRange: PriceRange  = [0, 1_000_000]
export const defaultPosition: Position = {
    x: -119.401274,
    y: 36.658709,
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
export const defaultQuery: Query = {
    keyword: '',
    pageNum: 0,
    endOfListings: false,
    sortMethod: defaultSort,
    filters: {
      makes: [],
      models: [],
      price: defaultPriceRange,
      hideNullPrices: false,
      year: defaultYearRange
    },
    position: defaultPosition,
    zipCode: defaultZip,
    initialSearch: false
  }