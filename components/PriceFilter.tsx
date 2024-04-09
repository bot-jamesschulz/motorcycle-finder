
import  {
    type FocusEvent,
    useState
} from 'react'
import { 
    type Query,
    type SetQuery
} from '@/app/page'
import { defaultPriceRange } from '@/lib/defaults'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export const formatToPrice = (val: string | number) => {
    return Number(val).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    })
}

export function PriceFilter({ query, setQuery }: {query: Query, setQuery: SetQuery }) {
    const [isChecked, setIsChecked] = useState(query.filters.hideNullPrices)
    const [currFilterMin, currFilterMax] = [query.filters.price[0], query.filters.price[1]]
    const [minInputValue, setMinInputValue] = useState(currFilterMin === defaultPriceRange[0] ? '' : formatToPrice(currFilterMin))
    const [maxInputValue, setMaxInputValue] = useState(currFilterMax === defaultPriceRange[1] ? '' : formatToPrice(currFilterMax))

    const handleMinBlur = (e: FocusEvent<HTMLInputElement>) => {
        const val = Number(e.target.value.replace(/\D/g, ''))

        if (!val || val > currFilterMax) {
            setMinInputValue('')
            setQuery((prev) => ({
                ...prev,
                pageNum: 0,
                endOfListings: false,
                filters: {
                    ...prev.filters,
                    price: [defaultPriceRange[0], prev.filters.price[1]]
                }
            }))
            return
        }

        setMinInputValue(formatToPrice(val))
        setQuery((prev) => ({
            ...prev,
            pageNum: 0,
            endOfListings: false,
            filters: {
                ...prev.filters,
                price: [val, prev.filters.price[1]]
            }
        }))
    }

    const handleMaxBlur = (e: FocusEvent<HTMLInputElement>) => {
        const val = Number(e.target.value.replace(/\D/g, ''))

        if (!val || val < currFilterMin) {
            setMaxInputValue('')
            setQuery((prev) => ({
                ...prev,
                pageNum: 0,
                endOfListings: false,
                filters: {
                    ...prev.filters,
                    price: [prev.filters.price[0], defaultPriceRange[1]]
                }
            }))
            return
        }

        setMaxInputValue(formatToPrice(val))
        setQuery((prev) => ({
            ...prev,
            pageNum: 0,
            endOfListings: false,
            filters: {
                ...prev.filters,
                price: [prev.filters.price[0], val]
            }
        }))
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex gap-4'>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="min-price">Min Price</Label>
                    <Input 
                        onBlur={handleMinBlur} 
                        type="min-price" 
                        id="min-price" 
                        value={minInputValue}
                        onChange={(el) => setMinInputValue(el.target.value)}
                        />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="max-price">Max Price</Label>
                    <Input 
                        onBlur={handleMaxBlur} 
                        type="max-price" 
                        id="max-price" 
                        value={maxInputValue} 
                        onChange={(el) => setMaxInputValue(el.target.value)}
                    />
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox 
                    id="includeNulls" 
                    checked={isChecked}
                    onCheckedChange={(checked: boolean) => {
                        setIsChecked(checked)
                        setQuery((prev) => ({
                            ...prev,
                            pageNum: 0,
                            endOfListings: false,
                            filters: {
                                ...prev.filters,
                                hideNullPrices: checked
                            }
                        }))
                    }}
                />
                <Label htmlFor="includeNulls">Hide listings with no price</Label>
            </div>
        </div>
    )
}