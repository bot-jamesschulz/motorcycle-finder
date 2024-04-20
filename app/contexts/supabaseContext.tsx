'use client'

import * as React from 'react'
import { Database } from '@/lib/database.types'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
export type SupabasePublic = SupabaseClient<Database, 'public', Database['public']>

let Supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const SupabaseContext = React.createContext<SupabaseClient | null>(null)

export default function SupabaseContextProvider({children}: { children: React.ReactNode }) {

    return (
        <SupabaseContext.Provider value={Supabase}>
            {children}
        </SupabaseContext.Provider>
    )
}

export function useSupabaseContext() {
    const context = React.useContext(SupabaseContext)
    if (!context) {
        throw new Error(
            "useSupabaseContext must be used within a SupabaseContextProvider"
        )
    }

    return context
}