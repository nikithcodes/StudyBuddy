import express from "express";
import { getProfile, updateProfile, findStudyBuddies } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Get recommended buddies for the logged-in user
router.get("/matches", authMiddleware, findStudyBuddies);

// Get user profile (public - anyone can view)
router.get("/:id", getProfile);

// Update user profile (protected - only own profile)
router.put("/:id", authMiddleware, updateProfile);

export default router;


