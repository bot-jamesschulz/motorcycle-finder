'use client'

import { 
    useEffect, 
    useState,
    useRef,
    useCallback
} from "react"
import { SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { 
    Loading,
    Query,
    SetQuery,
} from '@/app/page'
import {
    defaultZip,
    defaultMileRange
} from '@/lib/defaults'
import { 
    Sort
} from '@/components/Sort'
import {
    FilterTags
} from '@/components/FilterTags'
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

export type SearchFormSchemaType = z.infer<typeof FormSchema>

type SearchProps = {
    searchHandler: SubmitHandler<SearchFormSchemaType>
    loadingState: Loading
    query: Query,
    setQuery: SetQuery
}

export const FormSchema = z.object({
    keyword: z.string(),
    location: z.string().transform((val) => (val === '' ? defaultZip : val)),
    range: z.enum(['10','25','50','75','100','200','500', '1000'])
})

export function Search({ 
        searchHandler, 
        loadingState,
        query,
        setQuery
    }: SearchProps) {
    const [open, setOpen] = useState(false)
    const locationOptionsRef = useRef<string[]>([])
    const [locationOptions, setLocationOptions ] = useState<string[]>([])
    const selectRef = useRef<HTMLDivElement>(null)
    const [key, setKey] = useState(+new Date())
    const [selectValue, setSelectValue] = useState<string | undefined>(undefined)
    
    const form = useForm<SearchFormSchemaType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            keyword: "",
            location: "",
            range: defaultMileRange
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
       
        if (locationValue !== query.zipCode && locationValue.length >= 3 && !locationOptionsRef.current.find(l => l.toLowerCase() === locationValue.toLowerCase())) {
            handleAutocomplete()
        } else {
            setOpen(false)
        }        

        return () => {
            ignore = true
        }
    },[locationValue, query.zipCode])

    // Reset keyword when tag is removed
    const resetKeyword = useCallback(() => {
        form.resetField('keyword')
    }, [form])

    // Reset location when tag is removed
    const resetLocation = useCallback(() => {
        setSelectValue(undefined)
        setKey(+new Date())
        form.resetField('location')
    }, [form])


    // Closing of the autocomplete drop down
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {

            if (event.target instanceof Element && open && !selectRef?.current?.contains(event.target)) {
                setOpen(false);
            }
        }

        document.body.addEventListener("click", handleClickOutside);

        return () => {
            document.body.removeEventListener("click", handleClickOutside);
        }
    }, [open])

    return  (
        <div className='flex flex-col'>
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
                                            <Select key={key} value={selectValue} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full min-w-[100px]">
                                                    <SelectValue placeholder='Radius'/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1000">Statewide</SelectItem>
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
                                    <Filter query={query} setQuery={setQuery}/>
                                </div>                     
                        }
                            { loadingState && 'loaded' && 
                                <Sort className='self-center grow basis-0' 
                                query={query}
                                setQuery={setQuery} 
                            />}
                        </div>
                    </div>
                </form>
            </Form>
            <FilterTags 
                query={query}
                setQuery={setQuery}
                resetKeyword={resetKeyword}
                resetLocation={resetLocation}
            />
        </div>
    )
}