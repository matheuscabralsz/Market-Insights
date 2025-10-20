import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import logger from '../config/logger';
import { saveArticles } from './articleService';

const execAsync = promisify(exec);

export interface ArticleData {
  title: string;
  summary?: string | null;
  content: string;
  url: string;
  author?: string | null;
  publishedAt: string;
}

export interface CrawlerResult {
  success: boolean;
  source: string;
  scraped: number;
  saved: number;
}

/**
 * Execute the web crawler for a given source
 */
export const executeCrawler = async (
  source: string,
  maxArticles: number
): Promise<CrawlerResult> => {
  logger.info(`Starting crawler for ${source} with max ${maxArticles} articles`);

  try {
    // Path to Python script (currently only supports fxstreet)
    const scriptPath = path.join(__dirname, '../../..', 'scripts', 'fxstreet_crawler.py');

    logger.info(`Executing Python script: ${scriptPath}`);

    // Execute Python script with max articles argument
    const { stdout, stderr } = await execAsync(`python3 ${scriptPath} ${maxArticles}`, {
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large outputs
    });

    // Log stderr (progress messages from crawler)
    if (stderr) {
      logger.info(`Crawler stderr: ${stderr}`);
    }

    // Parse the scraped articles from stdout
    const articles = parseScrapedArticles(stdout);

    logger.info(`Scraped ${articles.length} articles from ${source}`);

    // Save articles to database
    const savedCount = await saveArticles(source, articles);

    logger.info(`Successfully saved ${savedCount} articles to database`);

    return {
      success: true,
      source,
      scraped: articles.length,
      saved: savedCount,
    };
  } catch (error) {
    logger.error(`Crawler execution failed for ${source}:`, error);
    throw error;
  }
};

/**
 * Parse scraped articles from Python script output
 * Extracts JSON array from stdout (crawl4ai may output initialization messages)
 */
const parseScrapedArticles = (stdout: string): ArticleData[] => {
  // Look for JSON array pattern: "[\n" (array start with newline)
  const jsonMatch = stdout.match(/\[\s*\n[\s\S]*\]/);

  if (!jsonMatch) {
    logger.error('Could not find JSON array in output. Stdout:', stdout.substring(0, 500));
    throw new Error('No JSON array found in Python script output');
  }

  const jsonOutput = jsonMatch[0];
  const articles: ArticleData[] = JSON.parse(jsonOutput);

  return articles;
};
