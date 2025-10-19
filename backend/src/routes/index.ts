import { Router } from 'express';
import healthRoutes from './healthRoutes';
import sourceRoutes from './sourceRoutes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/sources', sourceRoutes);

export default router;
