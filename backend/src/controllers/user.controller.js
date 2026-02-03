import User from "../models/User.js";
import { calculateMatchScore } from "../utils/matchScore.js";

export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "name email branch year subjects skills studyPreference availability points role createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // From authMiddleware

    // Prevent users from updating others' profiles
    if (id !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized: Cannot update other user's profile" });
    }

    const { name, branch, year, subjects, skills, studyPreference, availability } = req.body;

    // Validate required fields if provided
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    if (year !== undefined && (year < 1 || year > 5)) {
      return res.status(400).json({ message: "Year must be between 1 and 5" });
    }

    if (
      studyPreference &&
      !["Group", "One-on-One", "Doubt Help"].includes(studyPreference)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid study preference" });
    }

    // Build update object (only allow specific fields)
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (branch !== undefined) updateData.branch = branch;
    if (year !== undefined) updateData.year = year;
    if (subjects !== undefined) updateData.subjects = subjects;
    if (skills !== undefined) updateData.skills = skills;
    if (studyPreference !== undefined) updateData.studyPreference = studyPreference;
    if (availability !== undefined) updateData.availability = availability;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select(
      "name email branch year subjects skills studyPreference availability points role createdAt"
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const findStudyBuddies = async (req, res) => {
  try {
    const userId = req.user.id;

    const currentUser = await User.findById(userId).select(
      "name email branch year subjects skills studyPreference availability points"
    );

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const others = await User.find({ _id: { $ne: userId } }).select(
      "name email branch year subjects skills studyPreference availability points createdAt"
    );

    const matches = others
      .map((candidate) => {
        const { score, breakdown } = calculateMatchScore(currentUser, candidate);
        return {
          user: candidate,
          score,
          breakdown,
        };
      })
      .filter((match) => match.score > 0)
      .sort((a, b) => b.score - a.score);

    return res.json({ matches });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch buddies", error: error.message });
  }
};
