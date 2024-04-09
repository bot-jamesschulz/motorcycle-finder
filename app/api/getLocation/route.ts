import { type NextRequest } from 'next/server'
import fuse from '@/lib/fuse'

export async function GET(request: NextRequest) {

    // Extract query params
    const location = request
        .nextUrl
        .searchParams
        .get('location')
    
        console.log('location queryParam', location)

    if (!location) return Response.json([]);

    // Find closest matching location
    const fuseResults = fuse.search(location)

    const match = fuseResults?.[0]

    if (!match || match?.item?.state != 'California') {
        return Response.json('Location not found', {
            status: 404
        })
    }

    const coords = { x: match.item.longitude, y: match.item.latitude }
    
    console.log('matched location', match);
	console.log('coordinates', coords);


return Response.json({ x: coords.x, y: coords.y, zipCode: match.item.zipCode })
}



