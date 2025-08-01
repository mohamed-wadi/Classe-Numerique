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
          background: '#2c3e50',
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
              Espace Élève
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Classe {user?.level}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Bienvenue, {user?.username}
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
            color: '#7f8c8d',
            fontWeight: 600,
            fontSize: '0.75rem'
          }}
        >
          CATÉGORIES
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
                  ? '#3498db'
                  : 'transparent',
                color: selectedCategory === category.key ? 'white' : '#2c3e50',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: selectedCategory === category.key 
                    ? '#2980b9'
                    : '#ecf0f1',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: selectedCategory === category.key ? 'white' : '#2c3e50',
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
            borderColor: '#2c3e50',
            color: '#2c3e50',
            '&:hover': {
              borderColor: '#34495e',
              background: '#ecf0f1',
            }
          }}
        >
          Déconnexion
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#ecf0f1' }}>
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
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              background: '#ffffff'
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
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              background: '#ffffff'
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
            background: '#2c3e50',
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
              Espace Élève
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
                color: '#2c3e50',
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Bienvenue, {user?.username}! 👨‍🎓
            </Typography>
            <Typography 
              variant="h5" 
              sx={{
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                color: '#7f8c8d',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              {getWelcomeMessage()}
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
                  color: '#2c3e50',
                  mb: 3,
                  textAlign: 'center',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                Sélectionner un thème
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
                        ? '#3498db'
                        : '#ffffff',
                      color: selectedTheme === theme ? '#ffffff' : '#2c3e50',
                      border: selectedTheme === theme 
                        ? 'none'
                        : '2px solid #3498db',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': { 
                        transform: 'translateY(-2px) scale(1.05)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Liste du contenu */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 600, 
                color: '#2c3e50',
                mb: 2,
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              Contenu disponible
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3,
                color: '#7f8c8d',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              {user?.level} • {categories.find(c => c.key === selectedCategory)?.label}
              {selectedCategory === 'THEMES' && ` • Thème ${selectedTheme}`}
            </Typography>
          </Box>

          {filteredContents.length === 0 ? (
            <Card 
              sx={{ 
                p: 6, 
                textAlign: 'center',
                background: '#ffffff',
                border: '2px solid #3498db',
                borderRadius: 3,
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Box sx={{ color: '#2c3e50', mb: 2 }}>
                <School sx={{ fontSize: 64, opacity: 0.7 }} />
              </Box>
              <Typography variant="h6" color="#2c3e50" gutterBottom>
                Aucun contenu disponible pour cette catégorie
              </Typography>
              <Typography variant="body2" color="#7f8c8d">
                Votre professeur n'a pas encore publié de contenu ici.
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
                      background: '#ffffff',
                      border: '2px solid #3498db',
                      borderRadius: 3,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                    onClick={() => handleContentClick(content)}
                  >
                    {content.miniature ? (
                      <CardMedia
                        component="img"
                        height="160"
                        image={`http://localhost:5000/${content.miniature}`}
                        alt={content.title}
                        sx={{ borderRadius: '12px 12px 0 0' }}
                      />
                    ) : (
                      <Box 
                        sx={{ 
                          height: 120, 
                          background: '#3498db',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          borderRadius: '12px 12px 0 0',
                        }}
                      >
                        <School sx={{ fontSize: 40, color: 'white', opacity: 0.9 }} />
                      </Box>
                    )}
                    
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography 
                        variant="h6" 
                        component="h2"
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          lineHeight: 1.3,
                          color: '#2c3e50',
                          mb: 1,
                        }}
                      >
                        {content.title}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="#7f8c8d" 
                        gutterBottom
                        sx={{ fontWeight: 500, mb: 2 }}
                      >
                        {contentTypeLabels[content.type] || content.type}
                      </Typography>
                      
                      {content.description && (
                        <Typography 
                          variant="body2" 
                          color="#7f8c8d" 
                          sx={{ 
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {content.description}
                        </Typography>
                      )}
                      
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {content.pdfFile && (
                          <Chip 
                            size="small" 
                            icon={<PictureAsPdf />} 
                            label="PDF disponible" 
                            sx={{ 
                              background: 'rgba(231, 76, 60, 0.1)',
                              color: '#e74c3c',
                              fontWeight: 500,
                            }}
                          />
                        )}
                        {content.miniature && (
                          <Chip 
                            size="small" 
                            icon={<School />} 
                            label="Image" 
                            sx={{ 
                              background: 'rgba(52, 152, 219, 0.1)',
                              color: '#3498db',
                              fontWeight: 500,
                            }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Dialog de contenu */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ bgcolor: '#2c3e50', color: 'white' }}>
              <Typography variant="h5">
                {selectedContent?.title}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              {selectedContent && (
                <Box>
                  {selectedContent.description && (
                    <Typography variant="body1" sx={{ mb: 3, color: '#7f8c8d' }}>
                      {selectedContent.description}
                    </Typography>
                  )}
                  
                  {selectedContent.pdfFile && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50' }}>
                        Document PDF
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<GetApp />}
                        onClick={() => downloadFile(selectedContent.pdfFile, selectedContent.title)}
                        sx={{
                          backgroundColor: '#3498db',
                          '&:hover': {
                            backgroundColor: '#2980b9',
                          }
                        }}
                      >
                        Télécharger le PDF
                      </Button>
                    </Box>
                  )}
                  
                  {selectedContent.content && (
                    <Box>
                      <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50' }}>
                        Contenu
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#7f8c8d' }}>
                        {selectedContent.content}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setOpenDialog(false)}
                sx={{ color: '#7f8c8d' }}
              >
                Fermer
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default StudentDashboard;