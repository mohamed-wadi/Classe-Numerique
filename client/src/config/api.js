// Configuration centralisée pour l'API
// Détection automatique de l'environnement local
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const localApiUrl = 'http://localhost:5000';
// Permettre la configuration via variable d'env Netlify (REACT_APP_API_URL)
const productionEnvApiUrl = process.env.REACT_APP_API_URL;
const productionApiUrl = productionEnvApiUrl || 'https://classe-numerique.fly.dev';

export const API_BASE_URL = isLocalhost ? localApiUrl : productionApiUrl;

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
    SEND: `${API_BASE_URL}/api/contact/send`,
    MESSAGES: `${API_BASE_URL}/api/contact/messages`,
    MESSAGE_BY_ID: (id) => `${API_BASE_URL}/api/contact/messages/${id}`,
  },
  UPLOADS: {
    FILE: (filePath) => {
      if (!filePath) return '';
      // Si c'est déjà une URL absolue, la retourner telle quelle
      if (/^https?:\/\//i.test(filePath)) return filePath;
      // Normaliser le chemin en remplaçant les backslashes par des forward slashes
      const normalizedPath = filePath.replace(/\\/g, '/');
      // Extraire le nom de fichier pour l'endpoint /uploads et encoder pour URL
      const fileName = normalizedPath.split('/').pop();
      const encoded = encodeURIComponent(fileName);
      return `${API_BASE_URL}/uploads/${encoded}`;
    },
  },
};

export default API_BASE_URL; 