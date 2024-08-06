import { Router } from 'express';
import { createService, deleteService, getServiceById, getServices, updateService } from '../controllers/serviceController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = Router();

router.use(authenticateToken);

router.post('/', createService);
router.get('/', getServices);
router.get('/:id', getServiceById);
router.put('/:id', updateService);
router.delete('/:id', deleteService);




export default router;
