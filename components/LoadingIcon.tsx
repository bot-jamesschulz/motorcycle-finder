'use client'

import { LoaderCircle } from 'lucide-react'
import Moto from '@/public/Moto'
import { useLoadingContext } from '@/app/contexts/loadingContext'


function LoadingIcon() {
    const { loadingState } = useLoadingContext()

    return (
        <div className={`absolute left-1/2 transform -translate-x-1/2 pointer-events-none ${loadingState === 'loading' ? 'opacity-1':  'opacity-0'}`}>
            <div className='relative mt-10 min-w-56 animate-bounce'>
            <Moto />
            <LoaderCircle className="absolute top-[3rem] right-[8.3rem] animate-spin duration-2000" strokeWidth={2.5} size={65} />
            <LoaderCircle className="absolute top-[3.4rem] left-[9.4rem] animate-spin duration-1750" strokeWidth={2} size={58} />
            </div>
        </div>
    )
}

export default LoadingIcon;