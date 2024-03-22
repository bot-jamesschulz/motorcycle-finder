import Supabase from '@/lib/dbConfig';
import { type NextRequest } from 'next/server'
import locations from '@/public/USCities'
import Fuse from 'fuse.js'

const fuseOptions = {
	includeScore: true,
	includeMatches: true,
	threshold: 0.4,
	keys: [
		"zipCode",
		"city"
	]
};

const fuse = new Fuse(locations, fuseOptions);

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams
	const keyword = searchParams.get('keyword') || ''
    const location = searchParams.get('location')
    const range = milesToMeters(Number(searchParams.get('range')))

    if (!location) return Response.json([]);

    // Find closest matching location
    const fuseResults = fuse
        .search(location)
        .filter(res => res.item.state === 'CA')

    console.log(fuseResults)

    const match = fuseResults?.[0]

    if (!match) {
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

    console.log('calling rpc with:', {
        x: coords.longitude,
        y: coords.latitude,
        range,
        keyword
    })

    const { data, error } = await Supabase.rpc('keyword_proximity_search', {
        x: coords.longitude,
        y: coords.latitude,
        range,
        keyword
    })

    if (error) {
        return new Response(null, { status: 500})
    }

    console.log(data.slice(0,5))

return Response.json(data)
}

function milesToMeters(miles: number): number {
    const defaultMiles = 50;
    return Math.round(1609.344 * (miles || defaultMiles))
}

