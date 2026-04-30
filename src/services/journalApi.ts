import type { JournalEntry } from '../types';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

// Helper — map DB row shape (snake_case) → frontend type (camelCase)
function toJournalEntry(row: any): JournalEntry {
  return {
    id:        row.id,
    caption:   row.caption,
    location:  row.location,
    date:      row.date_label,
    story:     row.story ?? undefined,
    tags:      row.tags,
    rotation:  parseFloat(row.rotation),
    imageUrl:  row.image_url,
    imageAlt:  row.image_alt,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? 'Request failed');
  return json.data as T;
}

export const journalApi = {

  async getAll(params?: { page?: number; limit?: number; tag?: string }): Promise<{
    entries: JournalEntry[];
    total: number;
    page: number;
    limit: number;
  }> {
    const sp = new URLSearchParams();
    if (params?.page)  sp.set('page',  String(params.page));
    if (params?.limit) sp.set('limit', String(params.limit));
    if (params?.tag)   sp.set('tag',   params.tag);
    const res = await fetch(`${BASE}/api/journal?${sp}`, {
      credentials: 'include',
    });
    const data = await handleResponse<any>(res);
    return {
      entries: data.entries.map(toJournalEntry),
      total:   data.total,
      page:    data.page,
      limit:   data.limit,
    };
  },

  async getById(id: string): Promise<JournalEntry> {
    const res = await fetch(`${BASE}/api/journal/${id}`, {
      credentials: 'include',
    });
    const row = await handleResponse<any>(res);
    return toJournalEntry(row);
  },

  async create(formData: FormData, token: string): Promise<JournalEntry> {
    const res = await fetch(`${BASE}/api/journal`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,   // multipart — do NOT set Content-Type header, let browser set boundary
      credentials: 'include',
    });
    const row = await handleResponse<any>(res);
    return toJournalEntry(row);
  },

  async update(id: string, body: {
    caption?: string;
    location?: string;
    date_label?: string;
    story?: string;
    tags?: string[];
  }, token: string): Promise<JournalEntry> {
    const res = await fetch(`${BASE}/api/journal/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    const row = await handleResponse<any>(res);
    return toJournalEntry(row);
  },

  async delete(id: string, token: string): Promise<void> {
    const res = await fetch(`${BASE}/api/journal/${id}`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error ?? 'Delete failed');
    }
  },

  async getTags(): Promise<string[]> {
    const res = await fetch(`${BASE}/api/journal/tags`);
    return handleResponse<string[]>(res);
  },
};
