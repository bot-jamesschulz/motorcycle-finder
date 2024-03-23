import { type NextRequest } from 'next/server'
import locations from '@/public/USCities'
import fuse from '@/lib/fuse'

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const searchPattern = searchParams.get('searchValue');

	if (!searchPattern) return Response.json([]);

	const fuseResults = fuse.search(searchPattern);

	const locationOptions: string[] = []

	console.log(fuseResults?.[0])

	for (const res of fuseResults) {
		
		const item = res.item

		if (item.state !== 'California') continue

		const location = `${item.city}, ${item.state}`

		if (!locationOptions.includes(location) && locationOptions.length < 10) {
			locationOptions.push(location)
		}

	};

	console.log('after fuze search:', new Date())

	return Response.json(locationOptions)
}