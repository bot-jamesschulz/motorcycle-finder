'use client'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Database } from '@/lib/database.types';
import { MapPin, Gauge } from 'lucide-react';

type ListingsRow = Database['public']['Functions']['keyword_proximity_search']['Returns'];

export function Results({ listings }: { listings: ListingsRow[] }) {

    console.log('listings', listings)

    return (
    <div className='flex flex-wrap justify-center items-center gap-5 max-w-screen-xl'>
        {listings.length > 0 ? 
            listings?.slice(0,50)?.map(({ make, model, year, price, mileage, condition, detailsUrl, imgSrc, distance, city, dealerName}) => {
                const formattedPrice = price?.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0
                })
                const formattedMileage = mileage?.toLocaleString()
                const conditionFinal = condition &&
                    condition.charAt(0).toUpperCase() + condition.slice(1)
                const milesConversionFactor = 0.0006213712;
                const distanceInMiles = distance * milesConversionFactor;
                const dealerNameTrunc = dealerName.slice(0,15) + '...'

                return (
                    <a key={detailsUrl} href={detailsUrl} rel='external' target='_blank'>
                    <Card className='flex flex-col justify-start items-center overflow-hidden sm:flex-row sm:w-[600px] sm:h-[200px] sm:items-start' >
                        <div className='w-[250px] h-[200px]'>
                            <Image 
                                src={imgSrc || ''}
                                width={1000}
                                height={1000}
                                alt=''
                                className='object-cover w-full h-full rounded'
                            />    
                        </div>     
                        <div className='grow h-full flex flex-col justify-between'>       
                            <CardHeader className='w-full'>
                                <CardTitle className='flex justify-between'><span>{make.toUpperCase()} {model?.toUpperCase()}</span><span className='text-xl font-normal leading-none tracking-tight'>{formattedPrice}</span></CardTitle>
                                <CardDescription className='flex justify-between text-md'><span>{year}</span><span>{conditionFinal}</span></CardDescription>
                            </CardHeader>   
                            <CardContent className='flex flex-col gap-2'>
                                {mileage && conditionFinal === 'Used' &&
                                    <div className='flex gap-1 text-sm'>
                                        <Gauge className='text-slate-800' size={20} strokeWidth={2}/>{formattedMileage} miles
                                    </div>}                  
                                <div className='flex justify-between text-nowrap text-sm text-slate-500'>
                                    <div className='flex gap-1'>
                                        <MapPin className='text-slate-800 self-center' size={20} strokeWidth={1.5}/>
                                        <div className='flex flex-col'>
                                            <span>{city},</span>
                                            <span>{distanceInMiles?.toFixed(2)} miles away</span>
                                        </div>
                                    </div>
                                    <div className='self-end'>{dealerNameTrunc}</div>
                                </div>
                            </CardContent> 
                        </div>         
                    </Card>
                    </a>
                )})
            : null
        }

    </div>
    )


}

export function NoResults() {
    return (
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-center">
            <p>No listings found.</p>
            <p className="text-sm text-muted-foreground">Try expanding your search radius.</p>
        </h4>
    )
}

