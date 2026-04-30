import { query } from '../config/db';
import { JournalEntryRow, CreateJournalEntryDTO, UpdateJournalEntryDTO, JournalListResponse } from '../types/journal';

export const journalService = {

  async getAll(page = 1, limit = 20, tag?: string): Promise<JournalListResponse> {
    const offset = (page - 1) * limit;
    
    const countQuery = tag
      ? `SELECT COUNT(*) FROM journal_entries WHERE $1 = ANY(tags)`
      : `SELECT COUNT(*) FROM journal_entries`;
    const countParams = tag ? [tag] : [];
    const countResult = await query<{ count: string }>(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count, 10);

    const dataQuery = tag
      ? `SELECT * FROM journal_entries WHERE $1 = ANY(tags) ORDER BY created_at DESC LIMIT $2 OFFSET $3`
      : `SELECT * FROM journal_entries ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
    const dataParams = tag ? [tag, limit, offset] : [limit, offset];
    const result = await query<JournalEntryRow>(dataQuery, dataParams);

    return { entries: result.rows, total, page, limit };
  },

  async getById(id: string): Promise<JournalEntryRow | null> {
    const result = await query<JournalEntryRow>(
      `SELECT * FROM journal_entries WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  },

  async create(dto: CreateJournalEntryDTO): Promise<JournalEntryRow> {
    const result = await query<JournalEntryRow>(
      `INSERT INTO journal_entries (caption, location, date_label, story, tags, rotation, image_url, image_alt)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [dto.caption, dto.location, dto.date_label, dto.story ?? null,
       dto.tags, dto.rotation, dto.image_url, dto.image_alt]
    );
    return result.rows[0];
  },

  async update(id: string, dto: UpdateJournalEntryDTO): Promise<JournalEntryRow | null> {
    const fields = Object.entries(dto).filter(([, v]) => v !== undefined);
    if (fields.length === 0) throw new Error('No fields to update');
    const setClauses = fields.map(([k], i) => `${k} = $${i + 2}`).join(', ');
    const values = fields.map(([, v]) => v);
    const result = await query<JournalEntryRow>(
      `UPDATE journal_entries SET ${setClauses} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0] ?? null;
  },

  async delete(id: string): Promise<boolean> {
    const result = await query(
      `DELETE FROM journal_entries WHERE id = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  },

  async getAllTags(): Promise<string[]> {
    const result = await query<{ tag: string }>(
      `SELECT DISTINCT unnest(tags) AS tag FROM journal_entries ORDER BY tag`
    );
    return result.rows.map(r => r.tag);
  },
};
