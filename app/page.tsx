'use client'

import * as React from 'react'
import { useSupabaseContext } from "@/app/contexts/supabaseContext"
import { useLoadingContext } from "@/app/contexts/loadingContext"
import { 
  useFilters, 
  milesToMeters 
} from '@/lib/utils'
import type {
  ListingsRow
} from '@/app/motorcycles-for-sale/page'
import { MapPin, Gauge, Ruler } from "lucide-react"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


export default function Home() {
  const Supabase = useSupabaseContext()
  const { keywordFilter, makeFilter, modelFilter, long, lat, rangeFilter, priceFilter, yearFilter, hideNullPrices, page, sort } = useFilters()
  const { loadingState, setLoadingState } = useLoadingContext()
  const [listings, setListings] = React.useState<ListingsRow[]>([])

  // listings fetch
  React.useEffect(() => {
    const fetchListings = async () => {

        if (!Supabase) return;
        setLoadingState('loading')

        const { data, error } = await Supabase.rpc("proximity_search", {
            x: long,
            y: lat,
            range: milesToMeters(Number(rangeFilter)),
            keyword: keywordFilter,
            sortMethod: sort,
            makeFilter,
            modelFilter,
            priceFilter: [10_000, 40_000],
            hideNullPrices: true,
            yearFilter,
            pageNum: page
        })

        if (error) {
            console.error("Error fetching listings", error)
            return
        }

        setLoadingState("loaded");

        if (!data?.length && page === '0') {
            setLoadingState("no results")
        } else {
            setListings(data)
        }
    }

    fetchListings();
}, []);

  return (
    <div className='flex justify-center items-center m-3'>
      {loadingState === "loaded" && (
        <Carousel opts={{
            align: "start",
            loop: true,
          }}
          className="w-3/4 max-w-sm min-[500px]:max-w-lg md:max-w-2xl lg:max-w-4xl"
        >
          <CarouselContent className="-ml-1">
            {listings?.map(({
                        make,
                        model,
                        year,
                        price,
                        mileage,
                        condition,
                        detailsUrl,
                        imgSrc,
                        distance,
                        city,
                        dealerName
                        },
                        index) => {
                          const formattedPrice = price?.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 0,
                          });
                          const formattedMileage = mileage?.toLocaleString();
                          const conditionFinal =
                          condition &&
                          condition.charAt(0).toUpperCase() +
                              condition.slice(1);
                          const milesConversionFactor = 0.0006213712;
                          const distanceInMiles =
                          distance * milesConversionFactor;

                          return (
              <CarouselItem key={detailsUrl} className="pl-1 min-[500px]:basis-1/2 md:basis-1/3 lg:basis-1/4 shadow-xl">
                <a href={detailsUrl} rel="external" target="_blank">
                            <Card>
                                <div className="w-full flex justify-center items-center shadow-md">
                                  <Image
                                      src={imgSrc || ""}
                                      width={1000}
                                      height={1000}
                                      alt=""
                                      className="object-cover w-full h-56 rounded transition-opacity opacity-0 duration-[0.5s]"
                                      onLoad={(img) => {
                                      if (img.target instanceof HTMLElement) {
                                          img.target.classList.remove(
                                          "opacity-0"
                                          );
                                      }
                                      }}
                                  />
                                </div>
                                <div className="grow h-56 flex flex-col justify-between w-full">
                                  <CardHeader className="w-full">
                                      <CardTitle className="flex justify-between gap-4 text-sm leading-none">
                                      <span>
                                          {make.toUpperCase()}{" "}
                                          {model?.toUpperCase()}
                                      </span>
                                      <span className="font-normal leading-none tracking-tight text-sm">
                                          {formattedPrice}
                                      </span>
                                      </CardTitle>
                                      <CardDescription className="flex justify-between text-sm">
                                      <span>{year}</span>
                                      <span>{conditionFinal}</span>
                                      </CardDescription>
                                  </CardHeader>
                                  <CardContent className="flex flex-col justify-end gap-1 text-slate-600 text-sm">
                                      {mileage && conditionFinal === "Used" && (
                                      <div className="flex items-center gap-1">
                                          <Gauge
                                          className="text-slate-800 self-center"
                                          size={15}
                                          strokeWidth={2}
                                          />
                                          <span className="font-normal">
                                          {formattedMileage} miles
                                          </span>
                                      </div>
                                      )}
                                      <div className="flex gap-1  text-slate-500">
                                      <MapPin
                                          className="text-slate-800 self-center"
                                          size={15}
                                          strokeWidth={1.5}
                                      />{" "}
                                      {city}
                                      </div>
                                      <div className="pl-1 text-xs truncate text-slate-400 font-light">
                                        {dealerName}
                                      </div>
                                  </CardContent>
                                </div>
                            </Card>
                            </a>
              </CarouselItem>
            )})}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}  
    </div>
  );
}


