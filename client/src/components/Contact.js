import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  AppBar, 
  Toolbar, 
  IconButton,
  TextField,
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import SchoolIcon from '@mui/icons-material/School';
import logo from '../public/logo (1).png';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation d'envoi du formulaire
    setSnackbar({
      open: true,
      message: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
      severity: 'success'
    });
    setFormData({
      nom: '',
      email: '',
      sujet: '',
      message: ''
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#80b9e5' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ background: '#ffffff', boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, md: 6 }, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleLogoClick} sx={{ p: 0 }}>
              <Box component="img" src={logo} alt="Logo" sx={{ height: 40, width: 40 }} />
            </IconButton>
          </Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
            sx={{ color: '#3b4a6b', fontWeight: 600 }}
          >
            Retour à l'accueil
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" sx={{ 
          textAlign: 'center', 
          color: '#ffffff', 
          mb: 4, 
          fontWeight: 700,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          <MailOutlineIcon sx={{ mr: 2, fontSize: 40 }} />
          Contactez-nous
        </Typography>

        <Grid container spacing={4}>
          {/* Formulaire de contact */}
          <Grid item xs={12} md={7}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, color: '#3b4a6b', fontWeight: 600 }}>
                  Envoyez-nous un message
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nom complet"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        required
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Sujet"
                        name="sujet"
                        value={formData.sujet}
                        onChange={handleInputChange}
                        required
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<SendIcon />}
                        sx={{
                          bgcolor: '#3b4a6b',
                          color: '#ffffff',
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            bgcolor: '#2c3e50',
                          }
                        }}
                      >
                        Envoyer le message
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Informations de contact */}
          <Grid item xs={12} md={5}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, height: 'fit-content' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, color: '#3b4a6b', fontWeight: 600 }}>
                  <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Informations de contact
                </Typography>
                
                <List>
                  <ListItem sx={{ mb: 2 }}>
                    <ListItemIcon>
                      <MailOutlineIcon sx={{ color: '#3b4a6b' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary="contact@ecole-cm2-cm1.fr"
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondaryTypographyProps={{ color: '#64748b' }}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ mb: 2 }}>
                    <ListItemIcon>
                      <PhoneIcon sx={{ color: '#3b4a6b' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Téléphone"
                      secondary="+33 1 23 45 67 89"
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondaryTypographyProps={{ color: '#64748b' }}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ mb: 2 }}>
                    <ListItemIcon>
                      <LocationOnIcon sx={{ color: '#3b4a6b' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Adresse"
                      secondary="123 Rue de l'Éducation, 75001 Paris"
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondaryTypographyProps={{ color: '#64748b' }}
                    />
                  </ListItem>
                </List>

                <Paper sx={{ p: 3, mt: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <Typography variant="h6" sx={{ color: '#ffffff', mb: 2, fontWeight: 600 }}>
                    Horaires d'ouverture
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>
                    <strong>Lundi - Vendredi :</strong> 8h00 - 18h00<br />
                    <strong>Samedi :</strong> 9h00 - 12h00<br />
                    <strong>Dimanche :</strong> Fermé
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Section FAQ rapide */}
        <Card sx={{ mt: 4, borderRadius: 3, boxShadow: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: '#ffffff', mb: 2, fontWeight: 600 }}>
              Questions fréquentes
            </Typography>
            <Typography variant="body1" sx={{ color: '#ffffff', mb: 3 }}>
              Consultez notre centre d'aide pour des réponses rapides à vos questions.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/aide')}
              sx={{
                bgcolor: '#ffffff',
                color: '#3b4a6b',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: '#f5f5f5',
                }
              }}
            >
              Centre d'Aide
            </Button>
          </CardContent>
        </Card>
      </Container>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact; 