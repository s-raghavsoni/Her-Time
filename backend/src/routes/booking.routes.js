import { Router } from 'express';
import {
  createBooking,
  getBookings,
} from '../controllers/booking.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createBooking);
router.get('/', getBookings);

export default router;