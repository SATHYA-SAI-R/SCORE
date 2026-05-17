import express from 'express';
import { createThread, getThreadsByCategory, getThreadById, replyToThread, uplinkThread } from '../controllers/communityController.js';

const router = express.Router();

router.post('/threads', createThread);
router.get('/threads/category/:category', getThreadsByCategory);
router.get('/threads/:id', getThreadById);
router.post('/replies', replyToThread);
router.post('/threads/:id/uplink', uplinkThread);

export default router;
