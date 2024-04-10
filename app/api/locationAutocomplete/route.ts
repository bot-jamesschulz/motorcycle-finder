import { type NextRequest } from 'next/server'
import fuse from '@/lib/fuse'
const limitedStates = ['California']

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const searchPattern = searchParams.get('searchValue');

	if (!searchPattern) return Response.json([]);

	const fuseResults = fuse.search(searchPattern);

	const locationOptions: string[] = []

	for (const res of fuseResults) {
		
		const item = res.item

		if (!limitedStates.includes(item.state) || !res.score || !res.matches) continue

		if (res?.score < 0.0001 &&
			res.matches[0].key === 'zipCode') {
			break
		}

		const location = `${item.city}, ${item.state}`

		if (!locationOptions.includes(location) && locationOptions.length < 10) {
			locationOptions.push(location)
		}

	};

	return Response.json(locationOptions)
}