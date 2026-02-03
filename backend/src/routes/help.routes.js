import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getHelpPosts,
  createHelpPost,
  addComment,
} from "../controllers/help.controller.js";

const router = express.Router();

/**
 * GET /help
 * List all help posts (public - anyone can view)
 */
router.get("/", getHelpPosts);

/**
 * POST /help
 * Create a new help post (protected - must be logged in)
 */
router.post("/", authMiddleware, createHelpPost);

/**
 * POST /help/:id/comment
 * Add a comment to a help post (protected - must be logged in)
 */
router.post("/:id/comment", authMiddleware, addComment);

export default router;
