import multer from 'multer';
import sharp from 'sharp';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_SIZE = Number(process.env.MAX_FILE_SIZE_MB ?? 5) * 1024 * 1024;

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
    const processedBuffer = await sharp(req.file.buffer)
      .rotate()
      .resize(900, 900, {
        fit: 'cover',
        position: 'centre',
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer();

    // Upload to Cloudinary
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'journal',
          resource_type: 'image',
          format: 'webp',
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET ?? 'journal_upload',
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error('Cloudinary upload failed'));
        }
      );
      uploadStream.end(processedBuffer);
    });

    // Store the secure URL and Public ID in the file object
    req.file.path = uploadResult.secure_url;
    req.file.filename = uploadResult.public_id;

    next();
  } catch (err) {
    console.error('Upload Error:', err);
    next(new AppError('Image processing or upload failed', 500));
  }
};
