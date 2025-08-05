import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  IconButton, 
  InputAdornment, 
  Typography, 
  Paper, 
  AppBar, 
  Toolbar, 
  Alert,
  Checkbox,
  FormControlLabel,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import emailjs from '@emailjs/browser';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// Images
import logo from '../public/LOGO (2).png';
import backgroundConnect from '../public/background-connect.png';

export default function LoginEnseignant() {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetStep, setResetStep] = useState('code');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(credentials.username, credentials.password);
    if (result.success) {
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      navigate('/teacher');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setForgotPasswordLoading(true);
    setForgotPasswordSuccess('');
    setError('');

    try {
      const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      setResetCode(generatedCode);
      
      // Configuration EmailJS
      const templateParams = {
        to_name: 'Mohamed Wadi',
        reset_code: generatedCode,
        to_email: 'casablancapazari@gmail.com'
      };

      // Envoyer l'email avec EmailJS
      await emailjs.send(
        'service_9pj3dlt',
        'template_tt3g173',
        templateParams,
        'OJU3Ymmtegp5Nahzs'
      );
      
      setForgotPasswordSuccess('Email envoyé');
      setShowResetDialog(true);
      setResetStep('code');
      
      console.log('Code de récupération envoyé:', generatedCode);
      
    } catch (error) {
      console.error('Erreur EmailJS:', error);
      setError('Erreur lors de l\'envoi de l\'email. Veuillez réessayer.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleVerifyCode = () => {
    if (enteredCode === resetCode) {
      setResetStep('password');
      setError('');
    } else {
      setError('Code incorrect. Veuillez réessayer.');
    }
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    
    setForgotPasswordSuccess('Mot de passe mis à jour avec succès !');
    setShowResetDialog(false);
    setResetStep('code');
    setEnteredCode('');
    setNewPassword('');
    setConfirmPassword('');
  };

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
      <AppBar position="static" elevation={0} sx={{ background: '#ffffff', boxShadow: 'none', height: 80 }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, md: 6 }, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleLogoClick} sx={{ p: 0 }}>
              {/* Agrandir le logo sans affecter la hauteur du navbar */}
              <Box component="img" src={logo} alt="Logo" sx={{ height: 60, width: 'auto' }} />
            </IconButton>
          </Box>
          {/* Desktop buttons */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
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
          {/* Mobile menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton onClick={handleMenuOpen} sx={{ color: '#3b4a6b' }}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
              <MenuItem onClick={() => { handleContactClick(); handleMenuClose(); }}>
                <MailOutlineIcon sx={{ mr: 1 }} /> Contact
              </MenuItem>
              <MenuItem onClick={() => { handleAideClick(); handleMenuClose(); }}>
                <HelpOutlineIcon sx={{ mr: 1 }} /> Aide
              </MenuItem>
              <MenuItem onClick={() => { handleConnexionClick(); handleMenuClose(); }}>
                <AccountCircleIcon sx={{ mr: 1 }} /> Connexion
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Bouton Connexion élève */}
      <Button
        variant="contained"
        startIcon={<AccountCircleIcon />}
        onClick={() => navigate('/login/eleve')}
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
        Connexion élève
      </Button>

      {/* Formulaire de connexion enseignant */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
        <Paper
          elevation={8}
          sx={{
            borderRadius: '48px',
            maxWidth: 300,
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
              Connexion enseignant
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', px: 4, mt: 4 }}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            {forgotPasswordSuccess && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                {forgotPasswordSuccess}
              </Alert>
            )}
            {/* Identifiant */}
            <Box sx={{ position: 'relative', width: '100%' }}>
              <TextField
                fullWidth
                placeholder="Nom d'utilisateur"
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

            {/* Options */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: '#292b40',
                      '&.Mui-checked': {
                        color: '#292b40',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Se souvenir de moi
                  </Typography>
                }
              />
              <Box sx={{ textAlign: 'center' }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleForgotPassword}
                  disabled={forgotPasswordLoading}
                  sx={{
                    color: '#292b40',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Mot de passe oublié ?
                </Link>
              </Box>
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
          </Box>
        </Paper>
      </Box>

      {/* Dialog de réinitialisation de mot de passe */}
      <Dialog
        open={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#292b40' }}>
            {resetStep === 'code' ? 'Vérification du code' : 'Nouveau mot de passe'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {resetStep === 'code' ? (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
                Un code de réinitialisation a été envoyé à votre email. Veuillez l'entrer ci-dessous.
              </Typography>
              <TextField
                fullWidth
                label="Code de vérification"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleVerifyCode}
                disabled={!enteredCode}
                sx={{
                  background: '#292b40',
                  '&:hover': { background: '#23264c' },
                }}
              >
                Vérifier le code
              </Button>
            </Box>
          ) : (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
                Entrez votre nouveau mot de passe.
              </Typography>
              <TextField
                fullWidth
                label="Nouveau mot de passe"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Confirmer le mot de passe"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleResetPassword}
                disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
                sx={{
                  background: '#292b40',
                  '&:hover': { background: '#23264c' },
                }}
              >
                Réinitialiser le mot de passe
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)} sx={{ color: '#6b7280' }}>
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 