import Supabase from '@/lib/dbConfig'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {

    // Extract query params
    const searchParams = request.nextUrl.searchParams
	const keyword = searchParams.get('keyword') || ''
    const x = Number(searchParams.get('x'))
    const y = Number(searchParams.get('y'))
    const range = Number(searchParams.get('range'))
    const pageNum = Number(searchParams.get('pageNum'))

    if (!x || !y || !range) return Response.json([]);

    if (!Supabase) {
        return new Response(null, { status: 500})
    }

    const query = {
        x,
        y,
        range,
        keyword,
        pageNum
    }

    const { data, error } = await Supabase.rpc('keyword_proximity_search', query)

    if (error) {
        console.log('Error fetching listings', error)
        return new Response(null, { status: 500})
    }

return Response.json({ data, query })
}
