import {
    type FocusEvent,
    useState
} from 'react'
import { defaultPriceRange, PriceRange } from '@/lib/defaults'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useSearchParams, useRouter, usePathname } from "next/navigation"


export const formatToPrice = (val: string | number) => {
    return Number(val).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    })
}

export function PriceFilter({ priceFilter, hideNullPrices }: { priceFilter: PriceRange, hideNullPrices: boolean }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isChecked, setIsChecked] = useState(hideNullPrices)
    const [currFilterMin, currFilterMax] = priceFilter
    const [minInputValue, setMinInputValue] = useState(currFilterMin === defaultPriceRange[0] ? '' : formatToPrice(currFilterMin))
    const [maxInputValue, setMaxInputValue] = useState(currFilterMax === defaultPriceRange[1] ? '' : formatToPrice(currFilterMax))
    const currSearch = new URLSearchParams(searchParams)

    const handleMinBlur = (e: FocusEvent<HTMLInputElement>) => {
        const val = Number(e.target.value.replace(/\D/g, ''))
        
        if (!val || val > currFilterMax) {
            setMinInputValue('')
        } else {
            setMinInputValue(formatToPrice(val))
            currSearch.set('priceMin', val.toString())
        }

        currSearch.set('page', '1')
        router.push(`${pathname}?${currSearch.toString()}`)
    }

    const handleMaxBlur = (e: FocusEvent<HTMLInputElement>) => {
        const val = Number(e.target.value.replace(/\D/g, ''))

        if (!val || val < currFilterMin) {
            setMaxInputValue('')
        }
        else {
            setMaxInputValue(formatToPrice(val))
            currSearch.set('priceMax', val.toString())
        }

        currSearch.set('page', '1')
        router.push(`${pathname}?${currSearch.toString()}`)
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
                    id="hideNulls" 
                    checked={isChecked}
                    onCheckedChange={(checked: boolean) => {
                        setIsChecked(checked)
                        if (checked) currSearch.set('hideNullPrices', '')
                        else currSearch.delete('hideNullPrices')
                        
                        router.push(`${pathname}?${currSearch.toString()}`)
                    }}
                />
                <Label htmlFor="hideNulls">Hide listings with no price</Label>
            </div>
        </div>
    )
}