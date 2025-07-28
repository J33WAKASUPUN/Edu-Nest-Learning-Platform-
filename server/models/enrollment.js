import mongoose from "mongoose";

const SUBJECTS = [
  "Sinhala",
  "Geography",
  "Economics",
  "Biology",
  "Buddhist Culture and Logic",
  "Physics",
  "Chemistry",
  "Combined Mathematics",
  "Engineering & Bio System Technology",
  "Science for Technology",
  "ICT",
  "Agriculture and Applied Sciences"
];

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"]
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    enum: {
      values: SUBJECTS,
      message: "Invalid subject selected"
    },
    trim: true
  },
  month: {
    type: Number,
    required: [true, "Month is required"],
    min: [1, "Month must be between 1-12"],
    max: [12, "Month must be between 1-12"]
  },
  year: {
    type: Number,
    required: [true, "Year is required"],
    min: [
      new Date().getFullYear(), 
      `Year cannot be before ${new Date().getFullYear()}`
    ],
    max: [
      new Date().getFullYear() + 2, 
      `Year cannot be after ${new Date().getFullYear() + 2}`
    ]
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
    maxlength: [1000, "Message cannot exceed 1000 characters"]
  },
  imageUrl: {
    type: String,
    required: [true, "Image is required"],
    trim: true
    // No URL validation, just store file path
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['pending', 'approved', 'rejected'],
      message: "Invalid status value"
    },
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  reviewedAt: {
    type: Date
  },
  reviewNotes: {
    type: String,
    trim: true,
    maxlength: [500, "Review notes cannot exceed 500 characters"]
  },
  isEditable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Virtuals
enrollmentSchema.virtual('period').get(function() {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'];
  return `${monthNames[this.month - 1]} ${this.year}`;
});

enrollmentSchema.virtual('subjectName').get(function() {
  return this.subject; // Already using full names
});

// Pre-save hooks with proper error handling
enrollmentSchema.pre('save', function(next) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JS months are 0-11
  
  // Check for past months in current year
  if (this.year === currentYear && this.month < currentMonth) {
    const err = new Error(`Cannot enroll for past months (${this.month}/${this.year})`);
    return next(err);
  }
  
  // Mark as non-editable when first created
  if (this.isNew) {
    this.isEditable = false;
  }
  
  next();
});

// Post-save error handling middleware
enrollmentSchema.post('save', function(error, doc, next) {
  if (error.name === 'ValidationError') {
    const errors = {};
    Object.keys(error.errors).forEach(key => {
      errors[key] = error.errors[key].message;
    });
    next(new Error(JSON.stringify(errors)));
  } else if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Duplicate enrollment detected'));
  } else {
    next(error);
  }
});

// Indexes for optimized queries
enrollmentSchema.index({ user: 1, status: 1 });
enrollmentSchema.index({ subject: 1, status: 1 });
enrollmentSchema.index({ month: 1, year: 1 });
enrollmentSchema.index({ status: 1, createdAt: -1 });
enrollmentSchema.index({ user: 1, subject: 1, month: 1, year: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;