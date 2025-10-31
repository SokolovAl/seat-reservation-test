import { Router } from 'express';
import { reserve } from '../controllers/bookingController.js';

const router = Router();
router.post('/reserve', reserve);

export default router;
