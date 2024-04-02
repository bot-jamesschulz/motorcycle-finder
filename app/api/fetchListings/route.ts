import Supabase from '@/lib/dbConfig'
import { type NextRequest } from 'next/server'
import { SortMethod } from '@/components/Sort'

export async function GET(request: NextRequest) {

    // Extract query params
    const searchParams = request.nextUrl.searchParams
	const keyword = searchParams.get('keyword') || ''
    const x = Number(searchParams.get('x'))
    const y = Number(searchParams.get('y'))
    const range = Number(searchParams.get('range'))
    const pageNum = Number(searchParams.get('pageNum'))
    const sortMethod: SortMethod = searchParams.get('sortMethod') as SortMethod

    if (!x || !y || !range) return Response.json([]);

    if (!Supabase) {
        return new Response(null, { status: 500})
    }

    const query = {
        x,
        y,
        range,
        keyword,
        pageNum,
        sortMethod
    }

    console.log('query fetchListings', query)

    const { data, error } = await Supabase.rpc('keyword_proximity_search', query)

    if (error) {
        console.log('Error fetching listings', error)
        return new Response(null, { status: 500})
    }

return Response.json({ data, query })
}
