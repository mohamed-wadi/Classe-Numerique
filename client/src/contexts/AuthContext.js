import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configuration axios sans baseURL pour éviter les conflits
  // axios.defaults.baseURL = API_BASE_URL;

  useEffect(() => {
    // Priorité au token de session (durée de la session navigateur)
    const sessionToken = sessionStorage.getItem('token');
    if (sessionToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;
      verifyToken();
      return;
    }

    // Sinon, vérifier le token persistant avec expiration (30 jours)
    const rawTokenData = localStorage.getItem('tokenData');
    if (rawTokenData) {
      try {
        const tokenData = JSON.parse(rawTokenData);
        if (tokenData?.token && tokenData?.expiresAt && Date.now() < tokenData.expiresAt) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`;
          verifyToken();
          return;
        }
      } catch (e) {
        // ignore JSON errors
      }
      // Expiré ou invalide
      localStorage.removeItem('tokenData');
    }

    setLoading(false);
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.AUTH.VERIFY);
      setUser(response.data.user);
    } catch (error) {
      console.error('Erreur vérification token:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password, options = {}) => {
    const { rememberMe = false } = options;
    try {
      console.log('Tentative de connexion avec:', { username, API_URL: API_BASE_URL });
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, { username, password });
      const { token, user } = response.data;

      // Stockage selon l'option "Se souvenir de moi"
      if (rememberMe) {
        const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 jours
        localStorage.setItem('tokenData', JSON.stringify({ token, expiresAt }));
      } else {
        sessionStorage.setItem('token', token);
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      console.log('Connexion réussie:', user);
      return { success: true, user };
    } catch (error) {
      console.error('Erreur de connexion:', error.response?.data || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur de connexion' 
      };
    }
  };

  const logout = () => {
    // Nettoyer les deux types de stockage
    sessionStorage.removeItem('token');
    localStorage.removeItem('tokenData');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
