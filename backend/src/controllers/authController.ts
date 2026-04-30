import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { LoginDTO } from '../types/auth';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  path: '/',
};

export const authController = {

  login: asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body as LoginDTO;

    if (!username || !password) {
      throw new AppError('Username and password are required', 400);
    }

    // Generic delay to prevent timing attacks
    const admin = await authService.findByUsername(username);
    const isValid = admin
      ? await authService.verifyPassword(password, admin.password_hash)
      : await new Promise<boolean>(r => setTimeout(() => r(false), 200));

    if (!admin || !isValid) {
      throw new AppError('Invalid username or password', 401);
    }

    const accessToken  = authService.generateAccessToken(admin.id, admin.username);
    const refreshToken = authService.generateRefreshToken();

    await Promise.all([
      authService.storeRefreshToken(
        admin.id, refreshToken,
        req.headers['user-agent'],
        req.ip
      ),
      authService.updateLastLogin(admin.id),
    ]);

    // Refresh token goes in an httpOnly cookie
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    res.json({
      success: true,
      data: {
        admin: { id: admin.id, username: admin.username, name: admin.name },
        accessToken,
      },
      message: 'Logged in successfully',
    });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const rawToken = req.cookies?.refreshToken;
    if (!rawToken) throw new AppError('No refresh token', 401);

    const result = await authService.validateRefreshToken(rawToken);
    if (!result) throw new AppError('Refresh token expired or invalid', 401);

    const admin = await authService.getAdminById(result.adminId);
    if (!admin) throw new AppError('Admin not found', 401);

    // Rotate refresh token (revoke old, issue new)
    await authService.revokeRefreshToken(rawToken);
    const newRefreshToken = authService.generateRefreshToken();
    await authService.storeRefreshToken(
      admin.id, newRefreshToken,
      req.headers['user-agent'],
      req.ip
    );

    const accessToken = authService.generateAccessToken(admin.id, admin.username);

    res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
    res.json({
      success: true,
      data: {
        admin: { id: admin.id, username: admin.username, name: admin.name },
        accessToken,
      },
    });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const rawToken = req.cookies?.refreshToken;
    if (rawToken) {
      await authService.revokeRefreshToken(rawToken);
    }
    res.clearCookie('refreshToken', { path: '/' });
    res.json({ success: true, message: 'Logged out' });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const admin = await authService.getAdminById(req.admin!.id);
    if (!admin) throw new AppError('Admin not found', 404);
    res.json({
      success: true,
      data: { id: admin.id, username: admin.username, name: admin.name },
    });
  }),
};
