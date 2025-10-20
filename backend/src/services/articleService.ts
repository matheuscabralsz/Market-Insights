import prisma from '../config/database';
import logger from '../config/logger';
import { parseISO, parse } from 'date-fns';

interface ArticleData {
  guid?: string | null;  // RSS feed GUID - unique identifier
  title: string;
  summary?: string | null;
  content: string;
  url: string;
  author?: string | null;
  publishedAt: string;
}

// Source configurations
const SOURCE_CONFIGS: Record<string, { name: string; url: string; type: string }> = {
  fxstreet: {
    name: 'FXStreet',
    url: 'https://www.fxstreet.com',
    type: 'news',
  },
};

/**
 * Get or create a source by key
 */
async function getOrCreateSource(sourceKey: string) {
  const config = SOURCE_CONFIGS[sourceKey];

  if (!config) {
    throw new Error(`Unknown source: ${sourceKey}`);
  }

  // Try to find existing source
  let source = await prisma.source.findUnique({
    where: { name: config.name },
  });

  // Create if doesn't exist
  if (!source) {
    logger.info(`Creating new source: ${config.name}`);
    source = await prisma.source.create({
      data: {
        name: config.name,
        url: config.url,
        type: config.type,
        isActive: true,
      },
    });
  }

  return source;
}

/**
 * Parse published date string to Date object
 */
function parsePublishedDate(dateStr: string): Date {
  try {
    // Try ISO format first
    const date = parseISO(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch (e) {
    // Ignore and try other formats
  }

  // Try common RSS date formats
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch (e) {
    logger.warn(`Could not parse date: ${dateStr}`);
  }

  // Fallback to current time
  return new Date();
}

/**
 * Save articles to database
 */
export async function saveArticles(sourceKey: string, articles: ArticleData[]): Promise<number> {
  logger.info(`Saving ${articles.length} articles from ${sourceKey}`);

  // Get or create source
  const source = await getOrCreateSource(sourceKey);

  let savedCount = 0;
  let skippedCount = 0;

  for (const article of articles) {
    try {
      // Check if article already exists by GUID (primary) or URL (fallback)
      let existing = null;

      if (article.guid) {
        // First, try to find by GUID (most reliable unique identifier)
        existing = await prisma.article.findUnique({
          where: { guid: article.guid },
        });
      }

      if (!existing) {
        // Fallback to URL check for articles without GUID or if GUID lookup failed
        existing = await prisma.article.findUnique({
          where: { url: article.url },
        });
      }

      if (existing) {
        logger.debug(`Article already exists: ${article.guid || article.url}`);
        skippedCount++;
        continue;
      }

      // Parse published date
      const publishedAt = parsePublishedDate(article.publishedAt);

      // Create article
      await prisma.article.create({
        data: {
          sourceId: source.id,
          guid: article.guid,  // Save RSS GUID
          title: article.title,
          summary: article.summary,
          content: article.content,
          url: article.url,
          author: article.author,
          publishedAt,
          categories: ['forex'], // Default category for FXStreet
        },
      });

      savedCount++;
      logger.debug(`Saved article: ${article.title}`);
    } catch (error) {
      logger.error(`Error saving article ${article.url}:`, error);
      // Continue with next article
    }
  }

  // Update source's lastScrapedAt
  await prisma.source.update({
    where: { id: source.id },
    data: { lastScrapedAt: new Date() },
  });

  logger.info(`Saved ${savedCount} new articles, skipped ${skippedCount} duplicates`);

  return savedCount;
}

/**
 * Get recent articles
 */
export async function getRecentArticles(limit: number = 20, sourceId?: string) {
  return await prisma.article.findMany({
    where: sourceId ? { sourceId } : undefined,
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: {
      source: {
        select: {
          name: true,
          url: true,
        },
      },
    },
  });
}

/**
 * Get article by ID
 */
export async function getArticleById(id: string) {
  return await prisma.article.findUnique({
    where: { id },
    include: {
      source: true,
      predictions: true,
    },
  });
}
