import { Worker, Job } from 'bullmq';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import redis from '../config/redis';
import logger from '../config/logger';
import { QUEUE_NAMES } from '../config/queue';
import { saveArticles } from '../services/articleService';

const execAsync = promisify(exec);

interface CrawlerJobData {
  source: 'fxstreet';
  maxArticles: number;
}

interface ArticleData {
  title: string;
  summary?: string | null;
  content: string;
  url: string;
  author?: string | null;
  publishedAt: string;
}

// Process crawler jobs
const processCrawlerJob = async (job: Job<CrawlerJobData>) => {
  const { source, maxArticles } = job.data;

  logger.info(`Starting crawler job for ${source} with max ${maxArticles} articles`);

  try {
    // Update job progress
    await job.updateProgress(10);

    // Path to Python script
    const scriptPath = path.join(__dirname, '../../..', 'scripts', 'fxstreet_crawler.py');

    logger.info(`Executing Python script: ${scriptPath}`);

    // Execute Python script with max articles argument
    const { stdout, stderr } = await execAsync(`python3 ${scriptPath} ${maxArticles}`, {
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large outputs
    });

    // Log stderr (progress messages)
    if (stderr) {
      logger.info(`Crawler stderr: ${stderr}`);
    }

    await job.updateProgress(50);

    // Extract JSON from stdout (crawl4ai may output initialization messages)
    // Look for JSON array pattern: "[\n" (array start with newline)
    const jsonMatch = stdout.match(/\[\s*\n[\s\S]*\]/);

    if (!jsonMatch) {
      logger.error('Could not find JSON array in output. Stdout:', stdout.substring(0, 500));
      throw new Error('No JSON array found in Python script output');
    }

    const jsonOutput = jsonMatch[0];
    const articles: ArticleData[] = JSON.parse(jsonOutput);

    logger.info(`Scraped ${articles.length} articles from ${source}`);

    await job.updateProgress(70);

    // Save articles to database
    const savedCount = await saveArticles(source, articles);

    await job.updateProgress(100);

    logger.info(`Successfully saved ${savedCount} articles to database`);

    return {
      success: true,
      source,
      scraped: articles.length,
      saved: savedCount,
    };
  } catch (error) {
    logger.error(`Crawler job failed for ${source}:`, error);
    throw error;
  }
};

// Create worker
export const crawlerWorker = new Worker(QUEUE_NAMES.CRAWLER, processCrawlerJob, {
  connection: redis,
  concurrency: 1, // Process one crawler job at a time
});

crawlerWorker.on('completed', (job) => {
  logger.info(`Crawler worker completed job ${job.id}`);
});

crawlerWorker.on('failed', (job, err) => {
  logger.error(`Crawler worker failed job ${job?.id}:`, err);
});

logger.info('Crawler worker initialized');
