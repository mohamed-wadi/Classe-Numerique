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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  InputAdornment,
  CardMedia
 } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
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
  GetApp,
  Menu as MenuIcon,
  Close as CloseIcon,
  ContactMail,
  People,
  Person,
  Search as SearchIcon
} from '@mui/icons-material';
  import SeyesBoard from './SeyesBoard';
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

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState('CM2');
  const [selectedCategory, setSelectedCategory] = useState('EXERCICES');
  const [selectedTheme, setSelectedTheme] = useState(1);
  const [contents, setContents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactMessages, setContactMessages] = useState([]);
  const [students, setStudents] = useState([]);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [openStudentsDialog, setOpenStudentsDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [seyesShowMenu, setSeyesShowMenu] = useState(true);
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

  // Nouvel état pour le formulaire de gestion des élèves
  const [studentFormData, setStudentFormData] = useState({
    username: '',
    password: '',
    level: 'CM2'
  });

  // État pour la boîte de dialogue de confirmation de visibilité
  const [visibilityConfirmDialog, setVisibilityConfirmDialog] = useState({
    open: false,
    contentId: null,
    action: '',
    contentTitle: ''
  });

  // État pour la boîte de dialogue d'affichage du contenu
  const [contentViewDialog, setContentViewDialog] = useState({
    open: false,
    content: null
  });

  // États pour les historiques
  const [historiqueAjouts, setHistoriqueAjouts] = useState([]);
  const [historiqueVisibilite, setHistoriqueVisibilite] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const categories = [
    { key: 'EXERCICES', label: 'EXERCICES', icon: <Home />, description: 'Page d\'accueil' },
    { key: 'HOME', label: 'THEMES', icon: (
      <SvgIcon>
        <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1m0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5z"></path>
      </SvgIcon>
    ), description: 'Cours par themes' },
    { key: 'SEYES', label: 'CAHIER SEYES', icon: <Create />, description: 'Écrire au stylo sur un cahier Seyes' },
    { key: 'THEMES', label: 'THÈMES', icon: <MenuBook />, description: 'Cours par thème' },
    { key: 'CAHIER_EXERCICE', label: 'CAHIER EXERCICE', icon: <Create />, description: 'Cahier d\'exercice' },
    { key: 'LECTURE_SUIVIE', label: 'LECTURE SUIVIE', icon: <AutoStories />, description: 'Page d\'accueil' },
    { key: 'PRODUCTION_ECRIT', label: 'PRODUCTION ÉCRITE', icon: <Create />, description: 'Page d\'accueil' },
    { key: 'EVALUATIONS', label: 'ÉVALUATIONS', icon: <Quiz />, description: 'Page d\'accueil' },
    { key: 'EVIL_SCIENTIFIQUE', label: 'ÉVEIL SCIENTIFIQUE', icon: <Assessment />, description: 'Page d\'accueil' },
    { key: 'CONTACT', label: 'MESSAGES', icon: <ContactMail />, description: 'Messages de contact' },
    { key: 'STUDENTS', label: 'GESTION COMPTES', icon: <People />, description: 'Gérer les comptes élèves' },
    { key: 'HISTORIQUE_AJOUTS', label: 'HISTORIQUE AJOUTS', icon: <Add />, description: 'Historique des ajouts' },
    { key: 'HISTORIQUE_VISIBILITE', label: 'HISTORIQUE VISIBILITÉ', icon: <Visibility />, description: 'Historique des changements de visibilité' }
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

  // Sélectionner les thèmes selon le niveau sélectionné
  const currentThemes = selectedLevel === 'CM1' ? themes : cm2Themes;

  const getContentTypes = (category) => {
    if (category === 'THEMES') {
      return ['Cours du manuel', 'Cours à écrire', 'Exercices'];
    }
    return ['Cours', 'Exercices', 'Évaluations'];
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

  // Nouvelles fonctions pour les messages de contact
  const fetchContactMessages = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.CONTACT.MESSAGES);
      setContactMessages(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setOpenContactDialog(true);
  };

  const deleteMessage = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      try {
        await axios.delete(API_ENDPOINTS.CONTACT.MESSAGE_BY_ID(id));
        fetchContactMessages();
        setOpenContactDialog(false);
      } catch (error) {
        console.error('Erreur lors de la suppression du message:', error);
      }
    }
  };

  // Nouvelles fonctions pour la gestion des comptes élèves
  const fetchStudents = async () => {
    try {
      console.log('Chargement de la liste des élèves...');
      const response = await axios.get(API_ENDPOINTS.STUDENTS.BASE);
      console.log('Données reçues du serveur:', response.data);
      setStudents(response.data);
      console.log('Liste des élèves mise à jour dans l\'état');
    } catch (error) {
      console.error('Erreur lors du chargement des élèves:', error);
      alert(`Erreur lors du chargement des élèves: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleStudentEdit = (student) => {
    setEditingStudent(student);
    setStudentFormData({
      username: student.username,
      password: '', // Toujours vide pour la modification
      level: student.level
    });
    setOpenStudentsDialog(true);
  };

  const handleStudentSave = async (studentData) => {
    try {
      if (editingStudent) {
        await axios.put(API_ENDPOINTS.STUDENTS.BY_ID(editingStudent.id), studentData);
      } else {
        await axios.post(API_ENDPOINTS.STUDENTS.BASE, studentData);
      }
      fetchStudents();
      setOpenStudentsDialog(false);
      setEditingStudent(null);
      // Réinitialiser le formulaire
      setStudentFormData({
        username: '',
        password: '',
        level: 'CM2'
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'élève:', error);
    }
  };

  const toggleStudentStatus = async (id, isActive) => {
    try {
      console.log(`Changement de statut pour l'élève ${id}: ${isActive ? 'Actif' : 'Inactif'}`);
      
      const response = await axios.put(API_ENDPOINTS.STUDENTS.STATUS(id), { isActive });
      console.log('Réponse du serveur:', response.data);
      
      // Recharger la liste des élèves
      await fetchStudents();
      
      console.log(`Statut mis à jour avec succès pour l'élève ${id}`);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      alert(`Erreur lors du changement de statut: ${error.response?.data?.message || error.message}`);
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce compte élève ?')) {
      try {
        await axios.delete(API_ENDPOINTS.STUDENTS.BY_ID(id));
        fetchStudents();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'élève:', error);
      }
    }
  };

  // Fonctions pour les historiques
  const fetchHistoriqueAjouts = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.CONTENT.BASE);
      const allContents = response.data;
      // Trier par date de création (du plus récent au plus ancien)
      const sortedContents = allContents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setHistoriqueAjouts(sortedContents);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique des ajouts:', error);
    }
  };

  const fetchHistoriqueVisibilite = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.CONTENT.BASE);
      const allContents = response.data;
      // Filtrer seulement les contenus qui ont une date de changement de visibilité
      const contentsWithVisibilityChanges = allContents.filter(content => content.visibilityChangedAt);
      // Trier par date de changement de visibilité (du plus récent au plus ancien)
      const sortedContents = contentsWithVisibilityChanges.sort((a, b) => new Date(b.visibilityChangedAt) - new Date(a.visibilityChangedAt));
      setHistoriqueVisibilite(sortedContents);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique de visibilité:', error);
    }
  };

  const fetchContents = useCallback(async () => {
    try {
      console.log(`📚 Chargement des contenus pour ${selectedLevel}/${selectedCategory}...`);
      const response = await axios.get(API_ENDPOINTS.CONTENT.BY_LEVEL_CATEGORY(selectedLevel, selectedCategory));
      
      if (response.data && Array.isArray(response.data)) {
        setContents(response.data);
        console.log(`✅ ${response.data.length} contenus chargés avec succès pour ${selectedLevel}/${selectedCategory}`);
        
        // Vérifier les miniatures
        const contentsWithMiniatures = response.data.filter(content => content.miniature);
        const contentsWithoutMiniatures = response.data.filter(content => !content.miniature);
        
        if (contentsWithMiniatures.length > 0) {
          console.log(`🖼️  ${contentsWithMiniatures.length} contenus avec miniatures`);
        }
        if (contentsWithoutMiniatures.length > 0) {
          console.log(`⚠️  ${contentsWithoutMiniatures.length} contenus sans miniatures`);
        }
      } else {
        console.warn('⚠️  Réponse invalide du serveur:', response.data);
        setContents([]);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement du contenu:', error);
      
      // Tentative de rechargement automatique après 3 secondes
      setTimeout(() => {
        console.log('🔄 Tentative de rechargement automatique...');
        fetchContents();
      }, 3000);
    }
  }, [selectedLevel, selectedCategory]);

  // Charger les données selon la catégorie sélectionnée
  useEffect(() => {
    if (selectedCategory === 'CONTACT') {
      fetchContactMessages();
    } else if (selectedCategory === 'STUDENTS') {
      fetchStudents();
    } else if (selectedCategory === 'HISTORIQUE_AJOUTS') {
      fetchHistoriqueAjouts();
    } else if (selectedCategory === 'HISTORIQUE_VISIBILITE') {
      fetchHistoriqueVisibilite();
    } else {
      fetchContents();
    }
  }, [selectedCategory, fetchContents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📝 Soumission du formulaire...');
    console.log('📋 Données du formulaire:', formData);
    
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('level', formData.level);
    submitData.append('category', formData.category);
    submitData.append('theme', formData.theme);
    submitData.append('subcategory', formData.subcategory);
    submitData.append('type', formData.type);
    submitData.append('description', formData.description);
    if (formData.pageNumber) {
      submitData.append('pageNumber', String(formData.pageNumber));
    }
    
    if (formData.pdfFile) {
      submitData.append('pdfFile', formData.pdfFile, formData.pdfFile.name);
      console.log('📄 PDF ajouté au formulaire');
    }
    if (formData.miniature) {
      submitData.append('miniature', formData.miniature, formData.miniature.name);
      console.log('🖼️  Miniature ajoutée au formulaire');
    }
    
    try {
      if (editingContent) {
        console.log(`✏️  Modification du contenu ${editingContent.id}...`);
        await axios.put(API_ENDPOINTS.CONTENT.BY_ID(editingContent.id), submitData);
        console.log('✅ Contenu modifié avec succès');
      } else {
        console.log('🆕 Création d\'un nouveau contenu...');
        await axios.post(API_ENDPOINTS.CONTENT.BASE, submitData);
        console.log('✅ Nouveau contenu créé avec succès');
      }
      
      // Recharger les contenus et fermer le dialogue
      await fetchContents();
      setOpenDialog(false);
      resetForm();
      
      console.log('🔄 Interface mise à jour avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde du contenu:', error);
      
      // Afficher un message d'erreur plus détaillé
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la sauvegarde';
      alert(`Erreur: ${errorMessage}`);
    }
  };

  const handleEdit = (content) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      level: content.level,
      category: content.category,
      theme: content.theme,
      subcategory: content.subcategory,
      type: content.type,
      description: content.description,
      pdfFile: null,
      miniature: null
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      try {
        await axios.delete(API_ENDPOINTS.CONTENT.BY_ID(id));
        fetchContents();
      } catch (error) {
        console.error('Erreur lors de la suppression du contenu:', error);
      }
    }
  };

  const toggleVisibility = async (id) => {
    setVisibilityConfirmDialog({ 
      open: true, 
      contentId: id, 
      action: 'toggle',
      contentTitle: contents.find(c => c.id === id)?.title || ''
    });
  };

  const handleVisibilityConfirm = async () => {
    try {
      await axios.put(API_ENDPOINTS.CONTENT.BY_ID(visibilityConfirmDialog.contentId) + '/visibility');
      fetchContents();
      setVisibilityConfirmDialog({ open: false, contentId: null, action: '', contentTitle: '' });
    } catch (error) {
      console.error('Erreur lors du changement de visibilité:', error);
    }
  };

  const handleContentView = (content) => {
    setContentViewDialog({
      open: true,
      content: content
    });
  };

  const openFileInBrowser = (filePath, pageNumber) => {
    const url = API_ENDPOINTS.UPLOADS.FILE(filePath);
    const anchor = pageNumber && Number(pageNumber) > 0 ? `#page=${Number(pageNumber)}` : '';
    window.open(url + anchor, '_blank');
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

  const filteredContents = selectedCategory === 'THEMES' 
    ? contents.filter(content => content.theme === selectedTheme)
    : contents;

  // Filtrage par terme de recherche
  const searchFilteredContents = filteredContents.filter(content =>
    content.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrage par terme de recherche pour les messages de contact
  const searchFilteredContactMessages = contactMessages.filter(message =>
    message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrage par terme de recherche pour les élèves
  const searchFilteredStudents = students.filter(student =>
    student.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.level?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrage par terme de recherche pour l'historique des ajouts
  const searchFilteredHistoriqueAjouts = historiqueAjouts.filter(content =>
    content.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.level?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrage par terme de recherche pour l'historique de visibilité
  const searchFilteredHistoriqueVisibilite = historiqueVisibilite.filter(content =>
    content.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.level?.toLowerCase().includes(searchTerm.toLowerCase())
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
            color: '#7f8c8d',
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
                  ? '#3498db'
                  : '#ecf0f1',
                color: selectedLevel === level ? 'white' : '#2c3e50',
                fontWeight: 600,
                border: 'none',
                '&:hover': {
                  background: selectedLevel === level 
                    ? '#2980b9'
                    : '#d5dbdb',
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
                  color: selectedCategory === category.key ? 'white' : '#3498db',
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
            borderColor: '#3498db',
            color: '#3498db',
            '&:hover': {
              borderColor: '#2980b9',
              background: 'rgba(52, 152, 219, 0.05)',
            }
          }}
        >
          Déconnexion
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
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
              Tableau de Bord Professeur
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 3 }, px: { xs: 2, sm: 3 } }}>
          {/* Message de bienvenue */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{
                fontWeight: 700,
                color: '#2c3e50',
                fontSize: { xs: '1.5rem', md: '2rem' },
                mb: 1,
              }}
            >
              Bienvenue, {user?.username}! 👨‍🏫
            </Typography>
            <Typography 
              variant="h6" 
              sx={{
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.1rem' },
                color: '#7f8c8d',
              }}
            >
              Gérez vos contenus pédagogiques pour la classe {selectedLevel}
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
                Thèmes d'apprentissage pour {selectedLevel}
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
                            label="Gérer ce thème"
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
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  color: '#2c3e50',
                  mb: 2,
                  textAlign: 'center',
                }}
              >
                Sélectionner un thème
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                {currentThemes.map((theme) => (
                  <Chip
                    key={theme.id}
                    label={`Thème ${theme.id}`}
                    onClick={() => setSelectedTheme(theme.id)}
                    sx={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      py: 1.5,
                      px: 2,
                      height: 40,
                      borderRadius: 2,
                      background: selectedTheme === theme.id 
                        ? '#3498db'
                        : '#ecf0f1',
                      color: selectedTheme === theme.id ? '#ffffff' : '#2c3e50',
                      border: selectedTheme === theme.id 
                        ? 'none'
                        : '1px solid #bdc3c7',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': { 
                        transform: 'translateY(-1px) scale(1.02)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Liste du contenu */}
          {selectedCategory !== 'HOME' && (
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  color: '#2c3e50',
                  mb: 1,
                }}
              >
                {selectedCategory === 'CONTACT' ? 'Messages de contact' : 
                 selectedCategory === 'STUDENTS' ? 'Gestion des comptes élèves' : 
                 'Contenu existant'}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 2,
                  color: '#7f8c8d',
                }}
              >
                {selectedCategory === 'CONTACT' ? `${contactMessages.length} message(s) reçu(s)` :
                 selectedCategory === 'STUDENTS' ? `${students.length} compte(s) élève(s)` :
                 `${selectedLevel} • ${categories.find(c => c.key === selectedCategory)?.label}${selectedCategory === 'THEMES' ? ` • Thème ${selectedTheme}` : ''}`}
              </Typography>
            </Box>
          )}

          {/* Cahier Seyes (éditeur externe intégré) */}
          {selectedCategory === 'SEYES' && (
            <Box sx={{ position: 'fixed', inset: 0, zIndex: 1200, bgcolor: '#fff', display: 'flex' }}>
              {seyesShowMenu && (
                <Box sx={{ width: { xs: 0, md: SIDEBAR_WIDTH }, display: { xs: 'none', md: 'block' } }}>
                  {sidebarContent}
                </Box>
              )}
              <Box sx={{ flexGrow: 1 }}>
                <SeyesBoard fullScreen onToggleMenu={() => setSeyesShowMenu((v) => !v)} isMenuVisible={seyesShowMenu} />
              </Box>
            </Box>
          )}

          {/* Affichage des messages de contact */}
          {selectedCategory === 'CONTACT' && (
            <>
              {/* Barre de recherche pour les messages */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Rechercher dans les messages..."
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

              {contactMessages.length === 0 ? (
                <Card 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    background: '#ffffff',
                    border: '1px solid #ecf0f1',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Box sx={{ color: '#bdc3c7', mb: 2 }}>
                    <ContactMail sx={{ fontSize: 48, opacity: 0.5 }} />
                  </Box>
                  <Typography variant="h6" color="#7f8c8d" gutterBottom>
                    Aucun message de contact
                  </Typography>
                  <Typography variant="body2" color="#95a5a6">
                    Les messages envoyés depuis la page de contact apparaîtront ici.
                  </Typography>
                </Card>
              ) : (
                <Grid container spacing={2}>
                  {searchFilteredContactMessages.map((message) => (
                    <Grid item xs={12} sm={6} lg={4} key={message.id}>
                      <Card 
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          background: '#ffffff',
                          border: '1px solid #ecf0f1',
                          borderRadius: 2,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                          },
                        }}
                        onClick={() => handleMessageClick(message)}
                      >
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ bgcolor: '#3498db', mr: 2 }}>
                              <Person />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                {message.name}
                              </Typography>
                              <Typography variant="body2" color="#7f8c8d">
                                {new Date(message.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2" color="#7f8c8d" sx={{ mb: 2 }}>
                            {message.email}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="#2c3e50"
                            sx={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {message.message}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}

          {/* Affichage de la gestion des comptes élèves */}
          {selectedCategory === 'STUDENTS' && (
            <Box>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="#2c3e50">
                  Comptes élèves
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => {
                    setEditingStudent(null);
                    setStudentFormData({
                      username: '',
                      password: '',
                      level: 'CM2'
                    });
                    setOpenStudentsDialog(true);
                  }}
                  sx={{
                    backgroundColor: '#3498db',
                    '&:hover': {
                      backgroundColor: '#2980b9',
                    }
                  }}
                >
                  Ajouter un élève
                </Button>
              </Box>
              
              {/* Barre de recherche pour les élèves */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Rechercher un élève..."
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

              <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Nom d'utilisateur</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Niveau</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Statut</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchFilteredStudents.map((student) => (
                      <TableRow key={student.id} sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                        <TableCell sx={{ color: '#2c3e50' }}>{student.username}</TableCell>
                        <TableCell>
                          <Chip 
                            label={student.level} 
                            size="small"
                            sx={{ 
                              backgroundColor: student.level === 'CM2' ? '#3498db' : '#e67e22',
                              color: 'white',
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={student.isActive}
                                onChange={(e) => toggleStudentStatus(student.id, e.target.checked)}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#27ae60',
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#27ae60',
                                  },
                                }}
                              />
                            }
                            label={student.isActive ? 'Actif' : 'Inactif'}
                            sx={{ color: '#7f8c8d' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              onClick={() => handleStudentEdit(student)}
                              size="small"
                              sx={{
                                color: '#3498db',
                                '&:hover': {
                                  backgroundColor: 'rgba(52, 152, 219, 0.1)',
                                }
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton 
                              onClick={() => deleteStudent(student.id)}
                              size="small"
                              sx={{
                                color: '#e74c3c',
                                '&:hover': {
                                  backgroundColor: 'rgba(231, 76, 60, 0.1)',
                                }
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Affichage de l'historique des ajouts */}
          {selectedCategory === 'HISTORIQUE_AJOUTS' && (
            <Box>
              <Typography variant="h6" color="#2c3e50" sx={{ mb: 3 }}>
                Historique des ajouts de contenu ({historiqueAjouts.length} élément(s))
              </Typography>
              
              {/* Barre de recherche pour l'historique des ajouts */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Rechercher dans l'historique des ajouts..."
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

              <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Titre</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Niveau</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Catégorie</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Date d'ajout</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchFilteredHistoriqueAjouts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#7f8c8d' }}>
                          Aucun contenu ajouté
                        </TableCell>
                      </TableRow>
                    ) : (
                      searchFilteredHistoriqueAjouts.map((content) => (
                        <TableRow key={content.id} sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                          <TableCell sx={{ color: '#2c3e50', fontWeight: 500 }}>{content.title}</TableCell>
                          <TableCell>
                            <Chip 
                              label={content.level} 
                              size="small"
                              sx={{ 
                                backgroundColor: content.level === 'CM2' ? '#3498db' : '#e67e22',
                                color: 'white',
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: '#7f8c8d' }}>
                            {categories.find(c => c.key === content.category)?.label || content.category}
                          </TableCell>
                          <TableCell sx={{ color: '#7f8c8d' }}>{content.type}</TableCell>
                          <TableCell sx={{ color: '#7f8c8d' }}>
                            {new Date(content.createdAt).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              onClick={() => handleContentView(content)}
                              size="small"
                              sx={{
                                color: '#3498db',
                                '&:hover': {
                                  backgroundColor: 'rgba(52, 152, 219, 0.1)',
                                }
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Affichage de l'historique des changements de visibilité */}
          {selectedCategory === 'HISTORIQUE_VISIBILITE' && (
            <Box>
              <Typography variant="h6" color="#2c3e50" sx={{ mb: 3 }}>
                Historique des changements de visibilité ({historiqueVisibilite.length} élément(s))
              </Typography>
              
              {/* Barre de recherche pour l'historique de visibilité */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Rechercher dans l'historique de visibilité..."
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

              <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Titre</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Niveau</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Catégorie</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Statut</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Date de modification</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchFilteredHistoriqueVisibilite.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#7f8c8d' }}>
                          Aucun changement de visibilité
                        </TableCell>
                      </TableRow>
                    ) : (
                      searchFilteredHistoriqueVisibilite.map((content) => (
                        <TableRow key={content.id} sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                          <TableCell sx={{ color: '#2c3e50', fontWeight: 500 }}>{content.title}</TableCell>
                          <TableCell>
                            <Chip 
                              label={content.level} 
                              size="small"
                              sx={{ 
                                backgroundColor: content.level === 'CM2' ? '#3498db' : '#e67e22',
                                color: 'white',
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: '#7f8c8d' }}>
                            {categories.find(c => c.key === content.category)?.label || content.category}
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={content.isVisible ? 'Visible' : 'Masqué'}
                              color={content.isVisible ? 'success' : 'default'}
                              sx={{
                                fontWeight: 500,
                                fontSize: '0.7rem',
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: '#7f8c8d' }}>
                            {new Date(content.visibilityChangedAt).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              onClick={() => handleContentView(content)}
                              size="small"
                              sx={{
                                color: '#3498db',
                                '&:hover': {
                                  backgroundColor: 'rgba(52, 152, 219, 0.1)',
                                }
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Affichage du contenu normal */}
          {selectedCategory !== 'HOME' && selectedCategory !== 'CONTACT' && selectedCategory !== 'STUDENTS' && selectedCategory !== 'HISTORIQUE_AJOUTS' && selectedCategory !== 'HISTORIQUE_VISIBILITE' && (
            <>
              {/* Barre de recherche pour le contenu */}
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

              {searchFilteredContents.length === 0 ? (
                <Card 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    background: '#ffffff',
                    border: '1px solid #ecf0f1',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Box sx={{ color: '#bdc3c7', mb: 2 }}>
                    <School sx={{ fontSize: 48, opacity: 0.5 }} />
                  </Box>
                  <Typography variant="h6" color="#7f8c8d" gutterBottom>
                    Aucun contenu pour cette catégorie
                  </Typography>
                  <Typography variant="body2" color="#95a5a6">
                    Utilisez le bouton d'ajout pour créer du contenu.
                  </Typography>
                </Card>
              ) : (
                (selectedCategory === 'THEMES' ? contentTypes : [{ key: 'all', label: '' }]).map((typeDef) => {
                  const items = searchFilteredContents.filter((c) => c.type === typeDef.key);
                  // Pour les autres catégories, afficher tous les contenus non groupés
                  if (selectedCategory !== 'THEMES') {
                    const flatItems = searchFilteredContents;
                    return (
                      <Grid container spacing={2} key="flat-list">
                        {flatItems.map((content) => (
                          <Grid item xs={12} sm={6} lg={4} key={content.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff', border: '1px solid #ecf0f1', borderRadius: 2, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)' } }}>
                              {content.miniature ? (
                                <Box sx={{ height: 140, borderRadius: '8px 8px 0 0', overflow: 'hidden', cursor: 'pointer', position: 'relative', '&:hover': { '&::after': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' } } }} onClick={() => handleContentView(content)}>
                                  <img src={API_ENDPOINTS.UPLOADS.FILE(content.miniature)} alt={content.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; const fb = e.target.nextSibling; if (fb) fb.style.display = 'flex'; }} />
                                  <Box sx={{ height: 140, background: '#3498db', display: 'none', alignItems: 'center', justifyContent: 'center', borderRadius: '8px 8px 0 0', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                                    <Image sx={{ fontSize: 48, color: 'white', opacity: 0.9 }} />
                                  </Box>
                                </Box>
                              ) : (
                                <Box sx={{ height: 100, background: '#3498db', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px 8px 0 0' }}>
                                  <School sx={{ fontSize: 32, color: 'white', opacity: 0.9 }} />
                                </Box>
                              )}
                              <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.3, color: '#2c3e50' }}>
                                    {content.title}
                                  </Typography>
                                  <Chip size="small" label={content.isVisible ? 'Visible' : 'Masqué'} color={content.isVisible ? 'success' : 'default'} sx={{ fontWeight: 500, fontSize: '0.7rem' }} />
                                </Box>
                                {content.description && (
                                  <Typography variant="body2" color="#95a5a6" sx={{ mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {content.description}
                                  </Typography>
                                )}
                                <Box sx={{ mt: 1.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                  {content.pdfFile && (
                                    <Chip 
                                      size="small" 
                                      icon={<PictureAsPdf />} 
                                      label="PDF" 
                                      sx={{ 
                                        background: 'rgba(231, 76, 60, 0.1)',
                                        color: '#e74c3c',
                                        fontWeight: 500,
                                        fontSize: '0.7rem',
                                      }}
                                    />
                                  )}
                                  {content.miniature && (
                                    <Chip 
                                      size="small" 
                                      icon={<Image />} 
                                      label="Image" 
                                      sx={{ 
                                        background: 'rgba(52, 152, 219, 0.1)',
                                        color: '#3498db',
                                        fontWeight: 500,
                                        fontSize: '0.7rem',
                                      }}
                                    />
                                  )}
                                </Box>
                              </CardContent>
                              <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                  <Chip
                                    label={`Page ${content.pageNumber || 1}`}
                                    sx={{
                                      background: 'linear-gradient(135deg, rgba(52,152,219,0.15), rgba(41,128,185,0.15))',
                                      color: '#2c3e50',
                                      fontWeight: 600,
                                      mr: 1
                                    }}
                                  />
                                  <TextField
                                    type="number"
                                    size="small"
                                    value={content.pageNumber || 1}
                                    onChange={(e) => {
                                      const newPageNumber = parseInt(e.target.value || '1', 10);
                                      const updatedContents = contents.map(c =>
                                        c.id === content.id ? { ...c, pageNumber: newPageNumber } : c
                                      );
                                      setContents(updatedContents);
                                    }}
                                    onBlur={async (e) => {
                                      try {
                                        const pageNumber = parseInt(e.target.value || '1', 10);
                                        await axios.put(API_ENDPOINTS.CONTENT.BY_ID(content.id) + '/page', { pageNumber });
                                        fetchContents();
                                      } catch (err) {
                                        console.error('Erreur MAJ pageNumber:', err);
                                        fetchContents();
                                      }
                                    }}
                                    inputProps={{ min: 1 }}
                                    sx={{ width: 80, mr: 1 }}
                                  />
                                  <IconButton 
                                    onClick={() => handleEdit(content)} 
                                    size="small"
                                    sx={{
                                      color: '#3498db',
                                      background: 'rgba(52, 152, 219, 0.1)',
                                      '&:hover': {
                                        background: '#3498db',
                                        color: '#ffffff',
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
                                      color: '#e74c3c',
                                      background: 'rgba(231, 76, 60, 0.1)',
                                      '&:hover': {
                                        background: '#e74c3c',
                                        color: '#ffffff',
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
                                    color: content.isVisible ? '#27ae60' : '#95a5a6',
                                    background: content.isVisible 
                                      ? 'rgba(39, 174, 96, 0.1)' 
                                      : 'rgba(149, 165, 166, 0.1)',
                                    '&:hover': {
                                      background: content.isVisible 
                                        ? '#27ae60' 
                                        : '#95a5a6',
                                      color: '#ffffff',
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
                    );
                  }
                  if (!items.length) return null;
                  return (
                    <Box key={typeDef.key} sx={{ mb: 4 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                        {typeDef.label}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 2 }}>Semaine 1-5</Typography>
                      <Grid container spacing={2}>
                        {items.map((content) => (
                          <Grid item xs={12} sm={6} lg={4} key={content.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff', border: '1px solid #ecf0f1', borderRadius: 2, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)' } }}>
                              {content.miniature ? (
                                <Box sx={{ height: 140, borderRadius: '8px 8px 0 0', overflow: 'hidden', cursor: 'pointer', position: 'relative', '&:hover': { '&::after': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' } } }} onClick={() => handleContentView(content)}>
                                  <img src={API_ENDPOINTS.UPLOADS.FILE(content.miniature)} alt={content.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; const fb = e.target.nextSibling; if (fb) fb.style.display = 'flex'; }} />
                                  <Box sx={{ height: 140, background: '#3498db', display: 'none', alignItems: 'center', justifyContent: 'center', borderRadius: '8px 8px 0 0', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                                    <Image sx={{ fontSize: 48, color: 'white', opacity: 0.9 }} />
                                  </Box>
                                </Box>
                              ) : (
                                <Box sx={{ height: 100, background: '#3498db', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px 8px 0 0' }}>
                                  <School sx={{ fontSize: 32, color: 'white', opacity: 0.9 }} />
                                </Box>
                              )}
                              <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.3, color: '#2c3e50' }}>
                                    {content.title}
                                  </Typography>
                                  <Chip size="small" label={content.isVisible ? 'Visible' : 'Masqué'} color={content.isVisible ? 'success' : 'default'} sx={{ fontWeight: 500, fontSize: '0.7rem' }} />
                                </Box>
                                {content.description && (
                                  <Typography variant="body2" color="#95a5a6" sx={{ mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {content.description}
                                  </Typography>
                                )}
                                <Box sx={{ mt: 1.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                  {content.pdfFile && (<Chip size="small" icon={<PictureAsPdf />} label="PDF" sx={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', fontWeight: 500, fontSize: '0.7rem' }} />)}
                                  {content.miniature && (<Chip size="small" icon={<Image />} label="Image" sx={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', fontWeight: 500, fontSize: '0.7rem' }} />)}
                                </Box>
                              </CardContent>
                              <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                  <Chip label={`Page ${content.pageNumber || 1}`} sx={{ background: 'linear-gradient(135deg, rgba(52,152,219,0.15), rgba(41,128,185,0.15))', color: '#2c3e50', fontWeight: 600, mr: 1 }} />
                                  <TextField type="number" size="small" value={content.pageNumber || 1} onChange={(e) => { const newPage = parseInt(e.target.value || '1', 10); const updated = contents.map(c => c.id === content.id ? { ...c, pageNumber: newPage } : c); setContents(updated); }} onBlur={async (e) => { try { const pageNumber = parseInt(e.target.value || '1', 10); await axios.put(API_ENDPOINTS.CONTENT.BY_ID(content.id) + '/page', { pageNumber }); fetchContents(); } catch (err) { console.error('Erreur MAJ pageNumber:', err); fetchContents(); } }} inputProps={{ min: 1 }} sx={{ width: 80, mr: 1 }} />
                                  <IconButton onClick={() => handleEdit(content)} size="small" sx={{ color: '#3498db', background: 'rgba(52, 152, 219, 0.1)', '&:hover': { background: '#3498db', color: '#ffffff', transform: 'scale(1.1)' }, transition: 'all 0.2s ease' }}>
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton onClick={() => handleDelete(content.id)} size="small" sx={{ color: '#e74c3c', background: 'rgba(231, 76, 60, 0.1)', '&:hover': { background: '#e74c3c', color: '#ffffff', transform: 'scale(1.1)' }, transition: 'all 0.2s ease' }}>
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                                <IconButton onClick={() => toggleVisibility(content.id)} size="small" sx={{ color: content.isVisible ? '#27ae60' : '#95a5a6', background: content.isVisible ? 'rgba(39, 174, 96, 0.1)' : 'rgba(149, 165, 166, 0.1)', '&:hover': { background: content.isVisible ? '#27ae60' : '#95a5a6', color: '#ffffff', transform: 'scale(1.1)' }, transition: 'all 0.2s ease' }}>
                                  {content.isVisible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                              </CardActions>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  );
                })
              )}
            </>
          )}

          {/* Bouton d'ajout flottant - seulement pour les catégories de contenu */}
          {selectedCategory !== 'HOME' && selectedCategory !== 'CONTACT' && selectedCategory !== 'STUDENTS' && selectedCategory !== 'HISTORIQUE_AJOUTS' && selectedCategory !== 'HISTORIQUE_VISIBILITE' && (
          <Fab
            color="primary"
            aria-label="Ajouter du contenu"
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              background: '#3498db',
              zIndex: 1000,
              '&:hover': {
                background: '#2980b9',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
            onClick={openAddDialog}
          >
            <Add />
          </Fab>
          )}

          {/* Dialog d'ajout/modification */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ bgcolor: '#3498db', color: 'white' }}>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f8f9fa',
                      borderRadius: 1.5,
                    }
                  }}
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Niveau</InputLabel>
                      <Select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#f8f9fa',
                            borderRadius: 1.5,
                          }
                        }}
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#f8f9fa',
                            borderRadius: 1.5,
                          }
                        }}
                      >
                        {categories
                          .filter(cat => ['THEMES', 'LECTURE_SUIVIE', 'PRODUCTION_ECRIT', 'EVALUATIONS', 'EVIL_SCIENTIFIQUE', 'EXERCICES'].includes(cat.key))
                          .map((cat) => (
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
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#f8f9fa',
                              borderRadius: 1.5,
                            }
                          }}
                        >
                          {currentThemes.map((theme) => (
                            <MenuItem key={theme.id} value={theme.id}>{theme.title}</MenuItem>
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
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#f8f9fa',
                              borderRadius: 1.5,
                            }
                          }}
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8f9fa',
                        borderRadius: 1.5,
                      }
                    }}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f8f9fa',
                      borderRadius: 1.5,
                    }
                  }}
                />

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<Image />}
                      sx={{
                        borderColor: '#3498db',
                        color: '#3498db',
                        '&:hover': {
                          borderColor: '#2980b9',
                          backgroundColor: 'rgba(52, 152, 219, 0.05)',
                        }
                      }}
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
                      sx={{
                        borderColor: '#3498db',
                        color: '#3498db',
                        '&:hover': {
                          borderColor: '#2980b9',
                          backgroundColor: 'rgba(52, 152, 219, 0.05)',
                        }
                      }}
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
              <Button 
                onClick={() => setOpenDialog(false)}
                sx={{ color: '#7f8c8d' }}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleSubmit} 
                variant="contained"
                sx={{
                  backgroundColor: '#3498db',
                  '&:hover': {
                    backgroundColor: '#2980b9',
                  }
                }}
              >
                {editingContent ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog des messages de contact */}
          <Dialog open={openContactDialog} onClose={() => setOpenContactDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ bgcolor: '#2c3e50', color: 'white' }}>
              <Typography variant="h5">
                Message de contact
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              {selectedMessage && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50' }}>
                    De: {selectedMessage.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: '#7f8c8d' }}>
                    Email: {selectedMessage.email}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: '#7f8c8d' }}>
                    Téléphone: {selectedMessage.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: '#7f8c8d' }}>
                    Date: {new Date(selectedMessage.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50', mt: 3 }}>
                    Message:
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', whiteSpace: 'pre-wrap' }}>
                    {selectedMessage.message}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => deleteMessage(selectedMessage?.id)}
                sx={{ color: '#e74c3c' }}
              >
                Supprimer
              </Button>
              <Button 
                onClick={() => setOpenContactDialog(false)}
                sx={{ color: '#7f8c8d' }}
              >
                Fermer
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog de gestion des comptes élèves */}
          <Dialog open={openStudentsDialog} onClose={() => setOpenStudentsDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ bgcolor: '#2c3e50', color: 'white' }}>
              <Typography variant="h5">
                {editingStudent ? 'Modifier le compte élève' : 'Ajouter un compte élève'}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Box component="form" sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  label="Nom d'utilisateur"
                  value={studentFormData.username}
                  onChange={(e) => setStudentFormData({ ...studentFormData, username: e.target.value })}
                  margin="normal"
                  required
                  id="student-username"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f8f9fa',
                      borderRadius: 1.5,
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label={editingStudent ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"}
                  type="password"
                  value={studentFormData.password}
                  onChange={(e) => setStudentFormData({ ...studentFormData, password: e.target.value })}
                  margin="normal"
                  required={!editingStudent}
                  id="student-password"
                  placeholder={editingStudent ? "Laisser vide pour conserver l'ancien mot de passe" : "Entrez le mot de passe"}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f8f9fa',
                      borderRadius: 1.5,
                    }
                  }}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Niveau</InputLabel>
                  <Select
                    value={studentFormData.level}
                    onChange={(e) => setStudentFormData({ ...studentFormData, level: e.target.value })}
                    id="student-level"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8f9fa',
                        borderRadius: 1.5,
                      }
                    }}
                  >
                    <MenuItem value="CM2">CM2</MenuItem>
                    <MenuItem value="CM1">CM1</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setOpenStudentsDialog(false)}
                sx={{ color: '#7f8c8d' }}
              >
                Annuler
              </Button>
              <Button 
                variant="contained"
                onClick={() => {
                  if (!studentFormData.username || !studentFormData.level) {
                    alert('Veuillez remplir le nom d\'utilisateur et le niveau');
                    return;
                  }
                  
                  // Pour un nouvel élève, le mot de passe est obligatoire
                  if (!editingStudent && !studentFormData.password) {
                    alert('Veuillez entrer un mot de passe pour le nouvel élève');
                    return;
                  }
                  
                  handleStudentSave(studentFormData);
                }}
                sx={{
                  backgroundColor: '#3498db',
                  '&:hover': {
                    backgroundColor: '#2980b9',
                  }
                }}
              >
                {editingStudent ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>

      {/* Boîte de dialogue de confirmation de visibilité */}
      <Dialog 
        open={visibilityConfirmDialog.open} 
        onClose={() => setVisibilityConfirmDialog({ open: false, contentId: null, action: '', contentTitle: '' })}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#3498db', color: 'white' }}>
          <Typography variant="h6">
            Confirmation de visibilité
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ color: '#2c3e50', mb: 2 }}>
            Êtes-vous sûr de vouloir <strong>{visibilityConfirmDialog.action}</strong> le contenu :
          </Typography>
          <Typography variant="h6" sx={{ color: '#3498db', fontWeight: 600 }}>
            "{visibilityConfirmDialog.contentTitle}"
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setVisibilityConfirmDialog({ open: false, contentId: null, action: '', contentTitle: '' })}
            sx={{ color: '#7f8c8d' }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleVisibilityConfirm}
            variant="contained"
            sx={{
              backgroundColor: '#3498db',
              '&:hover': {
                backgroundColor: '#2980b9',
              }
            }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Boîte de dialogue d'affichage du contenu */}
      <Dialog 
        open={contentViewDialog.open} 
        onClose={() => setContentViewDialog({ open: false, content: null })}
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#2c3e50', color: 'white' }}>
          <Typography variant="h5">
            Détails du contenu
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {contentViewDialog.content && (
            <Box>
              {/* Image en grand */}
              {contentViewDialog.content.miniature && (
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <img 
                    src={API_ENDPOINTS.UPLOADS.FILE(contentViewDialog.content.miniature)}
                    alt={contentViewDialog.content.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                </Box>
              )}

              {/* Informations du contenu */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: '#2c3e50', mb: 1, fontWeight: 600 }}>
                    Titre
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', mb: 2 }}>
                    {contentViewDialog.content.title}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: '#2c3e50', mb: 1, fontWeight: 600 }}>
                    Niveau
                  </Typography>
                  <Chip 
                    label={contentViewDialog.content.level} 
                    sx={{ 
                      backgroundColor: contentViewDialog.content.level === 'CM2' ? '#3498db' : '#e67e22',
                      color: 'white',
                      fontWeight: 500
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: '#2c3e50', mb: 1, fontWeight: 600 }}>
                    Catégorie
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', mb: 2 }}>
                    {categories.find(c => c.key === contentViewDialog.content.category)?.label || contentViewDialog.content.category}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: '#2c3e50', mb: 1, fontWeight: 600 }}>
                    Type de contenu
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', mb: 2 }}>
                    {contentViewDialog.content.type}
                  </Typography>
                </Grid>

                {/* Afficher Thème et Sous-catégorie seulement si ce n'est pas ACCUEIL */}
                {contentViewDialog.content.category !== 'HOME' && contentViewDialog.content.theme && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ color: '#2c3e50', mb: 1, fontWeight: 600 }}>
                      Thème
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#7f8c8d', mb: 2 }}>
                      Thème {contentViewDialog.content.theme}
                    </Typography>
                  </Grid>
                )}

                {contentViewDialog.content.category !== 'HOME' && contentViewDialog.content.subcategory && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ color: '#2c3e50', mb: 1, fontWeight: 600 }}>
                      Sous-catégorie
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#7f8c8d', mb: 2 }}>
                      {contentViewDialog.content.subcategory.replace('_', ' ')}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: '#2c3e50', mb: 1, fontWeight: 600 }}>
                    Statut
                  </Typography>
                  <Chip 
                    label={contentViewDialog.content.isVisible ? 'Visible' : 'Masqué'} 
                    color={contentViewDialog.content.isVisible ? 'success' : 'default'}
                    sx={{ fontWeight: 500 }}
                  />
                </Grid>

                {contentViewDialog.content.description && (
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: '#2c3e50', mb: 1, fontWeight: 600 }}>
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#7f8c8d', mb: 2, whiteSpace: 'pre-wrap' }}>
                      {contentViewDialog.content.description}
                    </Typography>
                  </Grid>
                )}

                {/* Fichiers attachés */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: '#2c3e50', mb: 2, fontWeight: 600 }}>
                    Fichiers attachés
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    {contentViewDialog.content.pdfFile && (
                      <>
                        <Chip
                          icon={<PictureAsPdf />}
                          label="Ouvrir PDF"
                          sx={{
                            background: 'rgba(231, 76, 60, 0.1)',
                            color: '#e74c3c',
                            fontWeight: 500,
                            cursor: 'pointer',
                            '&:hover': {
                              background: 'rgba(231, 76, 60, 0.2)',
                            }
                          }}
                          onClick={() => openFileInBrowser(
                            contentViewDialog.content.pdfFile,
                            contentViewDialog.content.pageNumber
                          )}
                        />
                        <Chip
                          icon={<GetApp />}
                          label="Télécharger PDF"
                          sx={{
                            background: 'rgba(52, 152, 219, 0.1)',
                            color: '#3498db',
                            fontWeight: 500,
                            cursor: 'pointer',
                            '&:hover': {
                              background: 'rgba(52, 152, 219, 0.2)',
                            }
                          }}
                          onClick={() => downloadFile(contentViewDialog.content.pdfFile, contentViewDialog.content.title + '.pdf')}
                        />
                      </>
                    )}
                    {contentViewDialog.content.miniature && (
                      <Chip 
                        icon={<Image />} 
                        label="Image" 
                        sx={{ 
                          background: 'rgba(52, 152, 219, 0.1)',
                          color: '#3498db',
                          fontWeight: 500
                        }}
                      />
                    )}
                    {contentViewDialog.content && (
                      <TextField
                        type="number"
                        size="small"
                        label="Page"
                        value={contentViewDialog.content.pageNumber || 1}
                        onChange={(e) => setContentViewDialog({ open: true, content: { ...contentViewDialog.content, pageNumber: parseInt(e.target.value || '1', 10) } })}
                        onBlur={async (e) => {
                          try {
                            const pageNumber = parseInt(e.target.value || '1', 10);
                            await axios.put(API_ENDPOINTS.CONTENT.BY_ID(contentViewDialog.content.id) + '/page', { pageNumber });
                            fetchContents();
                          } catch (err) {
                            console.error('Erreur MAJ pageNumber:', err);
                          }
                        }}
                        inputProps={{ min: 1 }}
                        sx={{ width: 100 }}
                      />
                    )}
                  </Box>
                </Grid>

                {/* Dates */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: '#2c3e50', mb: 1, fontWeight: 600 }}>
                    Date de création
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                    {new Date(contentViewDialog.content.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Grid>

                {contentViewDialog.content.updatedAt && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ color: '#2c3e50', mb: 1, fontWeight: 600 }}>
                      Dernière modification
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                      {new Date(contentViewDialog.content.updatedAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Grid>
                )}

                {contentViewDialog.content.visibilityChangedAt && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ color: '#2c3e50', mb: 1, fontWeight: 600 }}>
                      Visibilité modifiée le
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                      {new Date(contentViewDialog.content.visibilityChangedAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setContentViewDialog({ open: false, content: null })}
            sx={{ color: '#7f8c8d' }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherDashboard;