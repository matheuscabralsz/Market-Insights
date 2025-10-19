import { Queue, Worker, QueueEvents } from 'bullmq';
import redis from './redis';
import logger from './logger';

// Queue names
export const QUEUE_NAMES = {
  CRAWLER: 'crawler',
};

// Create queues
export const crawlerQueue = new Queue(QUEUE_NAMES.CRAWLER, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: {
      count: 100, // Keep last 100 completed jobs
    },
    removeOnFail: {
      count: 200, // Keep last 200 failed jobs
    },
  },
});

// Queue events for monitoring
const crawlerQueueEvents = new QueueEvents(QUEUE_NAMES.CRAWLER, {
  connection: redis,
});

crawlerQueueEvents.on('completed', ({ jobId }) => {
  logger.info(`Job ${jobId} completed`);
});

crawlerQueueEvents.on('failed', ({ jobId, failedReason }) => {
  logger.error(`Job ${jobId} failed: ${failedReason}`);
});

export { crawlerQueueEvents };
