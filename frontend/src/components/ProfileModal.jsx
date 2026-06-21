// components/ProfileModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  FaTimes, 
  FaUser, 
  FaCamera, 
  FaImages,
  FaSave,
  FaSignOutAlt,
  FaLock,
  FaCheckCircle,
  FaClock,
  FaTasks,
  FaChartBar,
  FaMoon,
  FaSun,
  FaCheck,
  FaTrophy,
  FaCalendarAlt,
  FaEdit,
  FaUsers,
  FaStar,
  FaTrash,
} from 'react-icons/fa';
import profileService from '../services/profileService';
import '../styles/profile.css';

const ProfileModal = ({ isOpen, onClose, onLogout, onThemeChange }) => {
  
  // ==================== STATE ====================
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: null,
    memberSince: '',
  });
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
  });
  const [achievements, setAchievements] = useState([]);
  const [activity, setActivity] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('pink');
  const [isLoading, setIsLoading] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProfile, setEditingProfile] = useState({});
  const fileInputRef = useRef(null);

  // ==================== AVATAR OPTIONS ====================
  const avatarOptions = ['👩‍💻', '👨‍💻', '🧑‍🎨', '👩‍🎓', '👨‍🚀', '👩‍🔬', '🧑‍🏫', '👨‍💼', '👩‍⚕️', '👨‍🔧'];

  // ==================== FETCH PROFILE DATA ====================
  useEffect(() => {
    if (isOpen) {
      fetchProfileData();
    }
  }, [isOpen]);

  const profileData = await profileService.getProfile();

setProfile(profileData);
setEditingProfile(profileData);

try {
  const statsData = await profileService.getStats();
  setStats(statsData);
} catch {}

try {
  const achievementsData = await profileService.getAchievements();
  setAchievements(achievementsData);
} catch {}

try {
  const activityData = await profileService.getRecentActivity();
  setActivity(activityData);
} catch {}

   
  // ==================== HANDLE PROFILE UPDATE ====================
  const handleProfileUpdate = async () => {
    try {
      const updated = await profileService.updateProfile(editingProfile);
      setProfile(updated);
      setEditingProfile(updated);
      setIsEditing(false);
      showNotification('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // ==================== HANDLE AVATAR UPLOAD ====================
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image (jpg, jpeg, png, webp)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      const result = await profileService.uploadProfilePicture(file);
      setProfile({ ...profile, avatar: result.avatar });
      showNotification('Profile picture updated!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  // ==================== HANDLE AVATAR SELECT ====================
  const handleAvatarSelect = (emoji) => {
    setProfile({ ...profile, avatar: emoji });
    setShowAvatarPicker(false);
    showNotification('Avatar updated!');
  };

  // ==================== HANDLE THEME CHANGE ====================
  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    if (onThemeChange) onThemeChange(theme);
  };

  // ==================== HANDLE DARK MODE TOGGLE ====================
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (onThemeChange) onThemeChange({ darkMode: !isDarkMode });
  };

  // ==================== HANDLE LOGOUT ====================
  const handleLogout = () => {
    if (onLogout) onLogout();
    onClose();
  };

  // ==================== NOTIFICATION HELPER ====================
  const showNotification = (message) => {
    // Implement your notification logic here
    console.log(message);
  };

  // ==================== FORMAT DATE ====================
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // ==================== GET ACTIVITY ICON ====================
  const getActivityIcon = (type) => {
    switch (type) {
      case 'task_created': return <FaTasks />;
      case 'task_completed': return <FaCheckCircle />;
      case 'task_deleted': return <FaTrash />;
      default: return <FaClock />;
    }
  };

  // ==================== RENDER ====================
  console.log("Modal isOpen =", isOpen);

  if (!isOpen) return null;

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div 
        className={`profile-modal ${isDarkMode ? 'dark' : 'light'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="profile-modal-content">
          {/* ==================== HEADER ==================== */}
          <div className="profile-modal-header" style={{ padding: '25px 35px 15px' }}>
            <h2>Profile Settings</h2>
            <button className="profile-modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <div className="profile-modal-scroll">
            {/* ==================== PROFILE HEADER ==================== */}
            <div className="profile-header">
              <div className="profile-avatar-section">
                <div className="profile-avatar-wrapper">
                  {profile.avatar && profile.avatar.startsWith('data:image') ? (
                    <img src={profile.avatar} alt="Profile" className="profile-avatar" />
                  ) : profile.avatar ? (
                    <div className="profile-avatar-placeholder">
                      {profile.avatar}
                    </div>
                  ) : (
                    <div className="profile-avatar-placeholder">
                      <FaUser />
                    </div>
                  )}
                  <div className="profile-avatar-overlay">
                    <button 
                      className="profile-avatar-btn upload"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FaCamera />
                    </button>
                    <button 
                      className="profile-avatar-btn avatar-select"
                      onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    >
                      <FaImages />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    style={{ display: 'none' }}
                    onChange={handleAvatarUpload}
                  />
                </div>

                {showAvatarPicker && (
                  <div className="avatar-picker">
                    {avatarOptions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleAvatarSelect(emoji)}
                        className={profile.avatar === emoji ? 'selected' : ''}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="profile-info">
                <h2>{profile.username || 'User'}</h2>
                <p className="email">{profile.email || 'user@email.com'}</p>
                <p className="member-since">
                  <FaCalendarAlt style={{ marginRight: '5px', opacity: 0.5 }} />
                  Member since {formatDate(profile.memberSince)}
                </p>
                <span className="badge">★ Pro Member</span>
              </div>
            </div>

            {/* ==================== PROFILE GRID ==================== */}
            <div className="profile-grid">
              {/* ==================== PERSONAL INFORMATION ==================== */}
              <div className="section-card">
                <h3>
                  <FaUser className="icon" /> Personal Information
                </h3>
                {isEditing ? (
                  <>
                    <div className="profile-form-group">
                      <label>Username</label>
                      <input
                        type="text"
                        value={editingProfile.username || ''}
                        onChange={(e) => setEditingProfile({ ...editingProfile, username: e.target.value })}
                      />
                    </div>
                    <div className="profile-form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={editingProfile.email || ''}
                        onChange={(e) => setEditingProfile({ ...editingProfile, email: e.target.value })}
                      />
                    </div>
                    <div className="profile-form-group">
                      <label>Bio</label>
                      <textarea
                        value={editingProfile.bio || ''}
                        onChange={(e) => setEditingProfile({ ...editingProfile, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <button className="profile-btn profile-btn-primary profile-btn-block" onClick={handleProfileUpdate}>
                      <FaSave /> Save Changes
                    </button>
                    <button className="profile-btn profile-btn-secondary profile-btn-block mt-10" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p style={{ margin: '5px 0', opacity: 0.7 }}><strong>Username:</strong> {profile.username}</p>
                    <p style={{ margin: '5px 0', opacity: 0.7 }}><strong>Email:</strong> {profile.email}</p>
                    <p style={{ margin: '5px 0 15px 0', opacity: 0.7 }}><strong>Bio:</strong> {profile.bio || 'No bio yet'}</p>
                    <button className="profile-btn profile-btn-secondary profile-btn-block" onClick={() => setIsEditing(true)}>
                      <FaEdit /> Edit Profile
                    </button>
                  </>
                )}
              </div>

              {/* ==================== TASK STATISTICS ==================== */}
              <div className="section-card">
                <h3>
                  <FaChartBar className="icon" /> Task Statistics
                </h3>
                <div className="stats-grid">
                  <div className="stat-item total">
                    <span className="stat-number">{stats.total}</span>
                    <span className="stat-label">Total Tasks</span>
                  </div>
                  <div className="stat-item completed">
                    <span className="stat-number">{stats.completed}</span>
                    <span className="stat-label">Completed</span>
                  </div>
                  <div className="stat-item pending">
                    <span className="stat-number">{stats.pending}</span>
                    <span className="stat-label">Pending</span>
                  </div>
                  <div className="stat-item rate">
                    <span className="stat-number">{stats.completionRate}%</span>
                    <span className="stat-label">Completion Rate</span>
                  </div>
                </div>
                <div style={{ marginTop: '15px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${stats.completionRate}%`, height: '100%', background: 'linear-gradient(90deg, #ec4899, #8b5cf6)', borderRadius: '3px', transition: 'width 0.5s ease' }} />
                </div>
              </div>

              {/* ==================== APPEARANCE SETTINGS ==================== */}
              <div className="section-card">
                <h3>
                  <FaMoon className="icon" /> Appearance Settings
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span>Dark Mode</span>
                  <div className="toggle-switch" onClick={toggleDarkMode}>
                    <div className={`toggle-track ${isDarkMode ? 'active' : ''}`}>
                      <div className="toggle-thumb" />
                    </div>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '8px' }}>Theme Color</label>
                  <div className="theme-selector">
                    <button 
                      className={`theme-color-btn pink ${selectedTheme === 'pink' ? 'active' : ''}`}
                      onClick={() => handleThemeChange('pink')}
                    />
                    <button 
                      className={`theme-color-btn blue ${selectedTheme === 'blue' ? 'active' : ''}`}
                      onClick={() => handleThemeChange('blue')}
                    />
                    <button 
                      className={`theme-color-btn purple ${selectedTheme === 'purple' ? 'active' : ''}`}
                      onClick={() => handleThemeChange('purple')}
                    />
                  </div>
                </div>
              </div>

              {/* ==================== ACCOUNT SETTINGS ==================== */}
              <div className="section-card">
                <h3>
                  <FaLock className="icon" /> Account Settings
                </h3>
                <div className="account-actions">
                  <button className="profile-btn profile-btn-secondary profile-btn-block">
                    <FaLock /> Change Password
                  </button>
                  <button className="profile-btn profile-btn-danger profile-btn-block" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>

              {/* ==================== ACHIEVEMENTS ==================== */}
              <div className="section-card" style={{ gridColumn: '1 / -1' }}>
                <h3>
                  <FaTrophy className="icon" /> Achievements
                </h3>
                <div className="achievements-grid">
                  {achievements.length > 0 ? (
                    achievements.map((achievement) => (
                      <div key={achievement.id} className="achievement-item">
                        <span className="emoji">{achievement.unlocked ? achievement.emoji : '🔒'}</span>
                        <div className="info">
                          <div className="title">{achievement.title}</div>
                          <div className="desc">{achievement.description}</div>
                        </div>
                        {achievement.unlocked && <FaCheck style={{ color: '#22c55e' }} />}
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', opacity: 0.5, gridColumn: '1 / -1' }}>
                      Complete tasks to unlock achievements! ✨
                    </div>
                  )}
                </div>
              </div>

              {/* ==================== RECENT ACTIVITY ==================== */}
              <div className="section-card" style={{ gridColumn: '1 / -1' }}>
                <h3>
                  <FaClock className="icon" /> Recent Activity
                </h3>
                <div className="activity-timeline">
                  {activity.length > 0 ? (
                    activity.map((item, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-icon">
                          {getActivityIcon(item.type)}
                        </div>
                        <div className="activity-content">
                          <p className="action">{item.action}</p>
                          <p className="time">{item.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', opacity: 0.5 }}>
                      No recent activity
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;