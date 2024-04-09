import { 
    type Query,
    type SetQuery
} from '@/app/page'
import { 
    defaultYearRange,
    yearOptions
} from '@/lib/defaults'
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select-original"


export function YearFilter({ query, setQuery }: {query: Query, setQuery: SetQuery }) {
    const queryMin = query.filters.year[0]
    const queryMax = query.filters.year[1]

    const handleMinYearChange = (val: string) => {
        const selectedMinYear = Number(val)

        if (selectedMinYear === queryMin) return

        // 'any' and min greater than max case
        if (!selectedMinYear ||
            (queryMax && selectedMinYear > queryMax)
        ) {
            setQuery((prev) => ({
                ...prev,
                pageNum: 0,
                endOfListings: false,
                filters: {
                    ...prev.filters,
                    year: [defaultYearRange[0], prev.filters.year[1]]
                }
            }))
            return
        }

        setQuery((prev) => ({
            ...prev,
            pageNum: 0,
            endOfListings: false,
            filters: {
                ...prev.filters,
                year: [selectedMinYear, prev.filters.year[1]]
            }
        }))
    }

    const handleMaxYearChange = (val: string) => {
        const selectedMaxYear = Number(val)

        if (selectedMaxYear === queryMax) return

        if (!selectedMaxYear || 
            (queryMin > selectedMaxYear)
        ) {
            setQuery((prev) => ({
                ...prev,
                pageNum: 0,
                endOfListings: false,
                filters: {
                    ...prev.filters,
                    year: [prev.filters.year[0], defaultYearRange[1]]
                }
            }))
            return
        }

        setQuery((prev) => ({
            ...prev,
            pageNum: 0,
            endOfListings: false,
            filters: {
                ...prev.filters,
                year: [prev.filters.year[0], selectedMaxYear]
            }
        }))
    }

    return (

        <div className='flex gap-4'>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="min-year">Min year</Label>
                <Select value={queryMin === defaultYearRange[0] ? 'Any' : queryMin.toString()} onValueChange={handleMinYearChange}>
                    <SelectTrigger id="min-year" className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                                <SelectItem key='Any' value='Any'>Any</SelectItem>
                            {yearOptions.map((year: number) => (
                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="max-year">Max year</Label>
                <Select value={queryMax === defaultYearRange[1] ? 'Any' : queryMax.toString()} onValueChange={handleMaxYearChange}>
                    <SelectTrigger id="max-year" className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem key='Any' value='Any'>Any</SelectItem>
                            {yearOptions.map((year: number) => (
                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>

    )
}