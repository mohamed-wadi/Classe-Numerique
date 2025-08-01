import React, { useState } from 'react';
import { Box, Button, TextField, IconButton, InputAdornment, Typography, Paper, AppBar, Toolbar, Alert } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Images
import logo from '../public/logo (1).png';
import backgroundConnect from '../public/background-connect.png';

export default function LoginEleve() {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleConnexionClick = () => {
    navigate('/');
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  const handleAideClick = () => {
    navigate('/aide');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(credentials.username, credentials.password);
    if (result.success) {
      navigate('/student');
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
        backgroundColor: '#80b9e5',
        backgroundImage: `url(${backgroundConnect})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Header avec navigation */}
      <AppBar position="static" elevation={0} sx={{ background: '#ffffff', boxShadow: 'none', p: 0 }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, md: 6 }, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleLogoClick} sx={{ p: 0 }}>
              <Box component="img" src={logo} alt="Logo" sx={{ height: 40, width: 40 }} />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <IconButton onClick={handleContactClick} sx={{ color: '#3b4a6b' }}>
              <MailOutlineIcon />
              <Typography sx={{ ml: 1, fontSize: 16, fontWeight: 500 }}>Contact</Typography>
            </IconButton>
            <IconButton onClick={handleAideClick} sx={{ color: '#3b4a6b' }}>
              <HelpOutlineIcon />
              <Typography sx={{ ml: 1, fontSize: 16, fontWeight: 500 }}>Aide</Typography>
            </IconButton>
            <IconButton onClick={handleConnexionClick} sx={{ color: '#3b4a6b' }}>
              <AccountCircleIcon />
              <Typography sx={{ ml: 1, fontSize: 16, fontWeight: 500 }}>Connexion</Typography>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Bouton Connexion enseignant */}
      <Button
        variant="contained"
        startIcon={<AccountCircleIcon />}
        onClick={() => navigate('/login/enseignant')}
        sx={{
          position: 'fixed',
          top: { xs: 80, md: 100 },
          right: { xs: 16, md: 40 },
          zIndex: 50,
          borderRadius: '2rem',
          background: '#292b40',
          color: '#fff',
          fontWeight: 400,
          fontSize: '1rem',
          px: 4,
          py: 1.2,
          boxShadow: '0 2px 8px 0 rgba(35,38,76,0.10)',
          '&:hover': { background: '#23264c' },
        }}
      >
        Connexion enseignant
      </Button>

      {/* Formulaire de connexion élève */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
        <Paper
          elevation={8}
          sx={{
            borderRadius: '48px',
            maxWidth: 340,
            width: '100%',
            px: 0,
            pb: 4,
            pt: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 8px 32px 0 rgba(35,38,76,0.10)',
            position: 'relative',
          }}
        >
          {/* Header foncé */}
          <Box
            sx={{
              width: '100%',
              borderTopLeftRadius: '48px',
              borderTopRightRadius: '48px',
              background: '#292b40',
              height: 74,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid #ffffff',
              boxShadow: '0 0 0 1px #ffffff',
            }}
          >
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 400, letterSpacing: '-1px', fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
              Connexion élève
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', px: 4, mt: 4 }}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            {/* Identifiant */}
            <Box sx={{ position: 'relative', width: '100%' }}>
              <TextField
                fullWidth
                placeholder="Niveau"
                variant="outlined"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon sx={{ color: '#9ca3af' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#e6f0ff',
                    '& fieldset': {
                      borderColor: '#e5e7eb',
                    },
                    '&:hover fieldset': {
                      borderColor: '#d1d5db',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#292b40',
                    },
                  },
                }}
              />
            </Box>

            {/* Mot de passe */}
            <Box sx={{ position: 'relative', width: '100%' }}>
              <TextField
                fullWidth
                placeholder="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#9ca3af' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#9ca3af' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#e6f0ff',
                    '& fieldset': {
                      borderColor: '#e5e7eb',
                    },
                    '&:hover fieldset': {
                      borderColor: '#d1d5db',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#292b40',
                    },
                  },
                }}
              />
            </Box>

            {/* Bouton de connexion */}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                width: '100%',
                borderRadius: '12px',
                background: '#292b40',
                color: '#fff',
                fontWeight: 600,
                py: 1.5,
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': {
                  background: '#23264c',
                },
                '&:disabled': {
                  background: '#9ca3af',
                },
              }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>

            {/* Informations de connexion */}
            <Box sx={{ textAlign: 'center', width: '100%', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
                Identifiants de test :
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#292b40', fontWeight: 500 }}>
                  CM2 : cm2 / ecole
                </Typography>
                <Typography variant="body2" sx={{ color: '#292b40', fontWeight: 500 }}>
                  CM1 : cm1 / ecole
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
} 