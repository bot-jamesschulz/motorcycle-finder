'use client'
import { 
    useRef,
    useCallback,
    type Dispatch,
    type SetStateAction
 } from 'react'
import Image from 'next/image'
import type { 
    Loading,
    ListingsRow,
    Query 
} from '@/app/page'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MapPin, Gauge, Ruler } from 'lucide-react';

type SearchProps = {
    listings: ListingsRow[]
    endOfListings: boolean
    keyword: string
    setQuery: Dispatch<SetStateAction<Query>>
    loadingState: Loading
}

export const bestMatchThreshold = 1.1

export function Results({ listings, endOfListings, keyword, setQuery, loadingState }:  SearchProps ) {
    const observer = useRef<IntersectionObserver>()

    // Infinite scroll handler 
    const fetchTrigger = useCallback((node: HTMLAnchorElement) => {

        if (!node) return
        if (loadingState === 'loading') return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting && !endOfListings) {
                setQuery((prev) => ({
                    ...prev,
                    pageNum: ++prev.pageNum
                }))
            }
        })
        observer.current.observe(node)

    }, [loadingState, setQuery, endOfListings])

    return (
    <div className='flex flex-col justify-center items-center gap-4'>
        {listings.length && (
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                {keyword === '' ? 'Matches' : 
                    listings[0].matchScore >= bestMatchThreshold 
                        ? 'Best Matches'
                        : 'Possible Matches'

                }
            </h4>
        )}
            
        <div className='flex flex-wrap justify-center items-center gap-5 max-w-screen-xl'>
            {listings.length ? 
                listings?.map(({ make, model, year, price, mileage, condition, detailsUrl, imgSrc, distance, city, dealerName, matchScore}, index) => {
                    
                    const formattedPrice = price?.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0
                    })
                    const formattedMileage = mileage?.toLocaleString()
                    const conditionFinal = condition &&
                        condition.charAt(0).toUpperCase() + condition.slice(1)
                    const milesConversionFactor = 0.0006213712
                    const distanceInMiles = distance * milesConversionFactor
                    const possibleMatches = (listings[index-1]?.matchScore >= bestMatchThreshold) && matchScore < bestMatchThreshold
                    
                    return (
                        <div key={detailsUrl} className={`${possibleMatches && 'flex flex-wrap basis-full justify-center'}`}>  
                            {possibleMatches && <h4 className="basis-full text-center scroll-m-20 m-24 text-xl font-semibold tracking-tight">Possible Matches</h4>}
                            <a  href={detailsUrl} rel='external' target='_blank' ref={
                                index === listings.length - 4  
                                    ? fetchTrigger
                                    : null
                            }>
                            <Card className='flex flex-col justify-start items-center overflow-hidden min-w-[300px] w-[300px] xs:w-[350px] sm:min-w-full sm:max-w-full sm:flex-row sm:w-[600px] sm:h-[200px] sm:items-start' >
                                <div className='w-full sm:w-[250px] sm:h-[200px] flex justify-center items-center'>
                                    <Image 
                                        src={imgSrc || ''}
                                        width={1000}
                                        height={1000}
                                        alt=''
                                        className='object-cover w-full h-56 sm:w-56 sm:h-full rounded transition-opacity opacity-0 duration-[0.5s]'
                                        onLoad={(img) => {
                                            if (img.target instanceof HTMLElement) {
                                                img.target.classList.remove('opacity-0')
                                            }
                                        }}
                                    />    
                                </div>     
                                <div className='grow h-full flex flex-col justify-between w-full sm:w-3/4'>       
                                    <CardHeader className='w-full'>
                                        <CardTitle className='flex justify-between gap-4'><span>{make.toUpperCase()} {model?.toUpperCase()}</span><span className='font-normal leading-none tracking-tight'>{formattedPrice}</span></CardTitle>
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
                                                <Ruler className='text-slate-800 self-center' size={15} strokeWidth={2}/>{Math.trunc(distanceInMiles)} miles away
                                            </div>
                                            <div className=' text-xs truncate text-right w-36 text-slate-400 font-light'>{dealerName}</div>
                                        </div>
                                    </CardContent> 
                                </div>         
                            </Card>
                            </a>
                        </div>
                    )})
                : null
            }

        </div>
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

