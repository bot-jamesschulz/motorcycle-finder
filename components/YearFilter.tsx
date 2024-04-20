import { 
    defaultYearRange,
    yearOptions,
    type YearRange
} from '@/lib/defaults'
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select-original"
import { useSearchParams, useRouter, usePathname } from "next/navigation"


export function YearFilter({ yearFilter }: {yearFilter: YearRange }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currSearch = new URLSearchParams(searchParams)
    const [currFilterMin, currFilterMax] = yearFilter

    const handleMinYearChange = (val: string) => {
        const selectedMinYear = Number(val)

        if (selectedMinYear === currFilterMin) return

        // 'any' and min greater than max case
        if (!selectedMinYear ||
            (currFilterMax && selectedMinYear > currFilterMax)
        ) {
            currSearch.set('yearMin', defaultYearRange[0].toString())

        } else {
            currSearch.set('yearMin', selectedMinYear.toString())
        }

        currSearch.set('page', '1')
        router.push(`${pathname}?${currSearch.toString()}`)
    }

    const handleMaxYearChange = (val: string) => {
        const selectedMaxYear = Number(val)

        if (selectedMaxYear === currFilterMax) return

        if (!selectedMaxYear || (currFilterMin > selectedMaxYear)) {
            currSearch.set('yearMax', defaultYearRange[1].toString())
        } else {
            currSearch.set('yearMax', selectedMaxYear.toString())
        }

        currSearch.set('page', '1')
        router.push(`${pathname}?${currSearch.toString()}`)
    }

    return (

        <div className='flex gap-4'>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="min-year">Min year</Label>
                <Select value={currFilterMin === defaultYearRange[0] ? 'Any' : currFilterMin.toString()} onValueChange={handleMinYearChange}>
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
                <Select value={currFilterMax === defaultYearRange[1] ? 'Any' : currFilterMax.toString()} onValueChange={handleMaxYearChange}>
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