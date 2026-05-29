import { Router } from 'express';
import { getProviderByUserId, listProviders } from '../controllers/provider.controller.js';

const router = Router();

router.get('/', listProviders);
router.get('/:userId', getProviderByUserId);

export default router;
