import { useEffect, useState } from "react";
import {
  getGroups,
  createGroup,
  joinGroup
} from "../api/group.api";
import GroupCard from "../components/groups/GroupCard";
import "../styles/groups.css";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subjects, setSubjects] = useState("");

  const fetchGroups = async () => {
    try {
      setError("");
      const res = await getGroups();
      setGroups(res.data);
    } catch (err) {
      console.error("Failed to load groups:", err);
      setError(err.response?.data?.message || "Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Group name is required");
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      setIsCreating(true);
      
      const response = await createGroup({
        name,
        description,
        subjects: subjects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      });

      console.log("Group created:", response.data);
      
      setName("");
      setDescription("");
      setSubjects("");
      setShowCreateForm(false);
      setSuccessMessage("Group created successfully!");
      
      setTimeout(() => setSuccessMessage(""), 3000);
      
      await fetchGroups();
    } catch (err) {
      console.error("Failed to create group:", err);
      setError(err.response?.data?.message || "Failed to create group");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoin = async (groupId) => {
    try {
      setError("");
      await joinGroup(groupId);
      setSuccessMessage("Joined group successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      await fetchGroups();
    } catch (err) {
      console.error("Failed to join group:", err);
      setError(err.response?.data?.message || "Failed to join group");
    }
  };

  const handleViewMembers = (group) => {
    setSelectedGroup(group);
  };

  if (loading) {
    return (
      <div className="groups-container">
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="groups-container">
      {/* Header */}
      <div className="groups-header">
        <div>
          <h1>Study Groups</h1>
          <p className="header-subtitle">Create or join groups to study together</p>
        </div>
        <button 
          className="create-group-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Create Group
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="message-box error-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}

      {successMessage && (
        <div className="message-box success-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {successMessage}
        </div>
      )}

      {/* Create Group Form */}
      {showCreateForm && (
        <div className="create-group-section">
          <h2>Create New Study Group</h2>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="group-name">Group Name</label>
              <input
                id="group-name"
                type="text"
                placeholder="e.g., Data Structures Study Group"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="group-description">Description</label>
              <textarea
                id="group-description"
                placeholder="Describe the group's focus and goals..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="group-subjects">Subjects (comma separated)</label>
              <input
                id="group-subjects"
                type="text"
                placeholder="e.g., Data Structures, Algorithms, Trees"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Group"}
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Groups List */}
      <div className="groups-section">
        <div className="section-header">
          <h2>All Study Groups ({groups.length})</h2>
        </div>

        {groups.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" fill="#f5f0ff"/>
              <path d="M32 20v24M20 32h24" stroke="#667eea" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <h3>No groups yet</h3>
            <p>Be the first to create a study group!</p>
          </div>
        ) : (
          <div className="groups-grid">
            {groups.map((group) => (
              <GroupCard
                key={group._id}
                group={group}
                onJoin={handleJoin}
                onViewMembers={handleViewMembers}
              />
            ))}
          </div>
        )}
      </div>

      {/* Members Modal */}
      {selectedGroup && (
        <div className="modal-overlay" onClick={() => setSelectedGroup(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedGroup.name}</h2>
              <button 
                className="modal-close"
                onClick={() => setSelectedGroup(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <h3>Group Members ({selectedGroup.members?.length})</h3>
              {selectedGroup.members && selectedGroup.members.length > 0 ? (
                <div className="members-list">
                  {selectedGroup.members.map((member, idx) => (
                    <div key={idx} className="member-item">
                      <div className="member-avatar">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div className="member-info">
                        <p className="member-name">{member.name}</p>
                        <p className="member-email">{member.email}</p>
                      </div>
                      {idx === 0 && (
                        <span className="badge-creator">Creator</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-members">No members in this group yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
