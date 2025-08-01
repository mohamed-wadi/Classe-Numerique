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
  Divider,
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
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import emailjs from '@emailjs/browser';

// Images
import logo from '../public/logo (1).png';
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
                '&:hover': { background: '#3b5998' },
                '&:disabled': {
                  background: '#9CA3AF',
                },
              }}
            >
              {loading ? 'Connexion...' : 'Connexion'}
            </Button>
            {/* Se souvenir de moi */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{
                    color: '#6b7280',
                    '&.Mui-checked': {
                      color: '#292b40',
                    },
                  }}
                />
              }
              label="Se souvenir de moi"
              sx={{ 
                color: '#6b7280', 
                fontSize: '0.875rem',
                alignSelf: 'flex-start',
                ml: 1
              }}
            />
            {/* Séparateur */}
            <Divider sx={{ my: 1, borderColor: '#e5e7eb' }} />
            {/* Mot de passe oublié */}
            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={handleForgotPassword}
                disabled={forgotPasswordLoading}
                sx={{
                  color: '#6b7280',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#292b40',
                    textDecoration: 'underline',
                  },
                  '&:disabled': {
                    color: '#9ca3af',
                    cursor: 'not-allowed',
                  },
                }}
              >
                {forgotPasswordLoading ? 'Envoi en cours...' : 'Mot de passe oublié ?'}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Dialog pour réinitialisation du mot de passe */}
      <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          {resetStep === 'code' ? 'Vérification du code' : 'Nouveau mot de passe'}
        </DialogTitle>
        <DialogContent>
          {resetStep === 'code' ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
                Entrez le code reçu par email
              </Typography>
              <TextField
                fullWidth
                label="Code de vérification"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value.toUpperCase())}
                inputProps={{ maxLength: 6, style: { textTransform: 'uppercase' } }}
                sx={{ mb: 2 }}
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                label="Nouveau mot de passe"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Confirmer le nouveau mot de passe"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={resetStep === 'code' ? handleVerifyCode : handleResetPassword}
            variant="contained"
            sx={{
              background: '#292b40',
              color: '#fff',
              px: 4,
              py: 1.5,
              borderRadius: '28px',
              '&:hover': { background: '#3b5998' },
            }}
          >
            {resetStep === 'code' ? 'Vérifier' : 'Changer le mot de passe'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 