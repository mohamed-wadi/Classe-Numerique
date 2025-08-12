const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Middleware de vérification du token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token invalide' });
  }
};

// Configuration multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Stockage avec persistance locale
let contents = [];
let nextId = 1;

// Chemin du fichier de persistance - Utiliser le volume Fly.io en production
const DATA_FILE = process.env.NODE_ENV === 'production' 
  ? '/app/data/contents.json'
  : path.join(__dirname, '../data/contents.json');

// Fonction pour charger les données depuis le fichier
const loadContents = () => {
  try {
    // Créer le dossier data s'il n'existe pas
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log(`📁 Dossier créé: ${dataDir}`);
    }
    
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(data);
      contents = parsed.contents || [];
      nextId = parsed.nextId || 1;
      console.log(`✅ Contenus chargés depuis le stockage persistant: ${contents.length} éléments`);
      console.log(`💾 Fichier de données: ${DATA_FILE}`);
    } else {
      console.log('📝 Aucun fichier de contenus trouvé, création d\'un nouveau fichier');
      // Créer un fichier initial vide
      saveContents();
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement des contenus:', error);
    console.log('🔄 Utilisation du stockage en mémoire par défaut');
  }
};

// Fonction pour sauvegarder les données
const saveContents = () => {
  try {
    const data = {
      contents,
      nextId,
      lastUpdated: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      serverId: process.env.FLY_ALLOC_ID || 'local'
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log(`💾 Contenus sauvegardés avec succès dans: ${DATA_FILE}`);
    console.log(`📊 ${contents.length} contenus sauvegardés`);
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde des contenus:', error);
    console.error(`💾 Chemin du fichier: ${DATA_FILE}`);
  }
};

// Charger les données au démarrage
loadContents();

// Fonction pour redimensionner les images (version simplifiée sans sharp)
const resizeImageIfNeeded = async (filePath) => {
  // En mode déploiement, on retourne le chemin original
  // Le redimensionnement sera fait côté client si nécessaire
  console.log('🖼️  Redimensionnement d\'image désactivé en mode déploiement');
  return filePath;
};

// GET - Récupération des contenus par niveau et catégorie
router.get('/:level/:category', (req, res) => {
  try {
    const { level, category } = req.params;
    console.log(`📚 Récupération des contenus pour ${level}/${category}`);
    
    const filteredContents = contents.filter(content => 
      content.level === level && content.category === category
    );
    
    console.log(`✅ ${filteredContents.length} contenus trouvés pour ${level}/${category}`);
    res.json(filteredContents);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des contenus:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des contenus' });
  }
});

// GET - Récupération de tout le contenu
router.get('/', (req, res) => {
  try {
    console.log(`📚 Récupération de tous les contenus (${contents.length} éléments)`);
    res.json(contents);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de tous les contenus:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des contenus' });
  }
});

// POST - Création d'un nouveau contenu
router.post('/', verifyToken, upload.fields([
  { name: 'miniature', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('🆕 Création d\'un nouveau contenu...');
    console.log('📝 Données reçues:', req.body);
    console.log('📁 Fichiers reçus:', req.files);
    
    let miniaturePath = '';
    let pdfFilePath = '';

    if (req.files?.miniature) {
      miniaturePath = await resizeImageIfNeeded(req.files.miniature[0].path);
      console.log('🖼️  Miniature traitée:', miniaturePath);
    }

    if (req.files?.pdfFile) {
      pdfFilePath = req.files.pdfFile[0].path;
      console.log('📄 PDF traité:', pdfFilePath);
    }

    const newContent = {
      id: nextId++,
      title: req.body.title,
      level: req.body.level,
      category: req.body.category,
      theme: req.body.theme ? parseInt(req.body.theme) : null,
      subcategory: req.body.subcategory || '',
      type: req.body.type,
      description: req.body.description || '',
      miniature: miniaturePath,
      pdfFile: pdfFilePath,
      isVisible: false,
      createdBy: req.user.username,
      createdAt: new Date(),
      updatedAt: new Date(),
      visibilityChangedAt: new Date()
    };

    contents.push(newContent);
    
    // Sauvegarder immédiatement
    saveContents();
    
    console.log('✅ Nouveau contenu créé:', {
      id: newContent.id,
      title: newContent.title,
      level: newContent.level,
      category: newContent.category,
      miniature: newContent.miniature
    });
    
    res.status(201).json(newContent);
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error);
    res.status(500).json({ message: 'Erreur lors de la création du contenu' });
  }
});

// PUT - Modification d'un contenu
router.put('/:id', verifyToken, upload.fields([
  { name: 'miniature', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const contentId = parseInt(req.params.id);
    console.log(`✏️  Modification du contenu ${contentId}...`);
    
    const contentIndex = contents.findIndex(c => c.id === contentId);

    if (contentIndex === -1) {
      console.log(`❌ Contenu ${contentId} non trouvé`);
      return res.status(404).json({ message: 'Contenu non trouvé' });
    }

    let miniaturePath = contents[contentIndex].miniature;
    let pdfFilePath = contents[contentIndex].pdfFile;

    if (req.files?.miniature) {
      miniaturePath = await resizeImageIfNeeded(req.files.miniature[0].path);
      console.log('🖼️  Nouvelle miniature:', miniaturePath);
    }

    if (req.files?.pdfFile) {
      pdfFilePath = req.files.pdfFile[0].path;
      console.log('📄 Nouveau PDF:', pdfFilePath);
    }

    const updatedContent = {
      ...contents[contentIndex],
      title: req.body.title || contents[contentIndex].title,
      level: req.body.level || contents[contentIndex].level,
      category: req.body.category || contents[contentIndex].category,
      theme: req.body.theme ? parseInt(req.body.theme) : contents[contentIndex].theme,
      subcategory: req.body.subcategory || contents[contentIndex].subcategory,
      type: req.body.type || contents[contentIndex].type,
      description: req.body.description || contents[contentIndex].description,
      miniature: miniaturePath,
      pdfFile: pdfFilePath,
      updatedAt: new Date()
    };

    contents[contentIndex] = updatedContent;
    
    // Sauvegarder immédiatement
    saveContents();
    
    console.log('✅ Contenu modifié:', {
      id: updatedContent.id,
      title: updatedContent.title,
      miniature: updatedContent.miniature
    });
    
    res.json(updatedContent);
  } catch (error) {
    console.error('❌ Erreur lors de la modification:', error);
    res.status(500).json({ message: 'Erreur lors de la modification du contenu' });
  }
});

// PUT - Changement de visibilité
router.put('/:id/visibility', verifyToken, (req, res) => {
  try {
    const contentId = parseInt(req.params.id);
    console.log(`👁️  Changement de visibilité pour le contenu ${contentId}...`);
    
    const contentIndex = contents.findIndex(c => c.id === contentId);

    if (contentIndex === -1) {
      console.log(`❌ Contenu ${contentId} non trouvé`);
      return res.status(404).json({ message: 'Contenu non trouvé' });
    }

    contents[contentIndex].isVisible = !contents[contentIndex].isVisible;
    contents[contentIndex].updatedAt = new Date();
    contents[contentIndex].visibilityChangedAt = new Date();
    
    // Sauvegarder immédiatement
    saveContents();
    
    console.log(`✅ Visibilité changée pour le contenu ${contentId}: ${contents[contentIndex].isVisible ? 'Visible' : 'Masqué'}`);
    
    res.json(contents[contentIndex]);
  } catch (error) {
    console.error('❌ Erreur lors du changement de visibilité:', error);
    res.status(500).json({ message: 'Erreur lors du changement de visibilité' });
  }
});

// DELETE - Suppression d'un contenu
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const contentId = parseInt(req.params.id);
    console.log(`🗑️  Suppression du contenu ${contentId}...`);
    
    const contentIndex = contents.findIndex(c => c.id === contentId);

    if (contentIndex === -1) {
      console.log(`❌ Contenu ${contentId} non trouvé`);
      return res.status(404).json({ message: 'Contenu non trouvé' });
    }

    contents.splice(contentIndex, 1);
    
    // Sauvegarder immédiatement
    saveContents();
    
    console.log(`✅ Contenu ${contentId} supprimé avec succès`);
    
    res.json({ message: 'Contenu supprimé avec succès' });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du contenu' });
  }
});

module.exports = router;
