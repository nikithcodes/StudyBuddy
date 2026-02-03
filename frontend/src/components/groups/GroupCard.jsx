function GroupCard({ group, onJoin, onViewMembers }) {
  return (
    <div className="group-card">
      <div className="group-header">
        <h3>{group.name}</h3>
        <span className="group-members">
          {group.members?.length} members
        </span>
      </div>

      <p className="group-description">{group.description}</p>

      <div className="group-subjects">
        {group.subjects?.map((subject) => (
          <span key={subject} className="subject-badge">
            {subject}
          </span>
        ))}
      </div>

      <div className="group-footer">
        <button 
          className="btn-view"
          onClick={() => onViewMembers(group)}
        >
          View Members
        </button>

        <button
          className="btn-join"
          onClick={() => onJoin(group._id)}
        >
          Join
        </button>
      </div>
    </div>
  );
}

export default GroupCard;
