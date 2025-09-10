import React, { useState, useEffect, useCallback } from 'react';
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
  IconButton,
  TextField,
  InputAdornment
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
  Close as CloseIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import SvgIcon from '@mui/material/SvgIcon';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Import des images
const image1 = require('../assets/course/1.png');
const image2 = require('../assets/course/2.png');
const image3 = require('../assets/course/3.png');
const image4 = require('../assets/course/4.png');
const image5 = require('../assets/course/5.png');
const image6 = require('../assets/course/6.png');
const image7 = require('../assets/course/7.png');
const image8 = require('../assets/course/8.png');
const image9 = require('../assets/course/9.png');
const image10 = require('../assets/course/10.png');
const image11 = require('../assets/course/11.png');
const image12 = require('../assets/course/12.png');

const SIDEBAR_WIDTH = 280;

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('EXERCICES');
  const [selectedTheme, setSelectedTheme] = useState(1);
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const categories = [
    { key: 'EXERCICES', label: 'EXERCICES', icon: <Home />, description: 'Page d\'accueil' },
    { key: 'HOME', label: 'THEMES', icon: (
      <SvgIcon>
        <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1m0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5z"></path>
      </SvgIcon>
    ), description: 'Cours par themes' },
    { key: 'THEMES', label: 'THÈMES', icon: <MenuBook />, description: 'Cours par thème' },
    { key: 'CAHIER_EXERCICE', label: 'CAHIER EXERCICE', icon: <Create />, description: 'Cahier d\'exercice' },
    { key: 'LECTURE_SUIVIE', label: 'LECTURE SUIVIE', icon: <AutoStories />, description: 'Page d\'accueil' },
    { key: 'PRODUCTION_ECRIT', label: 'PRODUCTION ÉCRITE', icon: <Create />, description: 'Page d\'accueil' },
    { key: 'EVALUATIONS', label: 'ÉVALUATIONS', icon: <Quiz />, description: 'Page d\'accueil' },
    { key: 'EVIL_SCIENTIFIQUE', label: 'ÉVEIL SCIENTIFIQUE', icon: <Assessment />, description: 'Page d\'accueil' }
  ];

  const contentTypeLabels = {
    'cours_manuel': 'Cours du manuel',
    'cours_a_ecrire': 'Cours à écrire',
    'exercice': 'Exercices'
  };

  const fetchContents = useCallback(async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.CONTENT.BY_LEVEL_CATEGORY(user.level, selectedCategory));
      // Filtrer seulement les contenus visibles
      const visibleContents = response.data.filter(content => content.isVisible);
      setContents(visibleContents);
    } catch (error) {
      console.error('Erreur lors du chargement du contenu:', error);
    }
  }, [user.level, selectedCategory]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const handleContentClick = (content) => {
    setSelectedContent(content);
    setOpenDialog(true);
  };

  const downloadFile = async (filePath, fileName) => {
    try {
      const response = await fetch(API_ENDPOINTS.UPLOADS.FILE(filePath));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || filePath.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier:', error);
      // Fallback to opening in browser if download fails
      openFileInBrowser(filePath);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const openFileInBrowser = (filePath, pageNumber) => {
    const url = API_ENDPOINTS.UPLOADS.FILE(filePath);
    const anchor = pageNumber && Number(pageNumber) > 0 ? `#page=${Number(pageNumber)}` : '';
    window.open(url + anchor, '_blank');
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
    switch (user?.level) {
      case 'CM1':
        return 'Bienvenue dans votre espace CM1 ! Découvrez les thèmes et commencez votre apprentissage.';
      case 'CM2':
        return 'Bienvenue dans votre espace CM2 ! Explorez les thèmes et progressez dans vos études.';
      default:
        return 'Bienvenue dans votre espace d\'apprentissage !';
    }
  };

  // Définition des thèmes avec leurs images et descriptions
  const themes = [
    {
      id: 1,
      title: "Thème 1",
      subtitle: "Tout le bonheur !",
      image: image1,
      description: "Découvrez les joies de l'apprentissage et les moments de bonheur dans vos études."
    },
    {
      id: 2,
      title: "Thème 2", 
      subtitle: "Les contes détournés",
      image: image2,
      description: "Explorez les contes traditionnels revisités avec une approche moderne et créative."
    },
    {
      id: 3,
      title: "Thème 3",
      subtitle: "Notre monde en question",
      image: image3, 
      description: "Interrogez le monde qui vous entoure et développez votre esprit critique."
    },
    {
      id: 4,
      title: "Thème 4",
      subtitle: "Les romans policiers",
      image: image4,
      description: "Plongez dans l'univers passionnant des enquêtes et de la résolution d'énigmes."
    },
    {
      id: 5,
      title: "Thème 5",
      subtitle: "L'enfance en B.D",
      image: image5,
      description: "Découvrez l'art de la bande dessinée et ses histoires captivantes."
    },
    {
      id: 6,
      title: "Thème 6",
      subtitle: "Des journaux intimes",
      image: image6,
      description: "Apprenez à exprimer vos pensées et vos émotions à travers l'écriture personnelle."
    }
  ];

  // Images pour CM2 (thèmes 7-12)
  const cm2Themes = [
    {
      id: 7,
      title: "Thème 1",
      subtitle: "Mes amis",
      image: image7,
      description: "Partez à l'aventure avec tes amis et découvre de nouveaux horizons."
    },
    {
      id: 8,
      title: "Thème 2",
      subtitle: "Relève le défi",
      image: image8,
      description: "Relève des défis passionnants et développe ta logique."
    },
    {
      id: 9,
      title: "Thème 3",
      subtitle: "Nos loisirs",
      image: image9,
      description: "Explore tes loisirs et libère ta créativité."
    },
    {
      id: 10,
      title: "Thème 4",
      subtitle: "Les histoires qui font peur",
      image: image10,
      description: "Découvre des histoires qui donnent des frissons."
    },
    {
      id: 11,
      title: "Thème 5",
      subtitle: "Réaliser mon rêve d'enfant",
      image: image11,
      description: "Imagine et réalise ton rêve d'enfant."
    },
    {
      id: 12,
      title: "Thème 6",
      subtitle: "À la découverte du monde!",
      image: image12,
      description: "Pars à la découverte du monde qui t'entoure."
    }
  ];

  // Sélectionner les thèmes selon le niveau
  const currentThemes = user?.level === 'CM1' ? themes : cm2Themes;

  // Filtrer le contenu selon le terme de recherche
  const searchFilteredContents = filteredContents.filter(content =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (content.description && content.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
             {categories
               .filter((category) => category.key !== 'THEMES')
               .map((category) => (
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

          {/* Affichage des thèmes sur la page d'accueil */}
          {selectedCategory === 'HOME' && (
            <Box sx={{ mb: 6 }}>
              <Typography 
                variant="h3" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  color: '#2c3e50',
                  mb: 4,
                  textAlign: 'center',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                Découvrez nos thèmes d'apprentissage
              </Typography>
              
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {currentThemes.map((theme) => (
                  <Grid item xs={12} sm={6} lg={4} key={theme.id}>
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
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                          borderColor: '#2980b9',
                        },
                      }}
                      onClick={() => {
                        setSelectedCategory('THEMES');
                        setSelectedTheme(theme.id);
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={theme.image}
                        alt={theme.title}
                        sx={{ 
                          borderRadius: '12px 12px 0 0',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          console.error(`Erreur de chargement de l'image: ${theme.image}`, e);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                        onLoad={() => {
                          console.log(`Image chargée avec succès: ${theme.image}`);
                        }}
                      />
                      <Box 
                        sx={{ 
                          height: 200,
                          background: '#3498db',
                          display: 'none',
                          alignItems: 'center', 
                          justifyContent: 'center',
                          borderRadius: '12px 12px 0 0',
                        }}
                      >
                        <School sx={{ fontSize: 60, color: 'white', opacity: 0.9 }} />
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography 
                          variant="h5" 
                          component="h2"
                          sx={{ 
                            fontWeight: 700,
                            fontSize: '1.3rem',
                            lineHeight: 1.2,
                            color: '#2c3e50',
                            mb: 1,
                          }}
                        >
                          {theme.title}
                        </Typography>
                        
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            color: '#3498db',
                            mb: 2,
                            fontStyle: 'italic'
                          }}
                        >
                          {theme.subtitle}
                        </Typography>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'center',
                          mt: 'auto'
                        }}>
                          <Chip 
                            label="Explorer ce thème"
                            sx={{ 
                              background: '#3498db',
                              color: 'white',
                              fontWeight: 600,
                              '&:hover': {
                                background: '#2980b9',
                              }
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

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
                {currentThemes.map((theme) => (
                  <Chip
                    key={theme.id}
                    label={theme.title}
                    onClick={() => setSelectedTheme(theme.id)}
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      py: 2,
                      px: 3,
                      height: 48,
                      borderRadius: 3,
                      background: selectedTheme === theme.id 
                        ? '#3498db'
                        : '#ffffff',
                      color: selectedTheme === theme.id ? '#ffffff' : '#2c3e50',
                      border: selectedTheme === theme.id 
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

          {/* Liste du contenu - seulement si pas sur la page d'accueil */}
          {selectedCategory !== 'HOME' && (
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
              
              {/* Barre de recherche */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Rechercher dans le contenu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#7f8c8d' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: '#ffffff',
                      '& fieldset': {
                        borderColor: '#bdc3c7',
                      },
                      '&:hover fieldset': {
                        borderColor: '#3498db',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3498db',
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Affichage du contenu - seulement si pas sur la page d'accueil */}
          {selectedCategory !== 'HOME' && (
            <>
              {searchFilteredContents.length === 0 ? (
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
                selectedCategory === 'THEMES' ? (
                  <>
                    {['cours_manuel', 'cours_a_ecrire', 'exercice'].map((typeKey) => {
                      const items = searchFilteredContents.filter(c => c.type === typeKey);
                      if (!items.length) return null;
                      return (
                        <Box key={typeKey} sx={{ mb: 4 }}>
                          <Typography 
                            variant="h4" 
                            sx={{ fontWeight: 700, color: '#2c3e50', mb: 0.5 }}
                          >
                            {contentTypeLabels[typeKey] || typeKey}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 2 }}>Semaine 1-5</Typography>
                          <Grid container spacing={{ xs: 2, md: 3 }}>
                            {items.map((content) => (
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
                                      image={API_ENDPOINTS.UPLOADS.FILE(content.miniature)}
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
                        </Box>
                      );
                    })}
                  </>
                ) : (
                  <Grid container spacing={{ xs: 2, md: 3 }}>
                    {searchFilteredContents.map((content) => (
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
                              image={API_ENDPOINTS.UPLOADS.FILE(content.miniature)}
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
                )
              )}
            </>
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
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
                        <Button
                          variant="outlined"
                          startIcon={<PictureAsPdf />}
                          onClick={() => openFileInBrowser(selectedContent.pdfFile, selectedContent.pageNumber)}
                          sx={{
                            borderColor: '#27ae60',
                            color: '#27ae60',
                            '&:hover': {
                              borderColor: '#229954',
                              backgroundColor: 'rgba(39, 174, 96, 0.05)',
                            }
                          }}
                        >
                          Ouvrir dans le navigateur
                        </Button>
                      </Box>
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