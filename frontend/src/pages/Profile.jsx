import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUser, updateUser } from "../api/user.api";
import "../styles/profile.css";

export default function Profile() {
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    year: "",
    subjects: [],
    skills: [],
    studyPreference: "Group",
    availability: [],
  });

  const [newSubject, setNewSubject] = useState("");
  const [newSkill, setNewSkill] = useState({ name: "", level: "Beginner" });

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      if (!currentUser?.id) {
        setError("Please log in to view your profile");
        setLoading(false);
        return;
      }

      const response = await getUser(currentUser.id);
      setProfile(response.data.user);

      // Initialize form with profile data
      setFormData({
        name: response.data.user.name || "",
        branch: response.data.user.branch || "",
        year: response.data.user.year || "",
        subjects: response.data.user.subjects || [],
        skills: response.data.user.skills || [],
        studyPreference: response.data.user.studyPreference || "Group",
        availability: response.data.user.availability || [],
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? parseInt(value) : value,
    }));
  };

  const addSubject = () => {
    if (newSubject.trim()) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, newSubject],
      }));
      setNewSubject("");
    }
  };

  const removeSubject = (index) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      setNewSkill({ name: "", level: "Beginner" });
    }
  };

  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccessMessage("");

      const response = await updateUser(currentUser.id, formData);

      setProfile(response.data.user);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="profile-container">
        <div className="message-box error-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>Please log in to view your profile</span>
        </div>
      </div>
    );
  }

  // Get user initials for avatar
  const getInitials = () => {
    const name = profile?.name || currentUser?.name || "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div>
          <h1>My Profile</h1>
          <p className="header-subtitle">Manage your account and preferences</p>
        </div>
        {!isEditing && (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            <span>✎</span> Edit Profile
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

      {!isEditing ? (
        // View Mode
        <div className="profile-view">
          {/* User Card */}
          <div className="user-card">
            <div className="user-avatar">{getInitials()}</div>
            <div className="user-info">
              <h2>{profile?.name}</h2>
              <p className="user-email">{profile?.email}</p>
              <p className="user-points">
                <span className="points-badge">{profile?.points || 0} pts</span>
              </p>
            </div>
          </div>

          {/* Profile Grid */}
          <div className="profile-grid">
            <div className="profile-card-item">
              <label>Branch</label>
              <p className="value">{profile?.branch || "Not set"}</p>
            </div>

            <div className="profile-card-item">
              <label>Year</label>
              <p className="value">{profile?.year ? `${profile.year}${profile.year === 1 ? "st" : profile.year === 2 ? "nd" : profile.year === 3 ? "rd" : "th"} Year` : "Not set"}</p>
            </div>

            <div className="profile-card-item">
              <label>Study Preference</label>
              <p className="value">{profile?.studyPreference || "Not set"}</p>
            </div>

            <div className="profile-card-item">
              <label>Member Since</label>
              <p className="value">{profile?.createdAt ? new Date(profile.createdAt).getFullYear() : "Unknown"}</p>
            </div>
          </div>

          {/* Subjects */}
          {profile?.subjects && profile.subjects.length > 0 && (
            <div className="profile-section">
              <h3>Subjects</h3>
              <div className="tags-container">
                {profile.subjects.map((subject, idx) => (
                  <span key={idx} className="tag subject-tag">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {profile?.skills && profile.skills.length > 0 && (
            <div className="profile-section">
              <h3>Skills</h3>
              <div className="skills-container">
                {profile.skills.map((skill, idx) => (
                  <div key={idx} className="skill-badge">
                    <span className="skill-name">{skill.name}</span>
                    <span className={`skill-level ${skill.level.toLowerCase()}`}>
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          {profile?.availability && profile.availability.length > 0 && (
            <div className="profile-section">
              <h3>Availability</h3>
              <div className="tags-container">
                {profile.availability.map((time, idx) => (
                  <span key={idx} className="tag availability-tag">
                    {time}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Edit Mode
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h3>Basic Information</h3>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="branch">Branch</label>
                <input
                  id="branch"
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="year">Year</label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Year</option>
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                  <option value={5}>5th Year</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="studyPreference">Study Preference</label>
              <select
                id="studyPreference"
                name="studyPreference"
                value={formData.studyPreference}
                onChange={handleChange}
              >
                <option value="Group">Group Study</option>
                <option value="One-on-One">One-on-One</option>
                <option value="Doubt Help">Doubt Help</option>
              </select>
            </div>
          </div>

          {/* Subjects Section */}
          <div className="form-section">
            <h3>Subjects</h3>
            <div className="form-row">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Add a subject"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSubject())}
              />
              <button
                type="button"
                onClick={addSubject}
                className="btn-add"
              >
                + Add
              </button>
            </div>
            <div className="tags-container">
              {formData.subjects.map((subject, idx) => (
                <div key={idx} className="tag-removable">
                  <span>{subject}</span>
                  <button
                    type="button"
                    onClick={() => removeSubject(idx)}
                    className="remove-btn"
                    title="Remove subject"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div className="form-section">
            <h3>Skills</h3>
            <div className="form-row">
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, name: e.target.value })
                }
                placeholder="Skill name"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              />
              <select
                value={newSkill.level}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, level: e.target.value })
                }
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button
                type="button"
                onClick={addSkill}
                className="btn-add"
              >
                + Add
              </button>
            </div>
            <div className="skills-container">
              {formData.skills.map((skill, idx) => (
                <div key={idx} className="skill-badge-edit">
                  <span>{skill.name}</span>
                  <span className={`skill-level ${skill.level.toLowerCase()}`}>
                    {skill.level}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSkill(idx)}
                    className="remove-btn"
                    title="Remove skill"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Availability Section */}
          <div className="form-section">
            <h3>Availability</h3>
            <div className="availability-grid">
              {[
                "Mon Morning",
                "Mon Evening",
                "Mon Night",
                "Tue Morning",
                "Tue Evening",
                "Tue Night",
                "Wed Morning",
                "Wed Evening",
                "Wed Night",
                "Thu Morning",
                "Thu Evening",
                "Thu Night",
                "Fri Morning",
                "Fri Evening",
                "Fri Night",
                "Sat Morning",
                "Sat Evening",
                "Sat Night",
                "Sun Morning",
                "Sun Evening",
                "Sun Night",
              ].map((time) => (
                <label key={time} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.availability.includes(time)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData((prev) => ({
                          ...prev,
                          availability: [...prev.availability, time],
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          availability: prev.availability.filter(
                            (t) => t !== time
                          ),
                        }));
                      }
                    }}
                  />
                  {time}
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}