import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { createError } from '../middleware/errorHandler';

// Get all sources
export const getSources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sources = await prisma.source.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: sources,
    });
  } catch (error) {
    next(error);
  }
};

// Get single source
export const getSource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const source = await prisma.source.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: true,
            predictions: true,
          },
        },
      },
    });

    if (!source) {
      throw createError('Source not found', 404);
    }

    res.json({
      success: true,
      data: source,
    });
  } catch (error) {
    next(error);
  }
};

// Create source (admin only - to be implemented later)
export const createSource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, url, type, scrapingConfig } = req.body;

    const source = await prisma.source.create({
      data: {
        name,
        url,
        type,
        scrapingConfig,
      },
    });

    res.status(201).json({
      success: true,
      data: source,
    });
  } catch (error) {
    next(error);
  }
};
