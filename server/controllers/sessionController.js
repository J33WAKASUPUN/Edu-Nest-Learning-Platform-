import Session from "../models/sessions.js";
import User from "../models/User.js";

// Create a new session (Admin/Teacher only)
export const createSession = async (req, res) => {
  try {
    // Check if user is admin or teacher
    if (!req.user || !["admin", "teacher"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only admins and teachers can create sessions"
      });
    }

    // Create session with teacher set to current user
    const session = new Session({
      subject: req.body.subject,
      description: req.body.description,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      maxStudents: req.body.maxStudents,
      link: req.body.link,
      teacher: req.user._id,
      code: req.body.code, 
      enrolledStudents: [], // Start with no enrolled students
      isCancelled: false,
    });

    await session.save();
    
    res.status(201).json({
      message: "Session created successfully",
      session
    });
    
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({
      message: "Failed to create session",
      error: error.message
    });
  }
};

// Get all sessions (Public)
export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate('teacher', 'firstName lastName')
      .populate('teacher', 'firstName lastName img') ;
    res.json(sessions);
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving sessions",
      error: err.message,
    });
  }
};

// Get session by ID (Public)
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('teacher', 'firstName lastName')
      .populate('teacher', 'firstName lastName img') ;

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving session",
      error: error.message,
    });
  }
};

// Get sessions for the logged-in teacher
export const getTeacherSessions = async (req, res) => {
  try {
    if (!req.user || !["admin", "teacher"].includes(req.user.role)) {
      return res.status(403).json({ message: "Teacher access required" });
    }

    const sessions = await Session.find({ teacher: req.user._id })
      .populate('enrolledStudents', 'firstName lastName');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving teacher sessions",
      error: error.message,
    });
  }
};

// Get sessions for the logged-in student
export const getStudentSessions = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ message: "Student access required" });
    }

    const sessions = await Session.find({ 
      enrolledStudents: req.user._id
    }).populate('teacher', 'firstName lastName');
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving student sessions",
      error: error.message,
    });
  }
};

// Update session (Admin/Teacher only)
export const updateSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if user is the teacher who created the session or admin
    if (session.teacher.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only update your own sessions" });
    }

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Session updated successfully",
      session: updatedSession
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating session",
      error: error.message,
    });
  }
};

// Delete session (Admin/Teacher only)
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if user is the teacher who created the session or admin
    if (session.teacher.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own sessions" });
    }

    await session.deleteOne();
    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting session",
      error: error.message,
    });
  }
};

// Enroll in a session (Student only)
export const enrollSession = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can enroll in sessions" });
    }

    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if already enrolled
    if (session.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: "Already enrolled in this session" });
    }

    session.enrolledStudents.push(req.user._id);
    await session.save();

    res.json({ message: "Enrolled successfully", session });
  } catch (error) {
    res.status(500).json({
      message: "Error enrolling in session",
      error: error.message,
    });
  }
};

// Withdraw from a session (Student only)
export const withdrawSession = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can withdraw from sessions" });
    }

    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Remove student from enrolled list
    session.enrolledStudents = session.enrolledStudents.filter(
      id => id.toString() !== req.user._id.toString()
    );
    
    await session.save();
    res.json({ message: "Withdrawn successfully", session });
  } catch (error) {
    res.status(500).json({
      message: "Error withdrawing from session",
      error: error.message,
    });
  }
};