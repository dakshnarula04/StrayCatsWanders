import type { TripData } from '../types';

const BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000';

function toTripData(row: any): TripData {
  return {
    id: row.id || '',
    title: String(row.title || ''),
    location: String(row.location || ''),
    date: String(row.date || ''),
    imageUrl: String(row.image_url || ''),
    imageAlt: String(row.image_alt || ''),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    excerpt: String(row.excerpt || ''),
    featured: Boolean(row.featured),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Request failed');
  return json.data as T;
}

export const tripApi = {
  async getAll(): Promise<TripData[]> {
    const res = await fetch(`${BASE}/api/trips`, {
      credentials: 'include',
    });
    const data = await handleResponse<any[]>(res);
    return (data || []).map(toTripData);
  },

  async create(formData: FormData, token: string): Promise<TripData> {
    const res = await fetch(`${BASE}/api/trips`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
      credentials: 'include',
    });
    const data = await handleResponse<any>(res);
    return toTripData(data);
  },

  async update(id: string | number, body: Partial<TripData> | FormData, token: string): Promise<TripData> {
    const isFormData = body instanceof FormData;
    const res = await fetch(`${BASE}/api/trips/${id}`, {
      method: 'PATCH',
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        'Authorization': `Bearer ${token}`
      },
      body: isFormData ? body : JSON.stringify(body),
      credentials: 'include',
    });
    const data = await handleResponse<any>(res);
    return toTripData(data);
  },

  async delete(id: string | number, token: string): Promise<void> {
    const res = await fetch(`${BASE}/api/trips/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
    });
    
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error || 'Delete failed');
    }
  }
};
