import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getHelpPosts, createHelpPost } from "../api/help.api";
import HelpPost from "../components/help/HelpPost";
import "../styles/help.css";

export default function HelpDesk() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const fetchPosts = async () => {
    try {
      setError("");
      const response = await getHelpPosts();
      setPosts(response.data);
    } catch (err) {
      console.error("Failed to load posts:", err);
      setError(err.response?.data?.message || "Failed to load help posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      setIsCreating(true);

      await createHelpPost(formData);

      setFormData({ title: "", description: "" });
      setShowCreateForm(false);
      setSuccessMessage("Question posted successfully!");

      setTimeout(() => setSuccessMessage(""), 3000);

      await fetchPosts();
    } catch (err) {
      console.error("Failed to create post:", err);
      setError(err.response?.data?.message || "Failed to create question");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCommentAdded = async () => {
    await fetchPosts();
    setSuccessMessage("Comment added successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  if (loading) {
    return (
      <div className="help-container">
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Loading help desk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="help-container">
      <div className="help-header">
        <div>
          <h1>Help Desk - Q&A</h1>
          <p className="header-subtitle">Ask questions and get help from the community</p>
        </div>
        {user && (
          <button className="create-post-btn" onClick={() => setShowCreateForm(!showCreateForm)}>
            <span>+</span> Ask Question
          </button>
        )}
      </div>

      {error && (
        <div className="message-box error-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="message-box success-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {user && showCreateForm && (
        <div className="create-post-section">
          <h2>Ask a Question</h2>

          <form onSubmit={handleCreatePost} className="create-post-form">
            <div className="form-group">
              <label htmlFor="title">Question Title</label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What's your question?"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Details</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide more details about your question..."
                rows={4}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={isCreating}
                className="btn-submit"
              >
                {isCreating ? "Posting..." : "Post Question"}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ title: "", description: "" });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="posts-section">
        <div className="section-header">
          <h2>Questions ({posts.length})</h2>
        </div>

        {posts.length > 0 ? (
          <div className="posts-list">
            {posts.map((post) => (
              <HelpPost
                key={post._id}
                post={post}
                onCommentAdded={handleCommentAdded}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <h3>No questions yet</h3>
            <p>Be the first to ask a question and get help from the community</p>
          </div>
        )}
      </div>
    </div>
  );
}