import { Separator } from "@/components/ui/separator"
import { Mail } from 'lucide-react'

export function Footer() {
    return (
        <div className='w-3/4 font-light flex flex-col justify-center items-center gap-2'>
            <h2 className="text-lg tracking-tight">
                <p>Currently only aggregates <span className='font-normal'>California dealerships</span>, at the moment.</p>
                
                <p className='mt-2'>Motorcycle Finder offers the most complete dataset of dealership listings available. Listings are sourced directly from each dealer&apos;s website, so it&apos;s not necessary for them to share their inventory in order for their listings to show up.</p>
                
                <Separator className='bg-slate-800 dark:bg-slate-200 w-3/4 mx-auto mt-1'/>
            </h2>
            <p> 
                <span className='flex items-center gap-2 text-sm'><Mail size={17}/> botjameschulz@gmail.com</span>
            </p>
        </div>
)
}