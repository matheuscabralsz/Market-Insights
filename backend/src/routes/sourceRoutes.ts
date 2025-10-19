import { Router } from 'express';
import { getSources, getSource, createSource } from '../controllers/sourceController';

const router = Router();

router.get('/', getSources);
router.get('/:id', getSource);
router.post('/', createSource);

export default router;
