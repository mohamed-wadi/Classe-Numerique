import React from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import ComputerIcon from '@mui/icons-material/Computer';
import SecurityIcon from '@mui/icons-material/Security';
import logo from '../public/LOGO (2).png';

const Aide = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleBackClick = () => {
    navigate('/');
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
          <HelpOutlineIcon sx={{ mr: 2, fontSize: 40 }} />
          Centre d'Aide
        </Typography>

        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          {/* Guide d'utilisation */}
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3, color: '#3b4a6b', fontWeight: 600 }}>
                <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Guide d'utilisation
              </Typography>
              
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Pour les Enseignants
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    <ListItem>
                      <ListItemIcon><PersonIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Connexion" 
                        secondary="Utilisez les identifiants : prof / prof123"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><ComputerIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Gestion du contenu" 
                        secondary="Ajoutez, modifiez et supprimez cours et exercices"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><SecurityIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Contrôle de visibilité" 
                        secondary="Publiez ou masquez le contenu pour les élèves"
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Pour les Élèves
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    <ListItem>
                      <ListItemIcon><SchoolIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Connexion CM2" 
                        secondary="Utilisez : cm2 / ecole"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><SchoolIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Connexion CM1" 
                        secondary="Utilisez : cm1 / ecole"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><ComputerIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Navigation" 
                        secondary="Parcourez les cours et téléchargez les documents"
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3, color: '#3b4a6b', fontWeight: 600 }}>
                <HelpOutlineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Questions Fréquentes
              </Typography>
              
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Comment modifier mon mot de passe ?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Contactez votre administrateur système pour modifier votre mot de passe.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Comment télécharger un document ?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Cliquez sur le bouton de téléchargement à côté du document dans votre espace élève.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Comment ajouter un nouveau cours ?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Connectez-vous en tant qu'enseignant et utilisez le bouton "Ajouter" dans la section correspondante.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Problème de connexion ?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Vérifiez vos identifiants et assurez-vous d'utiliser le bon type de compte (élève ou enseignant).
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Box>

        {/* Contact section */}
        <Card sx={{ mt: 4, borderRadius: 3, boxShadow: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: '#ffffff', mb: 2, fontWeight: 600 }}>
              Besoin d'aide supplémentaire ?
            </Typography>
            <Typography variant="body1" sx={{ color: '#ffffff', mb: 3 }}>
              Notre équipe est là pour vous aider. N'hésitez pas à nous contacter.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/contact')}
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
              Nous Contacter
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Aide; 