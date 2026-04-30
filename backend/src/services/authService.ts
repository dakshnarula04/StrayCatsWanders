import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { query } from '../config/db';
import { AdminRow, TokenPayload } from '../types/auth';

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXP     = process.env.ACCESS_TOKEN_EXPIRES  ?? '15m';
const REFRESH_EXP    = process.env.REFRESH_TOKEN_EXPIRES ?? '7d';

export const authService = {

  async findByUsername(username: string): Promise<AdminRow | null> {
    const result = await query<AdminRow>(
      `SELECT * FROM admins WHERE username = $1`,
      [username.toLowerCase().trim()]
    );
    return result.rows[0] ?? null;
  },

  async verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  },

  async updateLastLogin(adminId: string): Promise<void> {
    await query(
      `UPDATE admins SET last_login = NOW() WHERE id = $1`,
      [adminId]
    );
  },

  generateAccessToken(adminId: string, username: string): string {
    const payload: TokenPayload = { adminId, username, type: 'access' };
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXP } as jwt.SignOptions);
  },

  generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  },

  async storeRefreshToken(
    adminId: string,
    rawToken: string,
    userAgent?: string,
    ip?: string
  ): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    // 7 days from now
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await query(
      `INSERT INTO refresh_tokens (admin_id, token_hash, expires_at, user_agent, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [adminId, tokenHash, expiresAt, userAgent ?? null, ip ?? null]
    );
  },

  async validateRefreshToken(rawToken: string): Promise<{ adminId: string } | null> {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const result = await query<{ admin_id: string }>(
      `SELECT admin_id FROM refresh_tokens
       WHERE token_hash = $1 AND expires_at > NOW()`,
      [tokenHash]
    );
    return result.rows[0] ? { adminId: result.rows[0].admin_id } : null;
  },

  async revokeRefreshToken(rawToken: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    await query(`DELETE FROM refresh_tokens WHERE token_hash = $1`, [tokenHash]);
  },

  async revokeAllTokens(adminId: string): Promise<void> {
    await query(`DELETE FROM refresh_tokens WHERE admin_id = $1`, [adminId]);
  },

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
  },

  async getAdminById(id: string): Promise<AdminRow | null> {
    const result = await query<AdminRow>(
      `SELECT * FROM admins WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  },
};
