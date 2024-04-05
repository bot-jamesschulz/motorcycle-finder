'use client'

import { createClient } from '@supabase/supabase-js';
import { 
    useEffect, 
    useState,
    useRef,
    type Dispatch, 
    type SetStateAction
} from "react"
import { milesToMeters } from '@/lib/utils'
import { Database } from '@/lib/database.types'
import { SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { 
    Loading,
    Position,
    Range,
    FetchOptions
 } from '@/app/page'
import { 
    Sort, 
    type SortMethod 
} from '@/components/Sort'
import { Filter } from '@/components/Filter'
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command"

export type MakeCounts = Database['public']['Functions']['make_count_in_range']['Returns']
export type MakeCount = MakeCounts[0]
export type SearchFormSchemaType = z.infer<typeof FormSchema>

type SearchProps = {
    searchHandler: SubmitHandler<SearchFormSchemaType>
    sortMethod: SortMethod
    setSortMethod: Dispatch<SetStateAction<SortMethod>>
    loadingState: Loading
    position: Position
    setPosition: Dispatch<SetStateAction<Position>>
    fetchListings: (options?: FetchOptions) => Promise<void>
}



export const FormSchema = z.object({
    keyword: z.string(),
    location: z.string(),
    range: z.enum(['10','25','50','75','100','200','500'])
})

export const defaultRange: Range = "500"
export const defaultPosition: Position = {
    x: -119.401274,
    y: 36.658709,
    range: defaultRange
}
export const defaultSort: SortMethod = 'Relevance'

let Supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function Search({ 
        searchHandler, 
        sortMethod,
        setSortMethod, 
        loadingState,
        position,
        setPosition,
        fetchListings
    }: SearchProps) {
    const [open, setOpen] = useState(false)
    const [makesInRange, setMakesInRange] = useState<MakeCount[]>([])
    const locationOptionsRef = useRef<string[]>([])
    const [locationOptions, setLocationOptions ] = useState<string[]>([])
    const selectRef = useRef<HTMLDivElement>(null)
    
    const form = useForm<SearchFormSchemaType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            keyword: "",
            location: "",
            range: defaultRange
        },
    })

    const locationValue = form.watch('location')

    // Autocomplete
    useEffect(() => {
        let ignore = false
        const handleAutocomplete = async () => {
            const res = await fetch(`api/locationAutocomplete?` + new URLSearchParams({
                searchValue: locationValue
            }))
            const body = await res.json()
            locationOptionsRef.current = body
            if (Array.isArray(body) && body.length && !ignore) {
                setLocationOptions(body)
                setOpen(true)
            } else {
                setOpen(false)
            }
        }
       
        if (locationValue.length >= 3 && !locationOptionsRef.current.find(l => l.toLowerCase() === locationValue.toLowerCase())) {
            handleAutocomplete()
        } else {
            setOpen(false)
        }        

        return () => {
            ignore = true
        }
    },[locationValue])

    // Closing of the autocomplete drop down
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {

            if (event.target instanceof Element && open && !selectRef?.current?.contains(event.target)) {
                setOpen(false);
            }
        };

        document.body.addEventListener("click", handleClickOutside);

        return () => {
            document.body.removeEventListener("click", handleClickOutside);
        };
    }, [open]);

    // Get make counts
    useEffect( () => {
        const fetchData = async () => {
            console.log('start of fetch', position)
            if (!Supabase) return
            const { data, error } = await Supabase.rpc('make_count_in_range', {
                ...position,
                range: Number(milesToMeters(position.range))
            })
            if (error) return
            if (!data?.length) return
            setMakesInRange(data)
            
            
        }
        fetchData()
        
    }, [position])

    console.log('makes', makesInRange)

    const rangeChangeHandler = (range: Range) => {
        
        setPosition((prev: Position) => ({
            ...prev, 
            range: range
        }))
    }

    return  (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(searchHandler)} className="flex flex-col gap-5 w-full">
                <div className="flex flex-col gap-5 w-full h-1/2 max-w-2xl"> 
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Find your next motorcycle.</h1>
                    <div className="w-full">
                        <FormField
                            control={form.control}
                            name="keyword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Search by Keyword (e.g. Yamaha R6)" {...field} />
                                    </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="relative flex gap-2">
                        <div className="basis-11/12">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input autoComplete="postal-code" placeholder="ZIP or City, State" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            
                            />
                            
                            {open ? (
                            <Command className="absolute z-10 w-full h-auto rounded-xl bg-stone-50 outline-none animate-in fade-in-0 zoom-in-95">
                                <CommandGroup ref={selectRef}>
                                    {locationOptions.map((location,index) => (
                                    <CommandItem
                                        key={index}
                                        value={location}
                                        onSelect={() => {
                                        form.setValue('location', location)
                                        setOpen(false)
                                        }}
                                    >
                                        
                                        {location}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>) : null}
                            
                            
                        </div>
                        <div>
                        <FormField
                            control={form.control}
                            name="range"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select onValueChange={rangeChangeHandler}>
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue placeholder={`${defaultRange} mi.`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="10">10 mi.</SelectItem>
                                                <SelectItem value="25">25 mi.</SelectItem>
                                                <SelectItem value="50">50 mi.</SelectItem>
                                                <SelectItem value="75">75 mi.</SelectItem>
                                                <SelectItem value="100">100 mi.</SelectItem>
                                                <SelectItem value="200">200 mi.</SelectItem>
                                                <SelectItem value="500">500 mi.</SelectItem>
                                            </SelectContent>
                                        </Select>   
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        </div>
                    </div>
                    <div className={`flex ${loadingState === 'loaded' ? 'justify-start' : 'justify-center'} content-center gap-2`}>
                    <Button className="self-center h-9 w-1/4" type="submit">Search</Button>
                        { loadingState && 
                            <div className='flex items-center max-w-40 justify-between h-9 py-2 px-4 self-center grow basis-0 cursor-pointer'>
                                <Filter makesInRange={makesInRange} fetchListings={fetchListings}/>
                            </div>                     
                       }
                        { loadingState && 'loaded' && 
                            <Sort className='self-center grow basis-0' 
                            setSortMethod={setSortMethod} 
                            sortMethod={sortMethod}
                        />}
                    </div>
                </div>
            </form>
        </Form>
    )
}