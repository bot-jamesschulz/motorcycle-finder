import type { 
    Query,
    SetQuery
} from '@/app/page'
import { 
    defaultPosition,
    defaultMileRange,
    defaultPriceRange,
    defaultYearRange
} from '@/lib/defaults'
import { formatToPrice } from '@/components/PriceFilter'
import { FilterTag } from '@/components/ui/filter-tag'


type FilterTagsProps = {
    query: Query
    setQuery: SetQuery
    resetKeyword: () => void
    resetLocation: () => void
}

function getPriceDescription(minPrice: number, maxPrice: number): string {
    if (minPrice === defaultPriceRange[0]) return `Up to ${formatToPrice(maxPrice)}`
    if (maxPrice === defaultPriceRange[1]) return `${formatToPrice(minPrice)} and up`
    return `${formatToPrice(minPrice)} to ${formatToPrice(maxPrice)}`
}

function getYearDescription(minYear: number, maxYear: number): string {
    if (minYear === defaultYearRange[0]) return `Up to ${maxYear}`
    if (maxYear === defaultYearRange[1]) return `${minYear} and up`
    return `${minYear} to ${maxYear}`
}

export function FilterTags({ query, setQuery, resetKeyword, resetLocation }: FilterTagsProps) {
    const modelFilterValues = query.filters.models.map(m => m.model)
    const makeFilterValues = query.filters.makes
    const locationDescription = `Within ${query.position.range} miles of ${query.zipCode}`
    const [minPrice, maxPrice] = query.filters.price
    const [minYear, maxYear] = query.filters.year
    const priceDescription = getPriceDescription(minPrice, maxPrice)
    const yearDescription = getYearDescription(minYear, maxYear)
    

    const makeUnselectHandler = (make: string) => {
        console.log('checking make unselect', make)

        setQuery((prev) => {
        const newMakeFilter = prev.filters.makes.filter(m => m !== make)
        
        return {
            ...prev,
            pageNum: 0,
            endOfListings: false,
            filters: {
                ...prev.filters,
                makes: newMakeFilter,
                models: prev.filters.models.filter(m => newMakeFilter.includes(m.make))
            }
        }
        })
    }

    const modelUnselectHandler = (model: String) => {
        setQuery((prev) => ({
          ...prev,
          pageNum: 0,
          endOfListings: false,
          filters: {
              ...prev.filters,
              models: prev.filters.models.filter(m => m.model !== model)
          }
        }))
    }

    const keywordUnselectHandler = () => {
        resetKeyword()
        setQuery((prev) => ({
          ...prev,
          keyword: '',
          pageNum: 0,
          endOfListings: false
        }))
    }

    const positionUnselectHandler = () => {
        resetLocation()
        setQuery((prev) => ({
          ...prev,
          position: defaultPosition,
          location: '',
          pageNum: 0,
          endOfListings: false
        }))
    }

    const priceUnselectHandler = () => {
        setQuery((prev) => ({
            ...prev,
            pageNum: 0,
            endOfListings: false,
            filters: {
                ...prev.filters,
                price: defaultPriceRange
            }
        }))
    }

    const yearUnselectHandler = () => {
        setQuery((prev) => ({
            ...prev,
            pageNum: 0,
            endOfListings: false,
            filters: {
                ...prev.filters,
                year: defaultYearRange
            }
        }))
    }

    const hideNullPricesUnselectHandler = () => {
        setQuery((prev) => ({
            ...prev,
            pageNum: 0,
            endOfListings: false,
            filters: {
                ...prev.filters,
                hideNullPrices: false
            }
        }))
    }
    
    return (
        <div className='my-2 flex flex-wrap gap-2'>
            {query.keyword !== '' && <FilterTag title='KEYWORD' content={query.keyword} unselectHandler={keywordUnselectHandler} />}
            {query.position.range !== defaultMileRange && <FilterTag  title='LOCATION' content={locationDescription} unselectHandler={positionUnselectHandler} />}
            {JSON.stringify(query.filters.price) !== JSON.stringify(defaultPriceRange) && <FilterTag  title='PRICE' content={priceDescription} unselectHandler={priceUnselectHandler} />}
            {query.filters.hideNullPrices && <FilterTag  title='PRICE' content={'Has Price'} unselectHandler={hideNullPricesUnselectHandler} />}
            {JSON.stringify(query.filters.year) !== JSON.stringify(defaultYearRange) && <FilterTag  title='YEAR' content={yearDescription} unselectHandler={yearUnselectHandler} />}
            {makeFilterValues.map((make) => (
                <FilterTag key={make} title='MAKE' content={make} unselectHandler={makeUnselectHandler} />
            ))}
            {modelFilterValues.map((model) => (
                <FilterTag  key={model} title='MODEL' content={model} unselectHandler={modelUnselectHandler} />
            ))}
        </div>
    )
}