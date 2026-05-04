import { Request, Response } from 'express';
import { tripService } from '../services/tripService';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { CreateTripDTO } from '../types/trip';
import cloudinary from '../config/cloudinary';

export const tripController = {

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const data = await tripService.getAll();
    res.json({ success: true, data });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new AppError('Image file is required', 400);

    const { title, location, date, excerpt, tags, featured } = req.body;
    if (!title || !location || !date || !excerpt) {
      throw new AppError('title, location, date, and excerpt are required', 400);
    }

    const parsedTags: string[] = typeof tags === 'string'
      ? JSON.parse(tags)
      : (tags ?? []);

    const dto: CreateTripDTO = {
      title: title.trim(),
      location: location.trim(),
      date: date.trim(),
      excerpt: excerpt.trim(),
      tags: parsedTags,
      featured: featured === 'true' || featured === true,
      image_url: req.file.path,
      image_alt: `${title} — ${location}`,
    };

    const trip = await tripService.create(dto);
    res.status(201).json({ success: true, data: trip, message: 'Journey added!' });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { title, location, date, excerpt, tags, featured } = req.body;
    const trip = await tripService.update(req.params.id, {
      ...(title && { title }),
      ...(location && { location }),
      ...(date && { date }),
      ...(excerpt && { excerpt }),
      ...(tags && { tags: typeof tags === 'string' ? JSON.parse(tags) : tags }),
      ...(featured !== undefined && { featured: featured === 'true' || featured === true }),
    });
    
    if (!trip) throw new AppError('Journey not found', 404);
    res.json({ success: true, data: trip });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const trip = await tripService.getById(req.params.id);
    if (!trip) throw new AppError('Journey not found', 404);

    // Delete from Cloudinary
    if (trip.image_url.includes('cloudinary')) {
      const publicId = trip.image_url.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`journal/${publicId}`);
      }
    }

    await tripService.delete(req.params.id);
    res.json({ success: true, message: 'Journey removed' });
  }),
};
