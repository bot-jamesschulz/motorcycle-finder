'use client'

import { useFilters } from '@/lib/utils'
import { 
    useState,
    useEffect,
    useMemo,
    type Dispatch,
    type SetStateAction
} from 'react'
import { 
    milesToMeters
} from '@/lib/utils'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import type { ModelCount } from '@/components/Search'
import { SlidersHorizontal } from 'lucide-react'
import { Database } from '@/lib/database.types'
import { ModelFilter } from '@/components/ModelFilter'
import { MakeFilter } from '@/components/MakeFilter'
import { PriceFilter } from '@/components/PriceFilter'
import { YearFilter } from '@/components/YearFilter'
import { useSupabaseContext } from '@/app/contexts/supabaseContext'

export type ModelOption = Record<'value' | 'label' | 'make', string>;
export type Option = Record<'value' | 'label', string>;
type MakeCount = Database['public']['Functions']['make_count_in_range']['Returns'][0]


export function Filter({ 
    modelsInRange, 
    setModelsInRange 
} : { 
    modelsInRange:  ModelCount[]
    setModelsInRange: Dispatch<SetStateAction<ModelCount[]>>
}) {
    const Supabase = useSupabaseContext()
    const [makesInRange, setMakesInRange] = useState<MakeCount[]>([])
    const { makeFilter, modelFilter, long, lat, rangeFilter, priceFilter, yearFilter, hideNullPrices } = useFilters()
    

    const [makeOptions, makeSelections]: [Option[], string[]] = useMemo(() => 
        filterOptions(makesInRange, makeFilter),
        [makesInRange, makeFilter]
    )
    
    // Split models into currently selected and all available options
    const [modelOptions, modelSelections]: [ModelOption[], string[]] = useMemo( () => {
        const options: ModelOption[] = []
        const selections: string[] = []

        modelsInRange.forEach((m) => {
            if (modelFilter.includes(m.model)) {
                selections.push(m.model)
            } else {
                options.push({
                    value: m.model,
                    label: `${m.model} (${m.count})`,
                    make: m.make
                })
            }
        })
        return [options, selections]
    }, [modelsInRange, modelFilter])

    // Get make counts
    useEffect( () => {
        const fetchData = async () => {
            if (!Supabase) return
            const { data, error } = await Supabase.rpc('make_count_in_range', {
                x: long,
                y: lat,
                range: milesToMeters(Number(rangeFilter)),
                price_filter: priceFilter,
                year_filter: yearFilter,
                hide_null_prices: hideNullPrices
            })

            if (error) {
                console.error('error getting makes', error)
                return
            }
            setMakesInRange(data)
        }
        fetchData()
        
    },[Supabase, long, lat, rangeFilter, priceFilter, yearFilter, hideNullPrices])

    // // Get model counts
    useEffect( () => {

        const fetchData = async () => {
            if (!Supabase) return
            const { data, error } = await Supabase.rpc('model_count_in_range', {
                x: long,
                y: lat,
                range: milesToMeters(Number(rangeFilter)),
                make_filter: makeFilter,
                price_filter: priceFilter,
                year_filter: yearFilter,
                hide_null_prices: hideNullPrices
            })
            if (error) {
                console.error('error getting makes', error)
                return
            }
        
            setModelsInRange(data)
        }
        fetchData()
        
    }, [Supabase, long, lat, rangeFilter, priceFilter, yearFilter, makeFilter, hideNullPrices, setModelsInRange])

    return (
        <Sheet>
            <SheetTrigger  className='mx-auto flex text-base justify-center items-center gap-2'><SlidersHorizontal size={20}/>Filter</SheetTrigger>
            <SheetContent onOpenAutoFocus={(e) => e.preventDefault()} className='flex flex-col overflow-auto' side='left'>
                <SheetTitle>Make</SheetTitle>
                <SheetDescription>
                    <MakeFilter options={makeOptions} modelsInRange={modelsInRange} makeFilter={makeFilter}/>
                </SheetDescription>
                <SheetTitle>Model</SheetTitle>
                <SheetDescription>
                    <ModelFilter options={modelOptions} modelFilter={modelFilter}/>
                </SheetDescription>
                <SheetTitle>Price</SheetTitle>
                <SheetDescription>
                    <PriceFilter priceFilter={priceFilter} hideNullPrices={hideNullPrices} />
                </SheetDescription>
                <SheetTitle>Year</SheetTitle>
                <SheetDescription>
                    <YearFilter yearFilter={yearFilter} />
                </SheetDescription>
            </SheetContent>
        </Sheet>
    )
}

const filterOptions = (
    items: {[key: string]: string | number}[],
    currFilter: string[]): [Option[], string[]] => {
    const info: { 
        options: Option[], 
        initialSelection: string[] 
    } = { 
        options: [], 
        initialSelection: []
    }

    if (!items.length) return [[], []]

    const keys = Object.keys(items[0])
    
    if (!keys) return [[], []]
    
    items.forEach((item) => {
        const name = item[keys[0]].toString()
        if (currFilter.includes(name)) {
            info.initialSelection.push(name)
        } else {
            info.options.push({
                value: name,
                label: `${name} (${item[keys[1]].toString() || 0})`
            })
        } 
    })
    return [ info.options, info.initialSelection ]
}