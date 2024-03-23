import { type NextRequest } from 'next/server'
import fuse from '@/lib/fuse'

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const searchPattern = searchParams.get('searchValue');

	console.log('before fuze autocomplete:', new Date())

	if (!searchPattern) return Response.json([]);

	const fuseResults = fuse.search(searchPattern);

	if (!fuseResults[0]?.score || fuseResults[0].score < 0.0001 && searchPattern.length >= 5) 
		return Response.json([])

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

	console.log('after fuze autocomplete:', new Date())

	return Response.json(locationOptions)
}