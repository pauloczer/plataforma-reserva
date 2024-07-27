import { Router } from 'express';
import { createService, getServices } from '../controllers/serviceController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = Router();

router.use(authenticateToken);

router.post('/', createService);
router.get('/', getServices);

export default router;
