import { Request, Response, NextFunction } from 'express';
import { getRecentArticles, getArticleById } from '../services/articleService';

/**
 * Get recent articles
 */
export const getArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const sourceId = req.query.sourceId as string;

    const articles = await getRecentArticles(limit, sourceId);

    res.json({
      success: true,
      data: articles,
      count: articles.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single article by ID
 */
export const getArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const article = await getArticleById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found',
      });
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};
