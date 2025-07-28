import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  subject : {
    type:String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  subjectCode: {
    type: String,
    required: true
  },
  classroomLink: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Note = mongoose.model('Note', noteSchema);
export default Note;