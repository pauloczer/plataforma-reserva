import { Router } from 'express';
import { createReservation, getReservations } from '../controllers/reservationController';
import { authenticateToken } from '../middleware/authenticateToken';
import { authorizeRole } from '../middleware/authorizeRole';

const router = Router();

router.post('/', authenticateToken, authorizeRole(['Client']), createReservation);
router.get('/', authenticateToken, getReservations);

export default router;
