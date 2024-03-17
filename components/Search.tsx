"use client"

import { SubmitHandler } from "react-hook-form"
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"

export const FormSchema = z.object({
    keyword: z.string(),
    location: z.string(),
    proximity: z.enum(['10','25','50','75','100','200','500'])
})

export type FormSchemaType = z.infer<typeof FormSchema>

export function Search({ searchHandler }: { searchHandler: SubmitHandler<FormSchemaType>}) {
    const form = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            keyword: "",
            location: "",
            proximity: "50"
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(searchHandler)} className="w-2/3 space-y-6">
                <div className="flex flex-col gap-5 w-full h-1/2 max-w-lg">
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Find your next motorcycle.</h1>
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
                    <FormField
                        control={form.control}
                        name="proximity"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Select onValueChange={field.onChange}>
                                        <SelectTrigger className="w-[180px]">
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
                    <Button className="self-center" type="submit">Search</Button>
                </div>
            </form>
        </Form>
    )
}
