'use client'

import { 
    useEffect, 
    useState,
    useRef,
    useCallback
} from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useLoadingContext } from "@/app/contexts/loadingContext"
import  { 
    useSupabaseContext
} from '@/app/contexts/supabaseContext'
import { SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { Filter } from '@/components/Filters'
import LoadingIcon from '@/components/LoadingIcon'
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
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
import { Database } from '@/lib/database.types'

export type ModelCount = Database['public']['Functions']['model_count_in_range']['Returns'][0]
export type SearchFormSchemaType = z.infer<typeof FormSchema>

export const FormSchema = z.object({
    keyword: z.string(),
    location: z.string().transform((val) => (val === '' ? defaultZip : val)),
    range: z.enum(['10','25','50','75','100','200','500', '1000'])
})

const minSearchAutocomplete = 2

export function Search() {
    const { loadingState, setLoadingState} = useLoadingContext()
    const Supabase = useSupabaseContext()
    const [open, setOpen] = useState(false)
    const [modelsInRange, setModelsInRange] = useState<ModelCount[]>([])
    const locationOptionsRef = useRef<string[]>([])
    const [locationOptions, setLocationOptions ] = useState<string[]>([])
    const selectRef = useRef<HTMLDivElement>(null)
    const [key, setKey] = useState(+new Date())
    const [selectValue, setSelectValue] = useState<string | undefined>(undefined)
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    
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
            const res = await Supabase
                .rpc('autocomplete', { search: locationValue})
            
            const optionsData = res.data
            
            if (Array.isArray(optionsData) && optionsData.length && !ignore) {

                const cityStates = optionsData.map(o => o.city_state)

                if (optionsData[0].greatest_sml === 1) {
                    setOpen(false)
                    return
                }

                locationOptionsRef.current = cityStates
                setLocationOptions(cityStates)
                setOpen(true)
            } else {
                setOpen(false)
            }
        }

        if (locationValue.length >= minSearchAutocomplete && !locationOptionsRef.current.find(l => l.toLowerCase() === locationValue.toLowerCase())) {
            handleAutocomplete()
        } else {
            setOpen(false)
        }        

        return () => {
            ignore = true
        }
    },[locationValue, Supabase])


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

        document.body.addEventListener("click", handleClickOutside)

        return () => {
            document.body.removeEventListener("click", handleClickOutside);
        }
    }, [open])

    // Search submission
    const searchHandler: SubmitHandler<SearchFormSchemaType> = useCallback(async (values: SearchFormSchemaType) => {

        const { location, keyword, range} = values
        const res = await Supabase
        .rpc('autocomplete', { search: location})
                
        const data = res.data?.[0]

        if (data) {

            const currSearch = new URLSearchParams(searchParams)

            currSearch.set('page', '1')
            currSearch.set('keyword', keyword)
            currSearch.set('zip', data.zip_code)
            currSearch.set('range', range)
            currSearch.set('long', data.longitude)
            currSearch.set('lat', data.latitude)

            router.push(`/motorcycles-for-sale?${currSearch.toString()}`)

        } else { 
            setLoadingState('location not found')
        }
 
    }, [Supabase, router, searchParams, setLoadingState])

    return  (
        <div className={`${pathname.split('/')[1] !== 'motorcycles-for-sale' && 'translate-y-[40%] sm:translate-y-[90%]'} transition-all duration-700 ease-in-out flex flex-col justify-center items-center gap-10`}>  
              <div className='relative w-fit'>
                <div className='flex flex-col justify-center items-center'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(searchHandler)} className="flex flex-col gap-5 w-full">
                            <div className="flex flex-col gap-5 w-full h-1/2 max-w-2xl px-2"> 
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
                                                            <SelectValue placeholder='Statewide'/>
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
                                <div className='self-center mr-4 h-9 grow basis-0 max-w-52'>
                                    <Button className="w-full" type="submit">Search</Button>
                                </div>
                                { loadingState && 
                                    <div className='flex items-center max-w-40 justify-between h-9 py-2 px-4 self-center grow basis-0'>
                                        <Filter modelsInRange={modelsInRange} setModelsInRange={setModelsInRange}/>
                                    </div>                     
                                }
                                { loadingState && 'loaded' && 
                                    <Sort className='self-center grow basis-0' />
                                }
                                </div>
                            </div>
                        </form>
                    </Form>
                    <Separator className='my-4'/>
                    <FilterTags 
                        resetKeyword={resetKeyword}
                        resetLocation={resetLocation}
                        modelsInRange={modelsInRange}
                    />
                </div>
            <LoadingIcon />
            </div>
        </div>
    )
}