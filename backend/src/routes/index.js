import { Router } from 'express';
import authRoutes from './auth.routes.js';
import healthRoutes from './health.routes.js';
import providerRoutes from './provider.routes.js';
import providersRoutes from './providers.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/provider', providerRoutes);
router.use('/providers', providersRoutes);

export default router;
