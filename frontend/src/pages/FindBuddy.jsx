import { useEffect, useMemo, useState } from "react";
import { getBuddyMatches } from "../api/user.api";
import "../styles/findBuddy.css";

const MatchCard = ({ match }) => {
  const { user, score, breakdown } = match;
  const commonSubjects = breakdown?.commonSubjects || [];
  const skills = user?.skills || [];

  const handleConnect = () => {
    window.location.href = `mailto:${user.email}?subject=Study Buddy match&body=Hi ${user.name}, I found you as a great match on StudyBuddy! Let's connect.`;
  };

  return (
    <div className="buddy-card">
      <div className="buddy-card-header">
        <div className="buddy-avatar">
          {user.name?.[0].toUpperCase()}
        </div>
        <div className="buddy-score">
          <span className="score-value">{Math.round(score)}%</span>
          <span className="score-label">Match</span>
        </div>
      </div>

      <div className="buddy-info">
        <h3 className="buddy-name">{user.name}</h3>
        <p className="buddy-meta">{user.branch} • Year {user.year}</p>
        <div className="buddy-preference">
          <span className="preference-badge">{user.studyPreference}</span>
        </div>
      </div>

      {commonSubjects.length > 0 && (
        <div className="buddy-subjects">
          <p className="subjects-label">Shared Subjects:</p>
          <div className="subjects-list">
            {commonSubjects.slice(0, 3).map((subject) => (
              <span key={subject} className="subject-tag">{subject}</span>
            ))}
            {commonSubjects.length > 3 && (
              <span className="subject-tag more">+{commonSubjects.length - 3}</span>
            )}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div className="buddy-skills">
          <p className="skills-label">Skills:</p>
          <div className="skills-list">
            {skills.slice(0, 2).map((skill) => (
              <span key={skill.name} className="skill-chip">{skill.name}</span>
            ))}
          </div>
        </div>
      )}

      <button className="connect-btn" onClick={handleConnect}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Connect
      </button>
    </div>
  );
};

export default function FindBuddy() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ subject: "", preference: "All" });

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setError("");
        setLoading(true);
        const response = await getBuddyMatches();
        setMatches(response.data.matches || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load buddies right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const { user } = match;
      const subjectFilter = filters.subject.trim().toLowerCase();
      const preferenceFilter = filters.preference;

      const matchesPreference =
        preferenceFilter === "All" || user.studyPreference === preferenceFilter;

      const matchesSubject = subjectFilter
        ? user.subjects?.some((subject) => subject.toLowerCase().includes(subjectFilter))
        : true;

      return matchesPreference && matchesSubject;
    });
  }, [matches, filters]);

  return (
    <div className="find-buddy-page">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <h1>Find Your Study Partner</h1>
          <p className="header-subtitle">Discover peers with matching goals and schedules</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="subject-filter">Search by Subject</label>
            <div className="filter-input-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                id="subject-filter"
                type="text"
                placeholder="e.g., Data Structures, Physics..."
                value={filters.subject}
                onChange={(e) => setFilters((prev) => ({ ...prev, subject: e.target.value }))}
              />
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="preference-filter">Study Preference</label>
            <select
              id="preference-filter"
              value={filters.preference}
              onChange={(e) => setFilters((prev) => ({ ...prev, preference: e.target.value }))}
            >
              <option value="All">All Types</option>
              <option value="Group">Group Study</option>
              <option value="One-on-One">One-on-One</option>
              <option value="Doubt Help">Doubt Help</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <div className="results-header">
          <div>
            <h2>Recommended Buddies</h2>
            <p className="results-count">{filteredMatches.length} potential matches</p>
          </div>
          <p className="results-subtitle">Sorted by compatibility score</p>
        </div>

        {loading && (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Finding your perfect study partners...</p>
          </div>
        )}

        {error && (
          <div className="error-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredMatches.length === 0 && (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" fill="#f5f0ff"/>
              <circle cx="22" cy="24" r="6" stroke="#667eea" strokeWidth="2"/>
              <circle cx="42" cy="24" r="6" stroke="#667eea" strokeWidth="2"/>
              <path d="M32 40c-4 0-6 2-6 4v4h12v-4c0-2-2-4-6-4z" stroke="#667eea" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No matches found</h3>
            <p>Try adjusting your filters or update your profile to see more matches</p>
          </div>
        )}

        {!loading && !error && filteredMatches.length > 0 && (
          <div className="buddies-grid">
            {filteredMatches.map((match) => (
              <MatchCard key={match.user._id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}