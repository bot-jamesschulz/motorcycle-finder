'use client'
import { useRef, useCallback } from 'react'
import Image from 'next/image'
import { Loading } from '@/app/page'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Database } from '@/lib/database.types';
import { MapPin, Gauge, Ruler } from 'lucide-react';

export type ListingsRow = Database['public']['Functions']['keyword_proximity_search']['Returns'];

type SearchProps = {
    listings: ListingsRow[]
    fetchListings: () => Promise<void>
    loadingState: Loading
}

export function Results({ listings, fetchListings, loadingState }:  SearchProps ) {
    const observer = useRef<IntersectionObserver>()

    // Infinite scroll handler 
    const fetchTrigger = useCallback((node: HTMLAnchorElement) => {
        if (!node) return
        if (loadingState === 'loading') return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                fetchListings()
            }
        })
        observer.current.observe(node)

    },[fetchListings, loadingState])

    return (
    <div className='flex flex-wrap justify-center items-center gap-5 max-w-screen-xl'>
        {listings.length > 0 ? 
            listings?.map(({ make, model, year, price, mileage, condition, detailsUrl, imgSrc, distance, city, dealerName}, index) => {
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
                const dealerNameWords = dealerName.split(' ');
                const dealerNameTrunc = dealerNameWords?.slice(0,3).map(word => word + ' ').join('').trim();
                const dealerNameFinal = dealerNameWords.length < 3 ? dealerNameTrunc : dealerNameTrunc + '...'

                return (
                    <a key={detailsUrl} href={detailsUrl} rel='external' target='_blank' ref={
                        index === listings.length - 4  
                            ? fetchTrigger
                            : null
                    }>
                    <Card className='flex flex-col justify-start items-center overflow-hidden sm:flex-row sm:w-[600px] sm:h-[200px] sm:items-start' >
                        <div className='w-[250px] h-[200px]'>
                            <Image 
                                src={imgSrc || ''}
                                width={1000}
                                height={1000}
                                alt=''
                                className='object-cover w-56 h-full rounded'
                            />    
                        </div>     
                        <div className='grow h-full flex flex-col justify-between w-3/4'>       
                            <CardHeader className='w-full'>
                                <CardTitle className='flex justify-between'><span>{make.toUpperCase()} {model?.toUpperCase()}</span><span className='font-normal leading-none tracking-tight'>{formattedPrice}</span></CardTitle>
                                <CardDescription className='flex justify-between text-md'><span>{year}</span><span>{conditionFinal}</span></CardDescription>
                            </CardHeader>   
                            <CardContent className='flex flex-col gap-1 text-slate-600 text-sm'>
                                {mileage && conditionFinal === 'Used' &&
                                    <div className='flex items-center gap-1'>
                                        <Gauge className='text-slate-800 self-center' size={15} strokeWidth={2}/><span className='font-normal'>{formattedMileage} miles</span>
                                    </div>}   
                                    <div className='flex gap-1  text-slate-500'>
                                        <MapPin className='text-slate-800 self-center' size={15} strokeWidth={1.5}/> {city}
                                    </div>               
                                <div className='flex justify-between items-end text-slate-500'>
                                    <div className='flex gap-1 self-start'>
                                        <Ruler className='text-slate-800 self-center' size={15} strokeWidth={2}/>{distanceInMiles?.toFixed(2)} miles away
                                    </div>
                                    <div className=' text-xs text-right w-36 text-slate-400 font-light'>{dealerNameFinal}</div>
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

