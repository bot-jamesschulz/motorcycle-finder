"use client"

import { 
    useEffect, 
    useState,
    useRef
} from "react"
import { SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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

export const FormSchema = z.object({
    keyword: z.string(),
    location: z.string(),
    range: z.enum(['10','25','50','75','100','200','500'])
})

export type FormSchemaType = z.infer<typeof FormSchema>


type SearchProps = {
    searchHandler: SubmitHandler<FormSchemaType>
}

export function Search({ searchHandler}: SearchProps) {
    const [open, setOpen] = useState(false)
    const locationOptionsRef = useRef<string[]>([])
    const [locationOptions, setLocationOptions ] = useState<string[]>([])
    const selectRef = useRef<HTMLDivElement>(null)
    
    const form = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            keyword: "",
            location: "",
            range: "50"
        },
    })

    const locationValue = form.watch('location')

    useEffect(() => {
        const handleAutocomplete = async () => {
            const res = await fetch(`api/locationAutocomplete?` + new URLSearchParams({
                searchValue: locationValue
            }))
            const body = await res.json()
            locationOptionsRef.current = body
            setLocationOptions(body)
            setOpen(true)
        }
       
        if (locationValue.length >= 3 && !locationOptionsRef.current.find(l => l.toLowerCase() === locationValue.toLowerCase())) {
            handleAutocomplete()
        } else {
            setOpen(false)
        }        
    },[locationValue])

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

    return  (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(searchHandler)} className="">
                <div className="flex flex-col gap-5 w-full h-1/2 max-w-lg">
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Find your next motorcycle.</h1>
                    <div className="w-full">
                        <FormField
                            control={form.control}
                            name="keyword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Search by keyword" {...field} />
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
                                            <Input placeholder="ZIP or City, State" {...field} />
                                        </FormControl>
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
                                        onSelect={(currentValue) => {
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
                                        <Select onValueChange={field.onChange}>
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue placeholder="50 mi." />
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
                    <Button className="self-center" type="submit">Search</Button>
                </div>
            </form>
        </Form>
    )
}