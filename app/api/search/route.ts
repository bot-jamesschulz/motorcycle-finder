import Supabase from '@/lib/dbConfig'
import { type NextRequest } from 'next/server'
import fuse from '@/lib/fuse'
import { SortMethod } from '@/components/Sort'

const defaultZip = '93654'

export async function GET(request: NextRequest) {

    // Extract query params
    const searchParams = request.nextUrl.searchParams
	const keyword = searchParams.get('keyword') || ''
    const location = searchParams.get('location') === '' 
        ? defaultZip 
        : searchParams.get('location')
    const range = Number(searchParams.get('range'))
    const sortMethod: SortMethod = searchParams.get('sortMethod') as SortMethod

    if (!location) return Response.json([]);

    // Find closest matching location
    const fuseResults = fuse.search(location)

    const match = fuseResults?.[0]

    if (!match || match?.item?.state != 'California') {
        return Response.json('Location not found', {
            status: 404
        })
    }

    const coords = { longitude: match.item.longitude, latitude: match.item.latitude }
    
    console.log('matched location', match);
	console.log('coordinates', coords)

    if (!Supabase) {
        return new Response(null, { status: 500})
    }

    const query = {
        x: coords.longitude,
        y: coords.latitude,
        range,
        keyword,
        sortMethod
    }

    console.log('query search', query)

    const { data, error } = await Supabase.rpc('keyword_proximity_search', query)
    
    if (error) {
        return new Response(null, { status: 500})
    }

return Response.json({ data, query })
}



