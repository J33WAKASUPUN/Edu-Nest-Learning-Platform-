import mongoose from 'mongoose';

const SUBJECTS = [
  "Sinhala", "Geography", "Economics", "Biology", 
  "Buddhist Culture and Logic", "Physics", "Chemistry",
  "Combined Mathematics", "Engineering & Bio System Technology",
  "Science for Technology", "ICT", "Agriculture and Applied Sciences"
];

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'student', 'teacher'],
    default: 'student'
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  img: {
    type: String,
    default: 'default-user-image-url'
  },
  accessibleSubjects: [{
    type: String,
    enum: SUBJECTS
  }],
  subject: {
    type: String,
    enum: [
      "sinhala", "geography", "economics", "biology", 
      "buddhist culture and logic", "physics", "chemistry",
      "combined mathematics", "engineering & bio system technology",
      "science for technology", "ict", "agriculture and applied sciences" , "other"
    ]
  },
 userExperience: {
  type: String,
  enum: [
    "beginner",
    "1+ year experience",
    "2+ years experience",
    "3+ years experience",
    "4+ years experience",
    "5+ years experience",
    "6+ years experience",
    "7+ years experience",
    "8+ years experience",
    "9+ years experience",
    "10+ years experience",
    "11+ years experience",
    "12+ years experience",
    "13+ years experience",
    "14+ years experience",
    "15+ years experience",
    "16+ years experience",
    "17+ years experience",
    "18+ years experience",
    "19+ years experience",
    "20+ years experience",
    "21+ years experience",
    "22+ years experience",
    "23+ years experience",
    "24+ years experience",
    "25+ years experience"
  ],
  default: "beginner"
}
  // ... keep other fields as needed
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;