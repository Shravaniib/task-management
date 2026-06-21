// services/profileService.js
import api from './api';

// Profile service with all API calls
const profileService = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/tasks/profile/');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Update profile
//   updateProfile: async (profileData) => {
//     try {
//       const response = await api.put('/tasks/profile/', profileData);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       throw error;
//     }
//   },

  // Upload profile picture
//   uploadProfilePicture: async (file) => {
//     try {
//       const formData = new FormData();
//       formData.append('avatar', file);
      
//       const response = await api.post('/tasks/profile/avatar/', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error uploading avatar:', error);
//       throw error;
//     }
//   },

  // Change password
//   changePassword: async (passwordData) => {
//     try {
//       const response = await api.post('/tasks/change-password/', passwordData);
//       return response.data;
//     } catch (error) {
//       console.error('Error changing password:', error);
//       throw error;
//     }
//   },

  // Get user statistics
//   getStats: async () => {
//     try {
//       const response = await api.get('/tasks/stats/');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//       throw error;
//     }
//   },

  // Get user achievements
//   getAchievements: async () => {
//     try {
//       const response = await api.get('/tasks/achievements/');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching achievements:', error);
//       throw error;
//     }
//   },

  // Get recent activity
//   getRecentActivity: async () => {
//     try {
//       const response = await api.get('/tasks/activity/');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching activity:', error);
//       throw error;
//     }
//   },

  // Update theme preferences
//   updateThemePreferences: async (preferences) => {
//     try {
//       const response = await api.put('/tasks/theme-preferences/', preferences);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating theme preferences:', error);
//       throw error;
//     }
//   },
};

export default profileService;