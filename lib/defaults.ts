import type { 
    YearRange,
    PriceRange,
    Position,
    MileRange
} from '@/app/page'
import type { SortMethod } from '@/components/Sort'

export const defaultMileRange: MileRange = "500"
export const defaultPosition: Position = {
    x: -119.401274,
    y: 36.658709,
    range: defaultMileRange
}
export const defaultSort: SortMethod = 'Relevance'
export const defaultZip = '93654'

export const defaultYearRange: YearRange = [
    1900, 
    new Date().getFullYear() + 2
  ]
export const yearOptions: number[] = []

for (let year = defaultYearRange[1]; year >= defaultYearRange[0]; year--) {
    yearOptions.push(year);
}
  
export const defaultPriceRange: PriceRange  = [0, 1_000_000]