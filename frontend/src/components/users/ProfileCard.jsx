function ProfileCard({ user }) {
  return (
    <div className="profile-card">
      <div className="profile-header">
        <img src={user.avatar} alt={user.name} className="profile-avatar" />
        <div className="profile-header-info">
          <h1>{user.name}</h1>
          <p className="profile-email">{user.email}</p>
          <p className="profile-points">Points: {user.points}</p>
        </div>
      </div>
      <div className="profile-body">
        <div className="profile-section">
          <h3>Subjects</h3>
          <ul>
            {user.subjects?.map((subject) => (
              <li key={subject}>{subject}</li>
            ))}
          </ul>
        </div>
        <div className="profile-section">
          <h3>Bio</h3>
          <p>{user.bio}</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
