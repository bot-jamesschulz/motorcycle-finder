'use client'

import { FormSchemaType, Search } from '@/components/Search';
import Results from '@/components/Results';


export default function Home() {

  const searchHandler = async (values: FormSchemaType) => {
    console.log('formData', { values })
    // const results = await fetch('/api/search');
    // console.log(await results.json());
  }


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col w-full border-2 p-3">
        <Search searchHandler={searchHandler} />
        <Results />   
      </div>
    </div>
  );
}


