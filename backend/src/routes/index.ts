import { Router } from 'express';
import healthRoutes from './healthRoutes';
import sourceRoutes from './sourceRoutes';
import crawlerRoutes from './crawlerRoutes';
import articleRoutes from './articleRoutes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/sources', sourceRoutes);
router.use('/crawler', crawlerRoutes);
router.use('/articles', articleRoutes);

export default router;
