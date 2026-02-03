import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getAllGroups,
  createGroup,
  joinGroup,
  leaveGroup
} from "../controllers/group.controller.js";

const router = express.Router();

/**
 * GET /groups
 * List all study groups
 */
router.get("/", authMiddleware, getAllGroups);

/**
 * POST /groups
 * Create a new study group
 */
router.post("/", authMiddleware, createGroup);

/**
 * POST /groups/:id/join
 * Join an existing study group
 */
router.post("/:id/join", authMiddleware, joinGroup);

/**
 * POST /groups/:id/leave
 * Leave a study group
 */
router.post("/:id/leave", authMiddleware, leaveGroup);

export default router;
