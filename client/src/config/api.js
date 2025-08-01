// Configuration centralisée pour l'API
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://classe-numerique.fly.dev';

// URLs pour les différents endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    VERIFY: `${API_BASE_URL}/api/auth/verify`,
  },
  CONTENT: {
    BASE: `${API_BASE_URL}/api/content`,
    BY_LEVEL_CATEGORY: (level, category) => `${API_BASE_URL}/api/content/${level}/${category}`,
    BY_ID: (id) => `${API_BASE_URL}/api/content/${id}`,
  },
  STUDENTS: {
    BASE: `${API_BASE_URL}/api/students`,
    BY_ID: (id) => `${API_BASE_URL}/api/students/${id}`,
    STATUS: (id) => `${API_BASE_URL}/api/students/${id}/status`,
  },
  CONTACT: {
    MESSAGES: `${API_BASE_URL}/api/contact/messages`,
    MESSAGE_BY_ID: (id) => `${API_BASE_URL}/api/contact/messages/${id}`,
  },
  UPLOADS: {
    FILE: (filePath) => `${API_BASE_URL}/${filePath}`,
  },
};

export default API_BASE_URL; 