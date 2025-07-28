import express from "express";
import {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
  enrollSession,
  withdrawSession,
  getTeacherSessions,
  getStudentSessions
} from "../controllers/sessionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getSessions);
router.get("/:id", getSessionById);

// Protected routes
router.post("/", authMiddleware, createSession);
router.put("/:id", authMiddleware, updateSession);
router.delete("/:id", authMiddleware, deleteSession);
router.post("/:id/enroll", authMiddleware, enrollSession);
router.delete("/:id/enroll", authMiddleware, withdrawSession);
router.get("/teacher/me", authMiddleware, getTeacherSessions);
router.get("/student/me", authMiddleware, getStudentSessions);


const sessionRouter = router;

export default sessionRouter;