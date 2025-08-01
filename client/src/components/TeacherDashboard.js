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
  CardActions,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add,
  School,
  Logout,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  PictureAsPdf,
  Image,
  Home,
  MenuBook,
  AutoStories,
  Create,
  Quiz,
  Assessment,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const SIDEBAR_WIDTH = 280;

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState('CM2');
  const [selectedCategory, setSelectedCategory] = useState('HOME');
  const [selectedTheme, setSelectedTheme] = useState(1);
  const [contents, setContents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    level: 'CM2',
    category: 'THEMES',
    theme: 1,
    subcategory: '',
    type: 'cours_manuel',
    description: '',
    miniature: null,
    pdfFile: null
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const categories = [
    { key: 'HOME', label: 'ACCUEIL', icon: <Home />, description: 'Page d\'accueil' },
    { key: 'THEMES', label: 'THÈMES', icon: <MenuBook />, description: 'Cours par thème' },
    { key: 'LECTURE_SUIVIE', label: 'LECTURE SUIVIE', icon: <AutoStories />, description: 'Textes de lecture' },
    { key: 'PRODUCTION_ECRIT', label: 'PRODUCTION DE L\'ÉCRIT', icon: <Create />, description: 'Exercices d\'écriture' },
    { key: 'EVALUATIONS', label: 'ÉVALUATIONS', icon: <Quiz />, description: 'Tests et contrôles' },
    { key: 'EVIL_SCIENTIFIQUE', label: 'ÉVEIL SCIENTIFIQUE', icon: <Assessment />, description: 'Sciences et découvertes' }
  ];

  const subcategories = [
    'expression_orale',
    'lecture',
    'vocabulaire_thematique',
    'grammaire',
    'conjugaison',
    'orthographe',
    'vocabulaire',
    'poesie',
    'expression_ecrite'
  ];

  const contentTypes = [
    { key: 'cours_manuel', label: 'Cours du manuel' },
    { key: 'cours_a_ecrire', label: 'Cours à écrire' },
    { key: 'exercice', label: 'Exercices' }
  ];

  const getContentTypes = (category) => {
    if (category === 'THEMES') {
      return ['Cours du manuel', 'Cours à écrire', 'Exercices'];
    }
    return ['Cours', 'Exercices', 'Évaluations'];
  };

  useEffect(() => {
    fetchContents();
  }, [selectedLevel, selectedCategory]);

  const fetchContents = async () => {
    try {
      const response = await axios.get(`/content/${selectedLevel}/${selectedCategory}`);
      setContents(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du contenu:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        submitData.append(key, formData[key]);
      }
    });

    try {
      if (editingContent) {
        await axios.put(`/content/${editingContent.id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('/content', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      setOpenDialog(false);
      resetForm();
      fetchContents();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleEdit = (content) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      level: content.level,
      category: content.category,
      theme: content.theme || 1,
      subcategory: content.subcategory || '',
      type: content.type,
      description: content.description || '',
      miniature: null,
      pdfFile: null
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      try {
        await axios.delete(`/content/${id}`);
        fetchContents();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const toggleVisibility = async (id) => {
    try {
      await axios.put(`/content/${id}/visibility`);
      fetchContents();
    } catch (error) {
      console.error('Erreur lors du changement de visibilité:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      level: selectedLevel,
      category: selectedCategory,
      theme: selectedTheme,
      subcategory: '',
      type: 'cours_manuel',
      description: '',
      miniature: null,
      pdfFile: null
    });
    setEditingContent(null);
  };

  const openAddDialog = () => {
    resetForm();
    setOpenDialog(true);
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
              Tableau de Bord
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Professeur
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Bienvenue, {user?.username}
        </Typography>
      </Box>

      {/* Sélection du niveau */}
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <Typography 
          variant="overline" 
          sx={{ 
            mb: 2, 
            display: 'block',
            color: 'text.secondary',
            fontWeight: 600,
            fontSize: '0.75rem'
          }}
        >
          NIVEAU SCOLAIRE
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {['CM2', 'CM1'].map((level) => (
            <Chip
              key={level}
              label={level}
              onClick={() => setSelectedLevel(level)}
              sx={{
                background: selectedLevel === level 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'rgba(102, 126, 234, 0.1)',
                color: selectedLevel === level ? 'white' : '#667eea',
                fontWeight: 600,
                border: 'none',
                '&:hover': {
                  background: selectedLevel === level 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(102, 126, 234, 0.2)',
                },
              }}
            />
          ))}
        </Box>
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
                  fontSize: '0.85rem'
                }}
                secondaryTypographyProps={{
                  sx: { 
                    color: 'rgba(255,255,255,0.8)', 
                    fontSize: '0.7rem',
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
              Tableau de Bord Professeur
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
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                mb: 2,
              }}
            >
              Bienvenue, {user?.username}! 👨‍🏫
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary"
              sx={{
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
              }}
            >
              Gérez vos contenus pédagogiques pour la classe {selectedLevel}
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
                color: 'text.primary',
                mb: 2,
              }}
            >
              Contenu existant
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              {selectedLevel} • {categories.find(c => c.key === selectedCategory)?.label}
              {selectedCategory === 'THEMES' && ` • Thème ${selectedTheme}`}
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
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Aucun contenu pour cette catégorie
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Utilisez le bouton d'ajout pour créer du contenu.
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
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      borderRadius: 3,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    {content.miniature ? (
                      <Box 
                        sx={{ 
                          height: 160, 
                          borderRadius: '12px 12px 0 0',
                          overflow: 'hidden',
                        }}
                      >
                        <img 
                          src={`http://localhost:5000/${content.miniature}`}
                          alt={content.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    ) : (
                      <Box 
                        sx={{ 
                          height: 120, 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography 
                          variant="h6" 
                          component="h2"
                          sx={{ 
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            lineHeight: 1.3,
                            color: 'text.primary',
                          }}
                        >
                          {content.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={content.isVisible ? 'Visible' : 'Masqué'}
                          color={content.isVisible ? 'success' : 'default'}
                          sx={{
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        />
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        gutterBottom
                        sx={{ fontWeight: 500 }}
                      >
                        {getContentTypes(selectedCategory).find(t => t === content.contentType) || content.contentType}
                      </Typography>
                      
                      {content.description && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mt: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {content.description}
                        </Typography>
                      )}
                      
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {content.pdfFile && (
                          <Chip 
                            size="small" 
                            icon={<PictureAsPdf />} 
                            label="PDF" 
                            sx={{ 
                              background: 'rgba(244, 67, 54, 0.1)',
                              color: 'error.main',
                              fontWeight: 500,
                            }}
                          />
                        )}
                        {content.miniature && (
                          <Chip 
                            size="small" 
                            icon={<Image />} 
                            label="Image" 
                            sx={{ 
                              background: 'rgba(102, 126, 234, 0.1)',
                              color: 'primary.main',
                              fontWeight: 500,
                            }}
                          />
                        )}
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          onClick={() => handleEdit(content)} 
                          size="small"
                          sx={{
                            color: 'primary.main',
                            background: 'rgba(102, 126, 234, 0.1)',
                            '&:hover': {
                              background: 'rgba(102, 126, 234, 0.2)',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDelete(content.id)} 
                          size="small"
                          sx={{
                            color: 'error.main',
                            background: 'rgba(244, 67, 54, 0.1)',
                            '&:hover': {
                              background: 'rgba(244, 67, 54, 0.2)',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                      <IconButton 
                        onClick={() => toggleVisibility(content.id)} 
                        size="small"
                        sx={{
                          color: content.isVisible ? 'success.main' : 'text.secondary',
                          background: content.isVisible 
                            ? 'rgba(76, 175, 80, 0.1)' 
                            : 'rgba(158, 158, 158, 0.1)',
                          '&:hover': {
                            background: content.isVisible 
                              ? 'rgba(76, 175, 80, 0.2)' 
                              : 'rgba(158, 158, 158, 0.2)',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {content.isVisible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Bouton d'ajout flottant */}
          <Fab
            color="primary"
            aria-label="add"
            sx={{ 
              position: 'fixed', 
              bottom: 24, 
              right: 24,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
            onClick={openAddDialog}
          >
            <Add />
          </Fab>

          {/* Dialog d'ajout/modification */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h5">
                {editingContent ? 'Modifier le contenu' : 'Ajouter du contenu'}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  label="Titre"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  margin="normal"
                  required
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Niveau</InputLabel>
                      <Select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      >
                        <MenuItem value="CM2">CM2</MenuItem>
                        <MenuItem value="CM1">CM1</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Catégorie</InputLabel>
                      <Select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat.key} value={cat.key}>{cat.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {formData.category === 'THEMES' && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Thème</InputLabel>
                        <Select
                          value={formData.theme}
                          onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                        >
                          {[1, 2, 3, 4, 5, 6].map((theme) => (
                            <MenuItem key={theme} value={theme}>Thème {theme}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Sous-catégorie</InputLabel>
                        <Select
                          value={formData.subcategory}
                          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        >
                          {subcategories.map((sub) => (
                            <MenuItem key={sub} value={sub}>
                              {sub.replace('_', ' ')}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                )}

                <FormControl fullWidth margin="normal">
                  <InputLabel>Type de contenu</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {contentTypes.map((type) => (
                      <MenuItem key={type.key} value={type.key}>{type.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  margin="normal"
                />

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<Image />}
                    >
                      Miniature
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, miniature: e.target.files[0] })}
                      />
                    </Button>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<PictureAsPdf />}
                    >
                      Fichier PDF
                      <input
                        type="file"
                        hidden
                        accept=".pdf"
                        onChange={(e) => setFormData({ ...formData, pdfFile: e.target.files[0] })}
                      />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
              <Button onClick={handleSubmit} variant="contained">
                {editingContent ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default TeacherDashboard;