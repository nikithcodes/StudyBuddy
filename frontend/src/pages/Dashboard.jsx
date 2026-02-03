import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { getGroups, joinGroup } from "../api/group.api";
import { getHelpPosts } from "../api/help.api";
import { getCurrentUser } from "../api/auth.api";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGroups: 0,
    joinedGroups: 0,
    helpPosts: 0,
    points: 0
  });
  const [allGroups, setAllGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [recentHelpPosts, setRecentHelpPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [joiningGroupId, setJoiningGroupId] = useState(null);

  // Real-time polling interval
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchDashboardData();

    // Refresh data every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchDashboardData(true); // silent refresh
    }, 30000);

    return () => clearInterval(interval);
  }, [token, navigate]);

  const fetchDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [userRes, groupsRes, helpRes] = await Promise.all([
        getCurrentUser(),
        getGroups(),
        getHelpPosts()
      ]);

      const userData = userRes.data.user;
      const groupsData = groupsRes.data;
      const helpData = helpRes.data;

      setCurrentUser(userData);

      // Filter joined and available groups
      const joined = groupsData.filter(group => 
        group.members.some(member => member._id === userData.id)
      );
      const available = groupsData.filter(group => 
        !group.members.some(member => member._id === userData.id)
      );

      setAllGroups(groupsData);
      setJoinedGroups(joined);
      setAvailableGroups(available);
      setRecentHelpPosts(helpData.slice(0, 5));

      setStats({
        totalGroups: groupsData.length,
        joinedGroups: joined.length,
        helpPosts: helpData.length,
        points: userData.points || 0
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    setJoiningGroupId(groupId);
    try {
      await joinGroup(groupId);
      await fetchDashboardData(true);
    } catch (error) {
      console.error("Error joining group:", error);
      alert(error.response?.data?.message || "Failed to join group");
    } finally {
      setJoiningGroupId(null);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loader">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {currentUser?.name}! 👋</h1>
          <p className="welcome-subtitle">Here's what's happening with your study groups today</p>
        </div>
        <div className="quick-actions">
          <Link to="/groups" className="action-btn primary">
            Create Group
          </Link>
          <Link to="/help" className="action-btn secondary">
            Ask for Help
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#667eea' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-value">{stats.joinedGroups}</p>
            <p className="stat-label">Groups Joined</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f093fb' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-value">{stats.totalGroups}</p>
            <p className="stat-label">Total Groups</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#4facfe' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
              <path d="M12 16v-4M12 8h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-value">{stats.helpPosts}</p>
            <p className="stat-label">Help Posts</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#43e97b' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-value">{stats.points}</p>
            <p className="stat-label">Points Earned</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* My Groups Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>My Study Groups</h2>
            <Link to="/groups" className="view-all-link">View All →</Link>
          </div>
          {joinedGroups.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" fill="#f5f0ff"/>
                <path d="M32 20v24M20 32h24" stroke="#667eea" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <p>You haven't joined any study groups yet</p>
              <Link to="/groups" className="empty-state-btn">Browse Groups</Link>
            </div>
          ) : (
            <div className="groups-grid">
              {joinedGroups.map(group => (
                <div key={group._id} className="group-card joined">
                  <div className="group-card-header">
                    <h3>{group.name}</h3>
                    <span className="member-badge">{group.members.length} members</span>
                  </div>
                  <p className="group-description">{group.description || "No description"}</p>
                  {group.subjects && group.subjects.length > 0 && (
                    <div className="group-subjects">
                      {group.subjects.slice(0, 3).map((subject, idx) => (
                        <span key={idx} className="subject-tag">{subject}</span>
                      ))}
                    </div>
                  )}
                  <div className="group-card-footer">
                    <Link to={`/groups`} className="group-action-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Groups Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Available Groups to Join</h2>
            <Link to="/groups" className="view-all-link">View All →</Link>
          </div>
          {availableGroups.length === 0 ? (
            <div className="empty-state">
              <p>No new groups available at the moment</p>
            </div>
          ) : (
            <div className="groups-grid">
              {availableGroups.slice(0, 4).map(group => (
                <div key={group._id} className="group-card available">
                  <div className="group-card-header">
                    <h3>{group.name}</h3>
                    <span className="member-badge">{group.members.length} members</span>
                  </div>
                  <p className="group-description">{group.description || "No description"}</p>
                  {group.subjects && group.subjects.length > 0 && (
                    <div className="group-subjects">
                      {group.subjects.slice(0, 3).map((subject, idx) => (
                        <span key={idx} className="subject-tag">{subject}</span>
                      ))}
                    </div>
                  )}
                  <div className="group-card-footer">
                    <button 
                      onClick={() => handleJoinGroup(group._id)}
                      className="group-action-btn join"
                      disabled={joiningGroupId === group._id}
                    >
                      {joiningGroupId === group._id ? "Joining..." : "Join Group"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Help Posts */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Help Requests</h2>
            <Link to="/help" className="view-all-link">View All →</Link>
          </div>
          {recentHelpPosts.length === 0 ? (
            <div className="empty-state">
              <p>No help requests yet</p>
            </div>
          ) : (
            <div className="help-posts-list">
              {recentHelpPosts.map(post => (
                <div key={post._id} className="help-post-item">
                  <div className="help-post-content">
                    <h4>{post.title}</h4>
                    <p className="help-post-meta">
                      by {post.createdBy?.name} • {post.comments?.length || 0} comments
                    </p>
                  </div>
                  <Link to="/help" className="help-post-link">View →</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Real-time indicator */}
      <div className="live-indicator">
        <span className="live-dot"></span>
        Live Updates Active
      </div>
    </div>
  );
}
