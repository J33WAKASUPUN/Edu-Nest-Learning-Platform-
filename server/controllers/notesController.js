import Note from "../models/notes.js";


// Helper function to check if user is admin or teacher
const isAdminOrTeacher = (user) => {
  return user && ['admin', 'teacher'].includes(user.role);
};

// Create a new note (Admin/Teacher only)
export const createNote = async (req, res) => {
  if (!isAdminOrTeacher(req.user)) {
    return res.status(403).json({
      message: "Only admins and teachers can create notes"
    });
  }

  try {
    const note = new Note({ 
      subject: req.body.subject, // Assuming subject is an ObjectId
      title: req.body.title,
      caption: req.body.caption,
      subjectCode: req.body.subjectCode,
      classroomLink: req.body.classroomLink,
      createdBy: req.user._id
    });

    await note.save();
    
    res.status(201).json({
      message: "Note created successfully",
      note
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create note",
      error: error.message
    });
  }
};

// Get all notes (Public)
export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate('createdBy', 'firstName lastName role');
    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving notes",
      error: error.message
    });
  }
};

// Get note by ID (Public)
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('createdBy', 'firstName lastName role');

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving note",
      error: error.message
    });
  }
};

// Update note (Admin/Teacher who created it)
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if user is the creator or admin
    if (note.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You can only update your own notes" });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        subject : req.body.subject, 
        title: req.body.title,
        caption: req.body.caption,
        subjectCode: req.body.subjectCode,
        classroomLink: req.body.classroomLink,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('createdBy', 'firstName lastName role');

    res.json({
      message: "Note updated successfully",
      note: updatedNote
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating note",
      error: error.message
    });
  }
};

// Delete note (Admin/Teacher who created it)
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if user is the creator or admin
    if (note.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You can only delete your own notes" });
    }

    await note.deleteOne();
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting note",
      error: error.message
    });
  }
};

export const getNotesByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    if (req.user._id.toString() !== teacherId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to access these notes" });
    }
    const notes = await Note.find({ createdBy: teacherId })
      .populate('createdBy', 'firstName lastName role');
    if (!notes || notes.length === 0) {
      return res.status(404).json({ message: "No notes found for this teacher" });
    }
    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving teacher notes",
      error: error.message,
    });
  }
};