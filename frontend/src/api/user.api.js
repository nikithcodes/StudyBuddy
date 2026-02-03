import api from "./axios";

export const getUser = (id) => api.get(`/user/${id}`);
export const updateUser = (id, data) => api.put(`/user/${id}`, data);
export const getCurrentUser = () => api.get("/auth/me");
export const getBuddyMatches = () => api.get("/user/matches");
