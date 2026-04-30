import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { AppError } from './errorHandler';

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const payload = authService.verifyAccessToken(token);

    if (payload.type !== 'access') {
      throw new AppError('Invalid token type', 401);
    }

    req.admin = { id: payload.adminId, username: payload.username };
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 401));
    } else if (err.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else {
      next(err);
    }
  }
};
