import { Dispatch, SetStateAction } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

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
        <div className={className}>
            <Select onValueChange={valueChangeHandler} >
                <SelectTrigger className=''>
                    <SelectValue placeholder={`Sort By: ${sortMethod}`} />
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
