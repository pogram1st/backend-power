import { Router } from 'express';
import WorkController from '../controllers/work.controller.js';
import checkAuth from '../utils/checkAuth.js';

const router = new Router();

router.post('/get-work', checkAuth, WorkController.getWork);
router.post('/work', checkAuth, WorkController.addWork);

export default router;
