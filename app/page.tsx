'use client'

import { FormSchemaType, Search } from '@/components/Search'
import { useState } from 'react'
import { Results, ListingType } from '@/components/Results'

export default function Home() {
  const [listings, setListings] = useState<ListingType[]>([])

  const searchHandler = async (values: FormSchemaType) => {
    const results = await fetch(`/api/search?` + new URLSearchParams({
      keyword: values.keyword,
      location: values.location,
      range: values.range
  }));
    setListings(await results.json())
  }


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center w-full p-3">
        <Search searchHandler={searchHandler} />
        <Results listings={listings} />   
      </div>
    </div>
  );
}


