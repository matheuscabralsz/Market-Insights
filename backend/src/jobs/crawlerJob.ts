import { Worker, Job } from 'bullmq';
import redis from '../config/redis';
import logger from '../config/logger';
import { QUEUE_NAMES } from '../config/queue';
import { executeCrawler } from '../services/crawlerService';

interface CrawlerJobData {
  source: 'fxstreet';
  maxArticles: number;
}

// Create worker
export const crawlerWorker = new Worker(QUEUE_NAMES.CRAWLER, async (job: Job<CrawlerJobData>) => {
    const { source, maxArticles } = job.data;

    logger.info(`Processing crawler job ${job.id} for ${source}`);

    try {
        await job.updateProgress(10);

        // Execute crawler through service layer
        const result = await executeCrawler(source, maxArticles);

        await job.updateProgress(100);

        return result;
    } catch (error) {
        logger.error(`Crawler job ${job.id} failed for ${source}:`, error);
        throw error;
    }
}, {
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
