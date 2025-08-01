import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(credentials.username, credentials.password);
    if (result.success) {
      navigate(result.user.role === 'teacher' ? '/teacher' : '/student');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #EBF8FF 0%, #BEE3F8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: '#fff',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            maxWidth: 'md',
            width: '100%',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ 
              fontWeight: 'bold', 
              mb: 3,
              color: '#1E40AF',
              fontSize: '2rem',
            }}
          >
            Connexion
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              variant="outlined"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#93C5FD',
                    },
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3B82F6',
                      borderWidth: 2,
                    },
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#6B7280',
                  '&.Mui-focused': {
                    color: '#3B82F6',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              variant="outlined"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#93C5FD',
                    },
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3B82F6',
                      borderWidth: 2,
                    },
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#6B7280',
                  '&.Mui-focused': {
                    color: '#3B82F6',
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 2,
                fontWeight: 'bold',
                fontSize: '1rem',
                borderRadius: 2,
                backgroundColor: '#1E40AF',
                color: '#fff',
                textTransform: 'none',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: '#1D4ED8',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)',
                },
                '&:disabled': {
                  backgroundColor: '#9CA3AF',
                  transform: 'none',
                  boxShadow: 'none',
                },
              }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </Box>

          {/* Informations de connexion */}
          <Box sx={{ mt: 4, p: 3, backgroundColor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
            <Typography variant="body2" sx={{ color: '#64748B', textAlign: 'center', fontSize: '0.875rem' }}>
              <strong>Comptes de test :</strong><br />
              Professeur: prof / prof123<br />
              CM2: cm2 / ecole<br />
              CE6: ce6 / ecole
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
