'use client'

export type ListingType = {
    make: string,
    model: string,
    year: number,
    condition: string | null,
    detailsUrl: string,
    imgSrc: string
}

export function Results({ listings }: { listings: ListingType[] }) {

    return (
    <div className='flex flex-col'>
        {listings?.slice(0,10).map(listing => (
            <div className='flex gap-2' key={listing.detailsUrl}>
                <div>{listing.make}</div>
                <div>{listing.model}</div>
                <div>{listing.year}</div>
            </div>
        ))}
    </div>
    )


}