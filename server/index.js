import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/userRoute.js";
import sessionRouter from "./routes/sessionRoutes.js";
import noteRoute from "./routes/noteRoute.js";
import enrollmentRoute from "./routes/enrollment.js";


dotenv.config();

// Validate environment variables
if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// JWT Authentication Middleware
app.use((req, res, next) => {
  const authHeader = req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "");
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
  }
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/users", router);
app.use("/api/sessions", sessionRouter);
app.use("/api/notes", noteRoute);
app.use("/api/enrollments", enrollmentRoute);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));