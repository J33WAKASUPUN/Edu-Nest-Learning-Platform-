import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import { createNote, deleteNote, getAllNotes, getNoteById, getNotesByTeacher, updateNote } from '../controllers/notesController.js';

const router = express.Router();

// Public routes
router.get('/', getAllNotes);
router.get('/:id', getNoteById);

// Protected routes (Admin/Teacher)
router.post('/', authMiddleware, createNote);
router.put('/:id', authMiddleware, updateNote);
router.delete('/:id', authMiddleware, deleteNote);
router.get('/teacher/:teacherId', authMiddleware, getNotesByTeacher);

const noteRoute = router

export default noteRoute; 