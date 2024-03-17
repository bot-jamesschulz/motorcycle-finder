import Supabase from '@/lib/dbConfig';

export async function GET(request: Request) {

if (!Supabase) {
    return new Response(null, { status: 500})
}

let { data: listings, error } = await Supabase
    .from('listings')
    .select()
    .like('detailsUrl', '%arcadia%');

if (error) console.log('Error retrieving results', error)
console.log('Results', listings)


return Response.json({ listings })
}

