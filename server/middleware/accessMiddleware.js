import Enrollment from '../models/enrollment.js';

export const checkSubjectAccess = async (req, res, next) => {
  try {
    // Admins have full access
    if (req.user.role === 'admin') return next();
    
    const subject = req.params.subject || req.query.subject;
    
    // Check if user has access to this subject
    const hasAccess = await Enrollment.exists({
      user: req.user._id,
      subject,
      status: 'approved'
    });
    
    if (!hasAccess) {
      return res.status(403).json({
        message: "Access denied. Your enrollment for this subject is not approved."
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ 
      message: "Access verification failed", 
      error: error.message 
    });
  }
};