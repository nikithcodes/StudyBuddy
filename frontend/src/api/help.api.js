import api from "./axios";

/**
 * Fetch all help posts
 */
export const getHelpPosts = () => api.get("/help");

/**
 * Create a new help post
 */
export const createHelpPost = (data) => api.post("/help", data);

/**
 * Add a comment to a help post
 */
export const addComment = (postId, text) =>
  api.post(`/help/${postId}/comment`, { text });
