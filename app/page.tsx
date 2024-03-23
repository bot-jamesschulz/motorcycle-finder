'use client'

import { FormSchemaType, Search } from '@/components/Search'
import { useState } from 'react'
import { Results, ListingType } from '@/components/Results'

export default function Home() {
  const [listings, setListings] = useState<ListingType[]>([])

  const searchHandler = async (values: FormSchemaType) => {
    const response = await fetch(`/api/search?` + new URLSearchParams({
      keyword: values.keyword,
      location: values.location,
      range: values.range
  }));
    
    if (response.ok) {
      const results = await response.json()
      setListings(results)
    } else {
      console.error(response.status)
      setListings([])
    }
    
  }


  return (
    <div className="flex justify-center items-center min-h-screen border-2">
      <div className="flex flex-col justify-center items-center w-full p-3 gap-10">
        <Search searchHandler={searchHandler} />
        <Results listings={listings} />   
      </div>
    </div>
  );
}


