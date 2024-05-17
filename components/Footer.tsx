import { Separator } from "@/components/ui/separator"
import { Mail } from 'lucide-react'

export function Footer() {
    return (
        <div className='w-3/4 font-light flex flex-col justify-center items-center gap-2'>
            <h2 className="text-lg tracking-tight">
                <p>Currently only aggregates <span className='font-normal'>California dealerships</span>.</p>  
                <Separator className='bg-slate-800 dark:bg-slate-200 w-3/4 mx-auto mt-1'/>
            </h2>
            <p> 
                <span className='flex items-center gap-2 text-sm'><Mail size={17}/> botjameschulz@gmail.com</span>
            </p>
        </div>
)
}