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

export type ListingType = {
    make: string,
    model: string,
    year: number,
    condition: string | null,
    detailsurl: string,
    imgsrc: string
}

export function Results({ listings }: { listings: ListingType[] }) {

    console.log('listings', listings)
    console.log('listings length', listings.length)
    console.log('listings type', typeof listings)

    return (
    <div className='flex flex-wrap justify-center items-center gap-5 max-w-screen-md'>
        {listings.length > 0 ? 
            listings?.slice(0,50)?.map(({ make, model, year, condition, detailsurl, imgsrc }) => (
                <a key={detailsurl} href={detailsurl} rel='external' target='_blank'>
                <Card className='basis-1/2 overflow-hidden' >
                    <Image 
                        src={imgsrc}
                        width={1000}
                        height={1000}
                        alt=''
                        className='object-contain w-[250px] h-[200px]'
                    />                
                    <CardHeader>
                        <CardTitle>{make.toUpperCase()} {model.toUpperCase()} </CardTitle>
                        <CardDescription className='flex justify-between'><span>{year}</span><span>{condition}</span></CardDescription>
                    </CardHeader>             
                </Card>
                </a>
            ))
            : null
        }

    </div>
    )


}