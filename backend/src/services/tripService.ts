import { query } from '../config/db';
import { TripRow, CreateTripDTO, UpdateTripDTO } from '../types/trip';

export const tripService = {

  async getAll(): Promise<TripRow[]> {
    const result = await query<TripRow>(
      `SELECT * FROM trips ORDER BY featured DESC, created_at DESC`
    );
    return result.rows;
  },

  async getById(id: string): Promise<TripRow | null> {
    const result = await query<TripRow>(
      `SELECT * FROM trips WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  },

  async create(dto: CreateTripDTO): Promise<TripRow> {
    const result = await query<TripRow>(
      `INSERT INTO trips (title, location, date, image_url, image_alt, tags, excerpt, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [dto.title, dto.location, dto.date, dto.image_url, dto.image_alt ?? null,
       JSON.stringify(dto.tags), dto.excerpt, dto.featured]
    );
    return result.rows[0];
  },

  async update(id: string, dto: UpdateTripDTO): Promise<TripRow | null> {
    const fields = Object.entries(dto).filter(([, v]) => v !== undefined);
    if (fields.length === 0) throw new Error('No fields to update');
    
    const setClauses = fields.map(([k], i) => {
      if (k === 'tags') return `${k} = $${i + 2}::jsonb`;
      return `${k} = $${i + 2}`;
    }).join(', ');
    
    const values = fields.map(([k, v]) => k === 'tags' ? JSON.stringify(v) : v);
    
    const result = await query<TripRow>(
      `UPDATE trips SET ${setClauses} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0] ?? null;
  },

  async delete(id: string): Promise<boolean> {
    const result = await query(
      `DELETE FROM trips WHERE id = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }
};
