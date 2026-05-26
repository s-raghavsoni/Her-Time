import { Router } from 'express';
import { createProfile, getProfile } from '../controllers/provider.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/profile', authenticate, createProfile);
router.get('/profile', authenticate, getProfile);

export default router;
