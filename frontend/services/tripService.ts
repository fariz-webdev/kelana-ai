// All trip-related API calls live here
// const API_URL = "http://localhost:8000/api/v1"
const API_URL = process.env.NEXT_PUBLIC_API_URL


export interface Trip{
    id: number;
    destination: string;
    days: number;
    budget: number;
    travel_style: string | null;
    category: string;
    daily_budget: number;
    ai_recommendation: string | null;
    created_at: string;
}
export async function getTrips(): Promise<Trip[]> {
  const res = await fetch(`${API_URL}/trips`, { cache: "no-store" })
  return res.json()
}
export async function getTrip(id: number) {
  const res = await fetch(`${API_URL}/trips/${id}`)
  return res.json()
}
export async function generateTrip(data: any) {
  const res = await fetch(`${API_URL}/trips`, {
    method: "POST",
    body: JSON.stringify(data)
  })
  return res.json()
}