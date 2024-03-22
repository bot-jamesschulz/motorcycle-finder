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
	const searchPattern = searchParams.get('searchValue');

	if (!searchPattern) return Response.json([]);

	const fuseResults = fuse.search(searchPattern);

	const locationOptions: string[] = []

	fuseResults.forEach(res => {
		const item = res.item

		if (item.state !== 'CA') return

		const location = `${item.city}, ${item.state}`

		if (!locationOptions.includes(location) && locationOptions.length < 10) {
			locationOptions.push(location)
		}

	});

	return Response.json(locationOptions)
}