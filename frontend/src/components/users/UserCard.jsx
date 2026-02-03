function UserCard({ user }) {
  return (
    <div className="user-card">
      <div className="user-avatar">
        <img src={user.avatar} alt={user.name} />
      </div>
      <div className="user-info">
        <h3>{user.name}</h3>
        <p className="user-subjects">{user.subjects?.join(', ')}</p>
        <p className="user-bio">{user.bio}</p>
        <button className="btn-connect">Connect</button>
      </div>
    </div>
  )
}

export default UserCard
