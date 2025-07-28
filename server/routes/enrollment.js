
import express from 'express';
import {
  createEnrollment,
  deleteEnrollment,
  getEnrollments,
  updateEnrollmentStatus,
  getPendingCount,
  clearNotifications
} from '../controllers/enrollment.js';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const router = express.Router()

// User submits enrollment (protected route, with image upload)
router.post('/enroll', authMiddleware, upload.single('image'), createEnrollment);

// Admin views all enrollments (admin only)
router.get('/', authMiddleware, getEnrollments)

// Admin updates enrollment status (admin only)
router.patch('/:enrollmentId/status', authMiddleware, updateEnrollmentStatus)

router.delete('/:enrollmentId', authMiddleware, deleteEnrollment)

// Get pending enrollments count
router.get('/pending-count', authMiddleware, getPendingCount)

// Clear notifications
router.post('/clear-notifications', authMiddleware, clearNotifications)

export default router