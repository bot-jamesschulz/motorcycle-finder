'use client'

import * as React from 'react'
import type { Loading } from '@/lib/defaults'

type LoadingContext = {
    loadingState: Loading,
    setLoadingState: React.Dispatch<React.SetStateAction<Loading>>
}

export const LoadingContext = React.createContext<LoadingContext | null>(null)

export default function LoadingContextProvider({children}: { children: React.ReactNode }) {
    const [loadingState, setLoadingState] = React.useState<Loading | undefined>()

    return (
        <LoadingContext.Provider value={{loadingState, setLoadingState}}>
            {children}
        </LoadingContext.Provider>
        
    )
}

export function useLoadingContext() {
    const context = React.useContext(LoadingContext)
    if (!context) {
        throw new Error(
            "useLoadingContext must be used within a LoadingContextProvider"
        )
    }

    return context
}