import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_SIZE = Number(process.env.MAX_FILE_SIZE_MB ?? 5) * 1024 * 1024;
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(`File type ${file.mimetype} not allowed. Use JPEG, PNG or WebP.`, 400));
    }
  },
});

export const processImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.file) return next();

  try {
    const filename = `journal-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
    const outputPath = path.join(UPLOADS_DIR, filename);

    await sharp(req.file.buffer)
      .rotate()                      // auto-rotate based on EXIF orientation
      .resize(900, 900, {
        fit: 'cover',
        position: 'centre',
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toFile(outputPath);

    req.file.filename = filename;
    req.file.path = outputPath;

    next();
  } catch (err) {
    next(new AppError('Image processing failed', 500));
  }
};
