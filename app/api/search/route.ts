export async function GET() {
const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
    'Content-Type': 'application/json',
    'API-Key': 'asdsad',
    },
})
const data = await res.json()

return Response.json({ data })
}