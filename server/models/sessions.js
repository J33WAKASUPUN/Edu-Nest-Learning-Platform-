import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  subject: { type: String, required: true },

  description: { type: String, required: true },

  date: { type: String, required: true },

  startTime: { type: String, required: true },

  endTime: { type: String, required: true },
  
  maxStudents: { type: Number, required: true },

  link: { type: String, required: true },

  code: { type: String, required: true },

  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  isCancelled: { type: Boolean, default: false }
});
const Session = mongoose.model("Session", sessionSchema);
export default Session;