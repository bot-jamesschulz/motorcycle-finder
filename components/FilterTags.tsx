import { useFilters } from '@/lib/utils'
import { 
    defaultPosition,
    defaultMileRange,
    defaultPriceRange,
    defaultYearRange,
    defaultZip
} from '@/lib/defaults'
import type { 
    ModelCount 
} from '@/components/Search'
import { formatToPrice } from '@/components/PriceFilter'
import { FilterTag } from '@/components/ui/filter-tag'
import { useSearchParams, useRouter, usePathname } from "next/navigation"

type FilterTagsProps = {
    resetKeyword: () => void
    resetLocation: () => void
    modelsInRange: ModelCount[]
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

export function FilterTags({ 
    resetKeyword, 
    resetLocation, 
    modelsInRange 
}: FilterTagsProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { 
        keywordFilter,
        makeFilter, 
        modelFilter, 
        yearFilter, 
        priceFilter, 
        rangeFilter,
        zip,
        hideNullPrices
    } = useFilters()
    const [minYear, maxYear] = yearFilter
    const [minPrice, maxPrice] = priceFilter
    const locationDescription = `Within ${rangeFilter} miles of ${zip}`
    const priceDescription = getPriceDescription(minPrice, maxPrice)
    const yearDescription = getYearDescription(minYear, maxYear)
    const currSearch = new URLSearchParams(searchParams)
    
    const makeUnselectHandler = (make: string) => {
  
        currSearch.set('page', '1')
        const newMakeFilter = currSearch.getAll('make').filter(m => m !== make)
        currSearch.delete('make')
        newMakeFilter.forEach((m) => {
            currSearch.append('make', m)
        })

        const newModelFilter = currSearch.getAll('model')
        currSearch.delete('model')
        newModelFilter.forEach((m) => {
        const make = modelsInRange.find(opt => opt.model === m)?.make
        if (make && newMakeFilter.includes(make)) {
            currSearch.append('model', m)
        }
        })
        router.push(`${pathname}?${currSearch.toString()}`)
    }

    const modelUnselectHandler = (model: String) => {
  
        currSearch.set('page', '1')
        currSearch.delete('model', modelFilter.find(m => m === model))
        const newModelFilter = currSearch.getAll('model').filter(m => m !== model)
        currSearch.delete('model')
        newModelFilter.forEach((m) => {
        currSearch.append('model', m)
        })
        router.push(`${pathname}?${currSearch.toString()}`)
    }

    const keywordUnselectHandler = () => {
        resetKeyword()
        currSearch.set('keyWord', '')
        currSearch.set('page', '1')
        router.push(`${pathname}?${currSearch.toString()}`)
    }

    const positionUnselectHandler = () => {
        resetLocation()
        currSearch.set('page', '1')
        currSearch.set('long', defaultPosition.long.toString())
        currSearch.set('lat', defaultPosition.lat.toString())
        currSearch.set('range', defaultPosition.range)
        currSearch.set('zip', defaultZip)
        router.push(`${pathname}?${currSearch.toString()}`)
    }

    const priceUnselectHandler = () => {
        currSearch.set('page', '1')
        currSearch.delete('priceMin')
        currSearch.delete('priceMax')
        router.push(`${pathname}?${currSearch.toString()}`)
    }

    const yearUnselectHandler = () => {
        currSearch.set('page', '1')
        currSearch.delete('yearMin')
        currSearch.delete('yearMax')
        router.push(`${pathname}?${currSearch.toString()}`)
    }

    const hideNullPricesUnselectHandler = () => {
        currSearch.set('page', '1')
        currSearch.delete('hideNullPrices')
        router.push(`${pathname}?${currSearch.toString()}`)
    }

    return (
        <div className='flex flex-wrap gap-2'>
            {keywordFilter !== '' && <FilterTag title='KEYWORD' content={keywordFilter} unselectHandler={keywordUnselectHandler} />}
            {rangeFilter && rangeFilter !== defaultMileRange && <FilterTag  title='LOCATION' content={locationDescription} unselectHandler={positionUnselectHandler} />}
            {JSON.stringify(priceFilter) !== JSON.stringify(defaultPriceRange) && <FilterTag  title='PRICE' content={priceDescription} unselectHandler={priceUnselectHandler} />}
            {hideNullPrices && <FilterTag  title='PRICE' content={'Has Price'} unselectHandler={hideNullPricesUnselectHandler} />}
            {JSON.stringify(yearFilter) !== JSON.stringify(defaultYearRange) && <FilterTag  title='YEAR' content={yearDescription} unselectHandler={yearUnselectHandler} />}
            {makeFilter.map((make) => (
                <FilterTag key={make} title='MAKE' content={make} unselectHandler={makeUnselectHandler} />
            ))}
            {modelFilter.map((model) => (
                <FilterTag  key={model} title='MODEL' content={model} unselectHandler={modelUnselectHandler} />
            ))}
        </div>
    )
}