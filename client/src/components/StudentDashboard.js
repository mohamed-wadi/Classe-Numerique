import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import {
  School,
  Logout,
  Home,
  MenuBook,
  AutoStories,
  Create,
  Quiz,
  Assessment,
  PictureAsPdf,
  GetApp,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const SIDEBAR_WIDTH = 280;

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('HOME');
  const [selectedTheme, setSelectedTheme] = useState(1);
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const categories = [
    { key: 'HOME', label: 'ACCUEIL', icon: <Home />, description: 'Page d\'accueil' },
    { key: 'THEMES', label: 'THÈMES', icon: <MenuBook />, description: 'Cours par thème' },
    { key: 'LECTURE_SUIVIE', label: 'LECTURE SUIVIE', icon: <AutoStories />, description: 'Textes de lecture' },
    { key: 'PRODUCTION_ECRIT', label: 'PRODUCTION ÉCRITE', icon: <Create />, description: 'Exercices d\'écriture' },
    { key: 'EVALUATIONS', label: 'ÉVALUATIONS', icon: <Quiz />, description: 'Tests et contrôles' },
    { key: 'EVIL_SCIENTIFIQUE', label: 'ÉVEIL SCIENTIFIQUE', icon: <Assessment />, description: 'Sciences et découvertes' }
  ];

  const contentTypeLabels = {
    'cours_manuel': 'Cours du manuel',
    'cours_a_ecrire': 'Cours à écrire',
    'exercice': 'Exercices'
  };

  const subcategoryLabels = {
    'expression_orale': 'Expression orale',
    'lecture': 'Lecture',
    'vocabulaire_thematique': 'Vocabulaire thématique',
    'grammaire': 'Grammaire',
    'conjugaison': 'Conjugaison',
    'orthographe': 'Orthographe',
    'vocabulaire': 'Vocabulaire',
    'poesie': 'Poésie',
    'expression_ecrite': 'Expression écrite'
  };

  useEffect(() => {
    fetchContents();
  }, [selectedCategory]);

  const fetchContents = async () => {
    try {
      const response = await axios.get(`/content/${user.level}/${selectedCategory}`);
      setContents(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du contenu:', error);
    }
  };

  const handleContentClick = (content) => {
    setSelectedContent(content);
    setOpenDialog(true);
  };

  const downloadFile = (filePath, filename) => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000/${filePath}`;
    link.download = filename;
    link.click();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCategorySelect = (categoryKey) => {
    setSelectedCategory(categoryKey);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const filteredContents = selectedCategory === 'THEMES' 
    ? contents.filter(content => content.theme === selectedTheme)
    : contents;

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  // Contenu de la sidebar
  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header de la sidebar */}
      <Box 
        sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative'
        }}
      >
        {isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8, 
              color: 'white' 
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              width: 50, 
              height: 50, 
              bgcolor: 'rgba(255,255,255,0.2)',
              mr: 2
            }}
          >
            <School sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              École {user?.level}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Espace Élève
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Classe {user?.level}
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, py: 2 }}>
        <Typography 
          variant="overline" 
          sx={{ 
            px: 3, 
            mb: 1, 
            display: 'block',
            color: 'text.secondary',
            fontWeight: 600,
            fontSize: '0.75rem'
          }}
        >
          NAVIGATION
        </Typography>
        <List sx={{ px: 2 }}>
          {categories.map((category) => (
            <ListItem
              key={category.key}
              onClick={() => handleCategorySelect(category.key)}
              sx={{
                mb: 1,
                borderRadius: 2,
                cursor: 'pointer',
                background: selectedCategory === category.key 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent',
                color: selectedCategory === category.key ? 'white' : 'text.primary',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: selectedCategory === category.key 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(102, 126, 234, 0.08)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: selectedCategory === category.key ? 'white' : '#667eea',
                  minWidth: 40
                }}
              >
                {category.icon}
              </ListItemIcon>
              <ListItemText 
                primary={category.label}
                secondary={selectedCategory === category.key ? category.description : null}
                primaryTypographyProps={{ 
                  fontWeight: selectedCategory === category.key ? 600 : 500,
                  fontSize: '0.9rem'
                }}
                secondaryTypographyProps={{
                  sx: { 
                    color: 'rgba(255,255,255,0.8)', 
                    fontSize: '0.75rem',
                    mt: 0.5
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer de la sidebar */}
      <Box sx={{ p: 3, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<Logout />}
          onClick={logout}
          sx={{
            borderRadius: 2,
            py: 1.5,
            borderColor: 'rgba(102, 126, 234, 0.3)',
            color: '#667eea',
            '&:hover': {
              borderColor: '#667eea',
              background: 'rgba(102, 126, 234, 0.08)',
            }
          }}
        >
          Déconnexion
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: SIDEBAR_WIDTH,
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
            },
          }}
        >
          {sidebarContent}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: SIDEBAR_WIDTH,
              border: 'none',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
            },
          }}
          open
        >
          {sidebarContent}
        </Drawer>
      </Box>

      {/* Contenu principal */}
      <Box sx={{ flexGrow: 1, width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` } }}>
        {/* Header mobile */}
        <AppBar 
          position="sticky"
          elevation={0}
          sx={{ 
            display: { md: 'none' },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              École {user?.level}
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, px: { xs: 2, sm: 3 } }}>
          {/* Message de bienvenue */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', md: '3rem' },
                mb: 2,
              }}
            >
              {getWelcomeMessage()}, Classe {user?.level}! 📚
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary"
              sx={{
                fontWeight: 400,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              Découvrez vos cours et exercices du jour
            </Typography>
          </Box>

          {/* Sélection des thèmes (si catégorie THEMES) */}
          {selectedCategory === 'THEMES' && (
            <Box sx={{ mb: 5 }}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  mb: 3,
                  textAlign: 'center',
                }}
              >
                Choisissez votre thème
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                {[1, 2, 3, 4, 5, 6].map((theme) => (
                  <Chip
                    key={theme}
                    label={`Thème ${theme}`}
                    onClick={() => setSelectedTheme(theme)}
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      py: 2,
                      px: 3,
                      height: 48,
                      borderRadius: 3,
                      background: selectedTheme === theme 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'rgba(255, 255, 255, 0.9)',
                      color: selectedTheme === theme ? 'white' : 'text.primary',
                      border: selectedTheme === theme 
                        ? 'none'
                        : '1px solid rgba(226, 232, 240, 0.8)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': { 
                        transform: 'translateY(-2px) scale(1.05)',
                        boxShadow: selectedTheme === theme 
                          ? '0 8px 25px rgba(102, 126, 234, 0.3)'
                          : '0 8px 25px rgba(0, 0, 0, 0.1)',
                      },
                      '&:active': {
                        transform: 'translateY(0) scale(1.02)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Contenu disponible */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                mb: 2,
              }}
            >
              {categories.find(c => c.key === selectedCategory)?.label}
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              {selectedCategory === 'THEMES' && `Thème ${selectedTheme} • `}Contenu disponible pour votre classe
            </Typography>
          </Box>

          {filteredContents.length === 0 ? (
            <Card 
              sx={{ 
                p: 6, 
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                borderRadius: 3,
              }}
            >
              <Box sx={{ color: 'text.secondary', mb: 2 }}>
                <School sx={{ fontSize: 64, opacity: 0.3 }} />
              </Box>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Aucun contenu disponible pour le moment
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Votre professeur n'a pas encore publié de contenu pour cette section.
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {filteredContents.map((content) => (
                <Grid item xs={12} sm={6} lg={4} key={content.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      cursor: 'pointer',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      borderRadius: 3,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': { 
                        transform: 'translateY(-6px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      }
                    }}
                    onClick={() => handleContentClick(content)}
                  >
                    {content.miniature ? (
                      <CardMedia
                        component="img"
                        height="160"
                        image={`http://localhost:5000/${content.miniature}`}
                        alt={content.title}
                      />
                    ) : (
                      <Box 
                        sx={{ 
                          height: 160, 
                          bgcolor: 'primary.light', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: 'white'
                        }}
                      >
                        <MenuBook sx={{ fontSize: 60 }} />
                      </Box>
                    )}
                    
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {content.title}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          size="small"
                          label={contentTypeLabels[content.type]}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      
                      {content.subcategory && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {subcategoryLabels[content.subcategory]}
                        </Typography>
                      )}
                      
                      {content.description && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {content.description}
                        </Typography>
                      )}
                      
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {content.pdfFile && (
                          <Chip 
                            size="small" 
                            icon={<PictureAsPdf />} 
                            label="PDF disponible" 
                            color="secondary"
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Dialog de détail du contenu */}
          <Dialog 
            open={openDialog} 
            onClose={() => setOpenDialog(false)} 
            maxWidth="md" 
            fullWidth
          >
            {selectedContent && (
              <>
                <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
                  <Typography variant="h5">
                    {selectedContent.title}
                  </Typography>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                  {selectedContent.miniature && (
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                      <img
                        src={`http://localhost:5000/${selectedContent.miniature}`}
                        alt={selectedContent.title}
                        style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                      />
                    </Box>
                  )}
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={contentTypeLabels[selectedContent.type]}
                      color="primary"
                      sx={{ mr: 1 }}
                    />
                    {selectedContent.subcategory && (
                      <Chip
                        label={subcategoryLabels[selectedContent.subcategory]}
                        variant="outlined"
                      />
                    )}
                  </Box>
                  
                  {selectedContent.description && (
                    <Typography variant="body1" paragraph>
                      {selectedContent.description}
                    </Typography>
                  )}
                  
                  {selectedContent.pdfFile && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Document PDF disponible
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<GetApp />}
                        onClick={() => downloadFile(selectedContent.pdfFile, selectedContent.title + '.pdf')}
                      >
                        Télécharger le PDF
                      </Button>
                    </Box>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDialog(false)} variant="contained">
                    Fermer
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default StudentDashboard;