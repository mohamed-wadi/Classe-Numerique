import React, { useState } from 'react';
import { Box, Button, TextField, IconButton, InputAdornment, Typography, Paper, AppBar, Toolbar, Alert } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
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
        backgroundColor: '#80b8e4',
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
            <Box component="img" src={logo} alt="Logo" sx={{ height: 40, width: 40 }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <IconButton sx={{ color: '#3b4a6b' }}><MailOutlineIcon /><Typography sx={{ ml: 1, fontSize: 16, fontWeight: 500 }}>Contact</Typography></IconButton>
            <IconButton sx={{ color: '#3b4a6b' }}><MenuBookIcon /><Typography sx={{ ml: 1, fontSize: 16, fontWeight: 500 }}>Exercices</Typography></IconButton>
            <IconButton sx={{ color: '#3b4a6b' }}><HelpOutlineIcon /><Typography sx={{ ml: 1, fontSize: 16, fontWeight: 500 }}>Aide</Typography></IconButton>
            <IconButton sx={{ color: '#3b4a6b' }}><AccountCircleIcon /><Typography sx={{ ml: 1, fontSize: 16, fontWeight: 500 }}>Connexion</Typography></IconButton>
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
              border: '3px solid #ffffff',
              boxShadow: '0 0 0 1px #ffffff',
            }}
          >
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 400, letterSpacing: '-1px', fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
              Connexion élèves
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
                placeholder="Identifiant compte classe"
                variant="outlined"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{
                        background: '#e6f0fe',
                        borderRadius: '50%',
                        width: 56,
                        height: 56,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 1,
                      }}>
                        <AccountCircleIcon sx={{ color: '#b0b3c6', fontSize: 32 }} />
                      </Box>
                    </InputAdornment>
                  ),
                  sx: {
                    pl: 0,
                    pr: 2,
                    height: 56,
                    borderRadius: '28px',
                    background: '#e6f0fe',
                    fontWeight: 600,
                  },
                }}
                sx={{
                  borderRadius: '28px',
                  background: '#e6f0fe',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '28px',
                    background: '#e6f0fe',
                    fontWeight: 600,
                    pl: 0,
                    pr: 2,
                    height: 56,
                  },
                  '& .MuiInputBase-input': {
                    pl: 0,
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
                      <Box sx={{
                        background: '#e6f0fe',
                        borderRadius: '50%',
                        width: 56,
                        height: 56,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 1,
                      }}>
                        <LockIcon sx={{ color: '#b0b3c6', fontSize: 32 }} />
                      </Box>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                        {showPassword ? <VisibilityOff sx={{ color: '#b0b3c6' }} /> : <Visibility sx={{ color: '#b0b3c6' }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    pl: 0,
                    pr: 2,
                    height: 56,
                    borderRadius: '28px',
                    background: '#e6f0fe',
                    fontWeight: 600,
                  },
                }}
                sx={{
                  borderRadius: '28px',
                  background: '#e6f0fe',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '28px',
                    background: '#e6f0fe',
                    fontWeight: 600,
                    pl: 0,
                    pr: 2,
                    height: 56,
                  },
                  '& .MuiInputBase-input': {
                    pl: 0,
                  },
                }}
              />
            </Box>
            {/* Bouton Connexion */}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                background: '#292b40',
                color: '#fff',
                borderRadius: '28px',
                height: 44,
                fontWeight: 400,
                fontSize: '1rem',
                boxShadow: 3,
                width: '90%',
                mx: 'auto',
                mt: 1,
                '&:hover': { background: '#3b5998' },
                '&:disabled': {
                  background: '#9CA3AF',
                },
              }}
            >
              {loading ? 'Connexion...' : 'Connexion'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
} 