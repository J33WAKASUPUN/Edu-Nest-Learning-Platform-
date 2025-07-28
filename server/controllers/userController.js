import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';


dotenv.config();

// Utility function to check if user is admin
export function isAdmin(req) {
  return req.user && req.user.role === 'admin';
}

// Endpoint to check admin status
export function checkIsAdmin(req, res) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ isAdmin: false });
  }
  return res.status(200).json({ isAdmin: true });
}

// Get all users (Admin only)
export function getAlluser(req, res) {
  // if (!req.user || req.user.role !== 'admin') {
  //   return res.status(403).json({ message: 'Unauthorized: Admin access required' });
  // }

  User.find().select('-password')
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Error fetching users',
        error: error.message,
      });
    });
}

export const getUserSubjects = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('accessibleSubjects');
    res.json({ accessibleSubjects: user.accessibleSubjects || [] });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user subjects",
      error: error.message
    });
  }
};

// Get current user
export function getCurrentUser(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: No user authenticated' });
  }
  res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    role: req.user.role,
    img: req.user.img,
  });
}

// Get user by ID (Admin only)
export function getUserById(req, res) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized: Admin access required' });
  }

  User.findById(req.params.id).select('-password')
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Error fetching user',
        error: error.message,
      });
    });
}

// Register new user
export async function saveUser(req, res) {
  try {
    console.log('Received registration data:', req.body);

    // Validate required fields with more detailed errors
    const requiredFields = ['firstName', 'lastName', 'email', 'password'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields,
        example: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'user@example.com',
          password: 'SecurePassword123!'
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({
        message: 'Invalid email format',
        example: 'user@example.com'
      });
    }

    // Validate password strength
    if (req.body.password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long'
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({
        message: 'Email already exists'
      });
    }

    // Role authorization - only allow admins to create other admins/teachers
    const requestedRole = req.body.role || 'student';
    if (['admin', 'teacher'].includes(requestedRole)) {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          message: 'Only admins can create admin or teacher accounts'
        });
      }
    }

    // Hash password
    const hashPassword = await bcrypt.hash(req.body.password, 12);

    // Create new user
    const user = new User({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashPassword,
      role: requestedRole,
      isBlocked: req.body.isBlocked || false,
      img: req.body.img || 'https://example.com/default-user.png', // Use actual default image URL
      userExperience: req.body.userExperience || 'beginner',
      gender: req.body.gender || 'other',
      subject: req.body.subject || 'other',
      // Add any other default fields from your schema
    });

    // Save user
    const savedUser = await user.save();
    const { password, ...userData } = savedUser.toObject();

    return res.status(201).json({
      message: 'User registered successfully',
      user: userData
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    return res.status(500).json({
      message: 'Internal server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Update user (Admin can update any, users can update themselves)
export function updateUser(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Check if non-admin trying to update another user
  if (req.params.id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You can only update your own profile' });
  }

  // Prevent role changes unless admin
  if (req.body.role && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can change user roles' });
  }

  // Hash password if it's being updated
  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  if(req.body.email)

  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .select('-password')
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({
        message: 'User updated successfully',
        user: updatedUser,
      });
    })
    .catch((error) => {
      if (error.code === 11000) {
        res.status(409).json({
          message: 'Email already exists',
          error: error.message,
        });
      } else {
        res.status(400).json({
          message: 'Error updating user',
          error: error.message,
        });
      }
    });
}

// Delete user (Admin only)
export function deleteUser(req, res) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized: Admin access required' });
  }

  User.findByIdAndDelete(req.params.id)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({
        message: 'User deleted successfully',
        userId: deletedUser._id,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Error deleting user',
        error: error.message,
      });
    });
}

// User login
export function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      const { password: _, ...userData } = user.toObject();

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          img: user.img,
          
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.status(200).json({
        message: 'Login successful',
        token: token,
        user: userData
      });
    })
    .catch((error) => {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error logging in', error: error.message });
    });
}