function GroupPost({ post }) {
  return (
    <div className="group-post">
      <div className="post-header">
        <div className="post-author">
          <img src={post.author.avatar} alt={post.author.name} />
          <div>
            <h4>{post.author.name}</h4>
            <span className="post-time">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      <div className="post-footer">
        <button className="btn-like">👍 Like</button>
        <button className="btn-comment">💬 Comment</button>
      </div>
    </div>
  )
}

export default GroupPost
