import { Request, Response, NextFunction } from 'express';
import { crawlerQueue } from '../config/queue';
import logger from '../config/logger';

/**
 * Trigger FXStreet news crawler
 */
export const crawlFxStreetNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { maxArticles = 10 } = req.body;

    // Validate maxArticles
    const max = parseInt(maxArticles);
    if (isNaN(max) || max < 1 || max > 100) {
      return res.status(400).json({
        success: false,
        error: 'maxArticles must be between 1 and 100',
      });
    }

    logger.info(`Adding FXStreet crawler job to queue (max: ${max} articles)`);

    // Add job to queue
    const job = await crawlerQueue.add(
      'fxstreet-crawler',
      {
        source: 'fxstreet',
        maxArticles: max,
      },
      {
        priority: 1, // Higher priority
      }
    );

    logger.info(`Crawler job added with ID: ${job.id}`);

    res.status(202).json({
      success: true,
      message: 'Crawler job initiated',
      data: {
        jobId: job.id,
        source: 'fxstreet',
        maxArticles: max,
        status: 'queued',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get crawler job status
 */
export const getCrawlerJobStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;

    const job = await crawlerQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }

    const state = await job.getState();
    const progress = job.progress;
    const returnValue = job.returnvalue;
    const failedReason = job.failedReason;

    res.json({
      success: true,
      data: {
        jobId: job.id,
        state,
        progress,
        result: returnValue,
        failedReason,
        timestamp: job.timestamp,
        finishedOn: job.finishedOn,
      },
    });
  } catch (error) {
    next(error);
  }
};
