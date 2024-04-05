'use client'

import { Dispatch, SetStateAction } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowDownWideNarrow } from 'lucide-react';

export type SortMethod = 'Relevance' | 'Nearest' | 'Highest Price' | 'Lowest Price' 
type SortProps = {
    setSortMethod: Dispatch<SetStateAction<SortMethod>>
    sortMethod: SortMethod
    className: string | undefined
}

export function Sort({ setSortMethod, sortMethod,className }: SortProps) {

    const valueChangeHandler = (selection: SortMethod) => {
        setSortMethod(selection)
    }

    return (
        <div className={`${className} flex justify-center items-center gap-2`}>
            <ArrowDownWideNarrow strokeWidth={1.75} size={20} className='min-w-5'/>
            <Select onValueChange={valueChangeHandler}>
                <SelectTrigger className='border-none text-base text-left pl-0 max-w-52 min-w-[95px]'>
                    <SelectValue placeholder={<span>Sort By <span className='font-semibold'>{sortMethod}</span></span>} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Relevance">Relevance</SelectItem>
                    <SelectItem value="Nearest">Nearest</SelectItem>
                    <SelectItem value="Lowest Price">Lowest Price</SelectItem>
                    <SelectItem value="Highest Price">Highest Price</SelectItem>  
                </SelectContent>
            </Select>
        </div>
    )
}
