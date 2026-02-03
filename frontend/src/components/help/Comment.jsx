export default function Comment({ comment }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="comment">
      <div className="comment-header">
        <strong>{comment.createdBy.name}</strong>
        <span className="comment-date">{formatDate(comment.createdAt)}</span>
      </div>
      <p className="comment-text">{comment.text}</p>
    </div>
  );
}
