import { Router } from 'express';
import { getTelemetry } from '../controllers/system.controller.js';

const router = Router();

router.get('/telemetry', getTelemetry);

export default router;
