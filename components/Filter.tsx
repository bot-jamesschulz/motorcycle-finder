'use client'

import { 
    useState,
    useEffect,
    useMemo
} from 'react'
import { milesToMeters } from '@/lib/utils'
import { createClient } from '@supabase/supabase-js'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { SlidersHorizontal } from 'lucide-react'
import { Database } from '@/lib/database.types'
import { ModelFilter } from '@/components/ModelFilter'
import { MakeFilter } from '@/components/MakeFilter'
import { PriceFilter } from '@/components/PriceFilter'
import { YearFilter } from '@/components/YearFilter'
import type { 
    Query,
    SetQuery,
    SupabasePublic
} from '@/app/page'


export type ModelOption = Record<'value' | 'label' | 'make', string>;
export type Option = Record<'value' | 'label', string>;
type MakeCount = Database['public']['Functions']['make_count_in_range']['Returns'][0]
type ModelCount = Database['public']['Functions']['model_count_in_range']['Returns'][0]
type FilterProps = {
    query: Query
    setQuery: SetQuery
    Supabase: SupabasePublic
}

export function Filter({ query, setQuery, Supabase}: FilterProps) {
    const [makesInRange, setMakesInRange] = useState<MakeCount[]>([])
    const [modelsInRange, setModelsInRange] = useState<ModelCount[]>([])

    const [makeOptions, makeSelections]: [Option[], string[]] = useMemo(() => 
        filterOptions(makesInRange, query.filters.makes),
        [query.filters.makes, makesInRange]
    )
    
    const [modelOptions, modelSelections]: [ModelOption[], string[]] = useMemo( () => {
        const options: ModelOption[] = []
        const selections: string[] = []
        const currFilter = query.filters.models

        modelsInRange.forEach((m) => {
            if (currFilter.some(currFilter => currFilter.model === m.model)) {
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
    }, [query.filters.models, modelsInRange])

    // Get make counts
    useEffect( () => {
        const fetchData = async () => {
        
            if (!Supabase) return
            const { data, error } = await Supabase.rpc('make_count_in_range', {
                ...query.position,
                range: milesToMeters(Number(query.position.range)),
                price_filter: query.filters.price,
                year_filter: query.filters.year,
                hide_null_prices: query.filters.hideNullPrices
            })

            if (error) {
                console.error('error getting makes', error)
                return
            }
            setMakesInRange(data)
        }
        fetchData()
        
    }, [query.position, query.filters.price, query.filters.year, query.filters.hideNullPrices, Supabase])

    // Get model counts
    useEffect( () => {

        const fetchData = async () => {

            if (!Supabase) return
            const { data, error } = await Supabase.rpc('model_count_in_range', {
                ...query.position,
                range: milesToMeters(Number(query.position.range)),
                make_filter: query.filters.makes,
                price_filter: query.filters.price,
                year_filter: query.filters.year,
                hide_null_prices: query.filters.hideNullPrices  
            })
            if (error) {
                console.error('error getting makes', error)
                return
            }
        
            setModelsInRange(data)
        }
        fetchData()
        
    }, [query.filters.makes, query.position, query.filters.price, query.filters.year, query.filters.hideNullPrices, Supabase])

    return (
        <Sheet>
            <SheetTrigger  className='mx-auto flex text-base justify-center items-center gap-2'><SlidersHorizontal size={20}/>Filter</SheetTrigger>
            <SheetContent onOpenAutoFocus={(e) => e.preventDefault()} className='flex flex-col overflow-auto' side='left'>
                <SheetTitle>Make</SheetTitle>
                <SheetDescription>
                    <MakeFilter options={makeOptions} query={query} setQuery={setQuery}/>
                </SheetDescription>
                <SheetTitle>Model</SheetTitle>
                <SheetDescription>
                    <ModelFilter options={modelOptions} modelsInRange={modelsInRange} selected={modelSelections} query={query} setQuery={setQuery}/>
                </SheetDescription>
                <SheetTitle>Price</SheetTitle>
                <SheetDescription>
                    <PriceFilter query={query} setQuery={setQuery} />
                </SheetDescription>
                <SheetTitle>Year</SheetTitle>
                <SheetDescription>
                    <YearFilter query={query} setQuery={setQuery} />
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