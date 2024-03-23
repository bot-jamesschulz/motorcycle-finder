import Supabase from '@/lib/dbConfig'
import { type NextRequest } from 'next/server'
import fuse from '@/lib/fuse'

export async function GET(request: NextRequest) {

    // Extract query params
    const searchParams = request.nextUrl.searchParams
	const keyword = searchParams.get('keyword') || ''
    const location = searchParams.get('location')
    const range = milesToMeters(Number(searchParams.get('range')))

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

    const { data, error } = await Supabase.rpc('keyword_proximity_search', {
        x: coords.longitude,
        y: coords.latitude,
        range,
        keyword
    })

    if (error) {
        return new Response(null, { status: 500})
    }

return Response.json(data)
}

function milesToMeters(miles: number): number {
    const defaultMiles = 50;
    return Math.round(1609.344 * (miles || defaultMiles))
}

