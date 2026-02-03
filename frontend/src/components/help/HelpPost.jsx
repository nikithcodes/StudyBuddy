import { useState } from "react";
import { addComment } from "../../api/help.api";
import Comment from "./Comment";

export default function HelpPost({ post, onCommentAdded }) {
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await addComment(post._id, commentText);

      setCommentText("");
      onCommentAdded();
    } catch (err) {
      console.error("Failed to add comment:", err);
      setError(err.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="help-post">
      <div className="post-header">
        <h2>{post.title}</h2>
        <span className="post-author">
          by {post.createdBy.name} • {formatDate(post.createdAt)}
        </span>
      </div>

      <div className="post-description">
        <p>{post.description}</p>
      </div>

      <div className="post-comments-section">
        <h3>Comments ({post.comments?.length || 0})</h3>

        <div className="comments-list">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))
          ) : (
            <p className="no-comments">No comments yet. Be the first to help!</p>
          )}
        </div>

        <form onSubmit={handleAddComment} className="comment-form">
          <h4>Add Your Comment</h4>

          {error && <div className="error-message">{error}</div>}

          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Type your comment here..."
            rows={3}
            className="comment-input"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-submit-comment"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      </div>
    </div>
  );
}
