import api from "./axios";

/**
 * Fetch all study groups
 */
export const getGroups = () => api.get("/groups");

/**
 * Create a new study group
 */
export const createGroup = (data) =>
  api.post("/groups", data);

/**
 * Join an existing study group
 */
export const joinGroup = (groupId) =>
  api.post(`/groups/${groupId}/join`);

/**
 * Leave a study group
 */
export const leaveGroup = (groupId) =>
  api.post(`/groups/${groupId}/leave`);
