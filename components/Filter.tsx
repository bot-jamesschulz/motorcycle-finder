'use client'

import { useCallback } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { SlidersHorizontal } from 'lucide-react';
import type {MakeCounts, MakeCount } from '@/components/Search'
import { 
    type Classification,
    type Option,
    MultiSelect
} from '@/components/ui/multi-select'
import type { FetchOptions } from '@/app/page'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

type FilterProps = {
    makesInRange: MakeCounts
    fetchListings: (options?: FetchOptions) => Promise<void>
}


export function Filter({ makesInRange, fetchListings }: FilterProps) {
    
    const optionsChangeHandler = useCallback((selected: Option[], classification: Classification) => {
        switch (classification) {
            case 'makes':
                console.log('makes', selected)
                break
            case 'models':
                console.log('models', selected)
                break
        }
    },[])

    const makeOptions = makesInRange.map((make) => ({
        value: make.make,
        label: `${make.make} (${make.count})`
        
    }))

    console.log(makeOptions)
    return (
        <Sheet>
            <SheetTrigger  className='mx-auto flex text-base justify-center items-center gap-2'><SlidersHorizontal size={20}/>Filter</SheetTrigger>
            <SheetContent onOpenAutoFocus={(e) => e.preventDefault()} className='flex flex-col' side='left'>
            <SheetHeader>
                <SheetTitle>Makes</SheetTitle>
                <SheetDescription>
                    <MultiSelect options={makeOptions} classification={'makes'} optionsChangeHandler={optionsChangeHandler}/>
                </SheetDescription>
            </SheetHeader>
            <SheetHeader>
                <SheetTitle>Models</SheetTitle>
                <SheetDescription>
                    <MultiSelect options={[]} classification={'models'} optionsChangeHandler={optionsChangeHandler}/>
                </SheetDescription>
            </SheetHeader>
                
            </SheetContent>
        </Sheet>
    )
}