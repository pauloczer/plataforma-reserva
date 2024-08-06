import { Router } from 'express';
import { createReservation, getReservationCount, getReservations } from '../controllers/reservationController';
import { authenticateToken } from '../middleware/authenticateToken';
import { authorizeRole } from '../middleware/authorizeRole';

const router = Router();

router.post('/', authenticateToken, authorizeRole(['Client']), createReservation);
router.get('/', authenticateToken, getReservations);
router.get('/count', getReservationCount);

export default router;
