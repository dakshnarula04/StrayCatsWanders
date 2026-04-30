import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { journalService } from '../services/journalService';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { CreateJournalEntryDTO } from '../types/journal';

const BASE_URL = process.env.BACKEND_URL ?? `http://localhost:${process.env.PORT ?? 4000}`;

export const journalController = {

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const page  = Math.max(1, parseInt(req.query.page  as string ?? '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string ?? '20', 10)));
    const tag   = req.query.tag as string | undefined;
    const data  = await journalService.getAll(page, limit, tag);
    res.json({ success: true, data });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const entry = await journalService.getById(req.params.id);
    if (!entry) throw new AppError('Journal entry not found', 404);
    res.json({ success: true, data: entry });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new AppError('Image file is required', 400);

    const { caption, location, date_label, story, tags, rotation } = req.body;
    if (!caption || !location || !date_label) {
      throw new AppError('caption, location, and date_label are required', 400);
    }

    const parsedTags: string[] = typeof tags === 'string'
      ? JSON.parse(tags)
      : (tags ?? []);

    const parsedRotation = parseFloat(rotation ?? '0');
    if (isNaN(parsedRotation) || parsedRotation < -5 || parsedRotation > 5) {
      throw new AppError('rotation must be a number between -5 and 5', 400);
    }

    const imageUrl = `${BASE_URL}/uploads/${req.file.filename}`;
    const imageAlt = `${caption} — ${location}`;

    const dto: CreateJournalEntryDTO = {
      caption: caption.trim().substring(0, 100),
      location: location.trim().substring(0, 150),
      date_label: date_label.trim().substring(0, 50),
      story: story?.trim() ?? undefined,
      tags: parsedTags.slice(0, 8),
      rotation: parsedRotation,
      image_url: imageUrl,
      image_alt: imageAlt,
    };

    const entry = await journalService.create(dto);
    res.status(201).json({ success: true, data: entry, message: 'Memory pinned!' });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { caption, location, date_label, story, tags } = req.body;
    const entry = await journalService.update(req.params.id, {
      ...(caption    && { caption }),
      ...(location   && { location }),
      ...(date_label && { date_label }),
      ...(story      !== undefined && { story }),
      ...(tags       && { tags: typeof tags === 'string' ? JSON.parse(tags) : tags }),
    });
    if (!entry) throw new AppError('Journal entry not found', 404);
    res.json({ success: true, data: entry });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const entry = await journalService.getById(req.params.id);
    if (!entry) throw new AppError('Journal entry not found', 404);

    // Delete image file from uploads
    const filename = path.basename(entry.image_url);
    const filePath = path.join(__dirname, '../../uploads', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await journalService.delete(req.params.id);
    res.json({ success: true, message: 'Memory removed' });
  }),

  getTags: asyncHandler(async (req: Request, res: Response) => {
    const tags = await journalService.getAllTags();
    res.json({ success: true, data: tags });
  }),
};
