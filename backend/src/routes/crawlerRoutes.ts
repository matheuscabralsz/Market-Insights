import { Router } from 'express';
import { crawlFxStreetNews, getCrawlerJobStatus } from '../controllers/crawlerController';

const router = Router();

// POST /api/v1/crawler/fxstreet-news - Trigger FXStreet news crawler
router.post('/fxstreet-news', crawlFxStreetNews);

// GET /api/v1/crawler/jobs/:jobId - Get job status
router.get('/jobs/:jobId', getCrawlerJobStatus);

export default router;
