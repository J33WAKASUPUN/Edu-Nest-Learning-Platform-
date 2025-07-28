import { 
  getAlluser, 
  saveUser, 
  loginUser, 
  checkIsAdmin, 
  getCurrentUser,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { getUserSubjects } from '../controllers/userController.js';


import express from 'express'


const router = express.Router();

router.get('/me/subjects', authMiddleware, getUserSubjects)

// Public routes
router.post('/register', saveUser);
router.post('/login', loginUser);

// Protected routes
router.get('/', getAlluser);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/isAdmin', authMiddleware, checkIsAdmin);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

export default router;