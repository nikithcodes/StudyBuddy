import HelpPost from "../models/HelpPost.js";

/**
 * GET /help
 * List all help posts with comments
 */
export const getHelpPosts = async (req, res) => {
  try {
    const posts = await HelpPost.find()
      .populate("createdBy", "name email")
      .populate("comments.createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Get help posts error:", error);
    res.status(500).json({ message: "Failed to fetch help posts", error: error.message });
  }
};

/**
 * POST /help
 * Create a new help post
 * Only authenticated users can create posts
 */
export const createHelpPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id; // From authMiddleware

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }

    const post = await HelpPost.create({
      title: title.trim(),
      description: description.trim(),
      createdBy: userId,
      comments: [],
    });

    // Populate creator info before sending response
    const populatedPost = await HelpPost.findById(post._id)
      .populate("createdBy", "name email")
      .populate("comments.createdBy", "name email");

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Create help post error:", error);
    res.status(500).json({ message: "Failed to create help post", error: error.message });
  }
};

/**
 * POST /help/:id/comment
 * Add a comment to a help post
 * Only authenticated users can comment
 */
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { id } = req.params;
    const userId = req.user.id; // From authMiddleware

    // Validation
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await HelpPost.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Help post not found" });
    }

    // Add comment to the post
    const comment = {
      text: text.trim(),
      createdBy: userId,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    // Populate and return updated post
    const updatedPost = await HelpPost.findById(id)
      .populate("createdBy", "name email")
      .populate("comments.createdBy", "name email");

    res.status(201).json({
      message: "Comment added successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
};
