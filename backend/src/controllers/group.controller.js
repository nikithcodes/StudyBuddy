import StudyGroup from "../models/StudyGroup.js";

/**
 * GET /groups
 * List all study groups
 */
export const getAllGroups = async (req, res) => {
  try {
    const groups = await StudyGroup.find()
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch groups" });
  }
};

/**
 * POST /groups
 * Create a new study group
 */
export const createGroup = async (req, res) => {
  try {
    const { name, description, subjects } = req.body;
    const userId = req.user.id; // From authMiddleware

    if (!name) {
      return res.status(400).json({ message: "Group name is required" });
    }

    const group = await StudyGroup.create({
      name,
      description,
      subjects,
      createdBy: userId,
      members: [userId]
    });

    // Populate creator and members info before sending response
    const populatedGroup = await StudyGroup.findById(group._id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.error("Create group error:", error);
    res.status(500).json({ message: "Failed to create group", error: error.message });
  }
};

/**
 * POST /groups/:id/join
 * Join an existing study group
 */
export const joinGroup = async (req, res) => {
  try {
    const userId = req.user.id; // From authMiddleware
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const alreadyMember = group.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ message: "Already a member of this group" });
    }

    group.members.push(userId);
    await group.save();

    res.status(200).json({ message: "Joined group successfully" });
  } catch (error) {
    console.error("Join group error:", error);
    res.status(500).json({ message: "Failed to join group", error: error.message });
  }
};

/**
 * POST /groups/:id/leave
 * Leave a study group
 */
export const leaveGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(400).json({ message: "You are not a member of this group" });
    }

    // Don't allow creator to leave if there are other members
    if (group.createdBy.toString() === userId.toString() && group.members.length > 1) {
      return res.status(400).json({ message: "Transfer ownership before leaving or remove all members" });
    }

    group.members = group.members.filter(
      (memberId) => memberId.toString() !== userId.toString()
    );
    
    await group.save();

    res.status(200).json({ message: "Left group successfully" });
  } catch (error) {
    console.error("Leave group error:", error);
    res.status(500).json({ message: "Failed to leave group", error: error.message });
  }
};
