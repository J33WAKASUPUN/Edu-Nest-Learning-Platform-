
import Enrollment from "../models/enrollment.js";
import Session from "../models/sessions.js";
import User from "../models/User.js";



const SUBJECTS = [
  "Sinhala", "Geography", "Economics", "Biology", 
  "Buddhist Culture and Logic", "Physics", "Chemistry",
  "Combined Mathematics", "Engineering & Bio System Technology",
  "Science for Technology", "ICT", "Agriculture and Applied Sciences"
];

export const createEnrollment = async (req, res) => {
  try {
    console.log("[DEBUG] Incoming enrollment request");
    console.log("[DEBUG] req.user:", req.user);
    console.log("[DEBUG] req.body:", req.body);
    console.log("[DEBUG] req.file:", req.file);

    const userId = req.user._id;
    const { message, subject, month, year } = req.body;
    // If file uploaded, get path, else null
    const imageUrl = req.file ? req.file.path : null;

    // Basic validation
    if (!message || !subject || !month || !year || !imageUrl) {
      console.log("[DEBUG] Validation failed: missing fields", { message, subject, month, year, imageUrl });
      return res.status(400).json({
        message: "All fields are required (including image)"
      });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      user: userId,
      message,
      subject,
      month: parseInt(month),
      year: parseInt(year),
      imageUrl
    });

    // Save with proper error handling
    await enrollment.save();

    // After saving enrollment, add user to enrolledStudents in matching session(s)
    // Find sessions for this subject and month/year
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    // Find all sessions for this subject in the given month/year
    const sessions = await Session.find({
      subject,
      // date is stored as string 'YYYY-MM-DD', so match year and month
      date: { $regex: `^${yearNum}-` + (monthNum < 10 ? `0${monthNum}` : monthNum) + `-` }
    });
    for (const session of sessions) {
      // Only add if not already present
      if (!session.enrolledStudents.map(id => id.toString()).includes(userId.toString())) {
        session.enrolledStudents.push(userId);
        await session.save();
      }
    }

    console.log("[DEBUG] Enrollment saved successfully", enrollment);
    return res.status(201).json({
      message: "Enrollment submitted successfully",
      enrollment
    });

  } catch (error) {
    console.error("[ERROR] Enrollment submission failed:", error);
    // Handle specific error types
    if (error.message && error.message.includes('Cannot enroll for past months')) {
      return res.status(400).json({
        message: error.message
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors
      });
    }

    return res.status(500).json({
      message: "Failed to submit enrollment",
      error: error.message,
      stack: error.stack
    });
  }
};

export const getEnrollments = async (req, res) => {
  try {
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ message: "Admin access required" });
    // }

    const enrollments = await Enrollment.find()
      .populate('user', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving enrollments",
      error: error.message
    });
  }
};

export const updateEnrollmentStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { enrollmentId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Update status
    enrollment.status = status;
    enrollment.reviewedBy = req.user._id;
    enrollment.reviewedAt = new Date();
    await enrollment.save();

    // If approved, grant access to subject
    if (status === 'approved') {
      await User.findByIdAndUpdate(
        enrollment.user,
        { $addToSet: { accessibleSubjects: enrollment.subject } }
      );
      
      // Grant session access
      await grantSessionAccess(
        enrollment.user, 
        enrollment.subject, 
        enrollment.month, 
        enrollment.year
      );
    } else if (status === 'rejected') {
      // Remove subject access if previously approved
      await User.findByIdAndUpdate(
        enrollment.user,
        { $pull: { accessibleSubjects: enrollment.subject } }
      );
    }

    res.json({ 
      message: `Enrollment ${status} successfully`, 
      enrollment 
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating enrollment status',
      error: error.message
    });
  }
};


const grantSessionAccess = async (userId, subject, month, year) => {
  // 1. Find all sessions for the subject and period
  const sessions = await Session.find({
    subject,
    date: {
      $gte: new Date(year, month - 1, 1),
      $lt: new Date(year, month, 1)
    }
  });

  // 2. Add user to enrolledStudents for each session
  for (const session of sessions) {
    if (!session.enrolledStudents.includes(userId)) {
      session.enrolledStudents.push(userId);
      await session.save();
    }
  }

  // 3. Grant access to subject notes
  await User.findByIdAndUpdate(userId, {
    $addToSet: { accessibleSubjects: subject }
  });
};

export const updateEnrollment = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { enrollmentId } = req.params;
    const { subject, month, year, message } = req.body;

    const enrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      { subject, month, year, message },
      { new: true }
    ).populate('user', 'firstName lastName email');

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json({
      message: "Enrollment updated successfully",
      enrollment
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating enrollment",
      error: error.message
    });
  }
};
export const deleteEnrollment = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findByIdAndDelete(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting enrollment",
      error: error.message
    });
  }
};

// Get pending enrollments count
export const getPendingCount = async (req, res) => {
  try {
    const count = await Enrollment.countDocuments({ status: 'pending' });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending enrollments count' });
  }
};

// Clear notifications
export const clearNotifications = async (req, res) => {
  try {
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing notifications' });
  }
};