import express from 'express';
import { getMentors, getMentorById, createMentor } from '../controllers/mentor.controller.js';

const router = express.Router();

router.get('/', getMentors);
router.get('/:id', getMentorById);
router.post('/', createMentor);

export default router;
