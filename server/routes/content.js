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
    // Utiliser le volume persistant pour les uploads en production
    const uploadDir = process.env.NODE_ENV === 'production'
      ? '/app/data/uploads'
      : 'uploads/';
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      console.log(`Attempting to create upload directory: ${uploadDir}`); // Added log
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`📁 Dossier d'uploads créé: ${uploadDir}`);
      } catch (mkdirError) {
        console.error(`❌ Erreur lors de la création du dossier d'uploads ${uploadDir}:`, mkdirError);
        return cb(mkdirError); // Pass the error to multer
      }
    } else {
      console.log(`📁 Dossier d'uploads existe déjà: ${uploadDir}`); // Added log
    }
    
    console.log(`📤 Multer destination set to: ${uploadDir}`); // Added log
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Properly encode the filename to handle special characters
    const sanitizedName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const timestamp = Date.now();
    const filename = `${timestamp}-${sanitizedName}`;
    console.log(`📝 Original filename: ${file.originalname}`);
    console.log(`📝 Sanitized filename: ${sanitizedName}`);
    console.log(`📝 Final filename: ${filename}`);
    cb(null, filename);
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
    
    // Attendre un peu que le volume persistant soit prêt en production
    if (process.env.NODE_ENV === 'production') {
      console.log('🌐 Mode production détecté, attente du volume persistant...');
      // Attendre 2 secondes pour que le volume soit complètement monté
      setTimeout(() => {
        tryLoadContents();
      }, 2000);
      return;
    }
    
    tryLoadContents();
  } catch (error) {
    console.error('❌ Erreur lors du chargement des contenus:', error);
    console.log('🔄 Utilisation du stockage en mémoire par défaut');
  }
};

// Fonction séparée pour essayer de charger les contenus
const tryLoadContents = () => {
  try {
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

// Fonction pour redimensionner les images (version simplifiée sans sharp)
const resizeImageIfNeeded = async (filePath) => {
  // En mode déploiement, on retourne le chemin original
  // Le redimensionnement sera fait côté client si nécessaire
  console.log('🖼️  Redimensionnement d\'image désactivé en mode déploiement');
  return filePath;
};

// Charger les données au démarrage
loadContents();

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
  { name: 'pdfFile', maxCount: 1 },
  { name: 'audioFile', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('🆕 Création d\'un nouveau contenu...');
    console.log('📝 Données reçues:', req.body);
    console.log('📁 Fichiers reçus:', req.files);
    console.log('🌍 Environnement:', process.env.NODE_ENV);
    
    let miniaturePath = '';
    let pdfFilePath = '';
    let audioFilePath = '';

    if (req.files?.miniature) {
      miniaturePath = await resizeImageIfNeeded(req.files.miniature[0].path);
      console.log('🖼️  Miniature traitée:', miniaturePath);
      console.log('🖼️  Miniature existe?', fs.existsSync(miniaturePath));
    }

    if (req.files?.pdfFile) {
      pdfFilePath = req.files.pdfFile[0].path;
      console.log('📄 PDF traité:', pdfFilePath);
      console.log('📄 PDF existe?', fs.existsSync(pdfFilePath));
    }

    if (req.files?.audioFile) {
      audioFilePath = req.files.audioFile[0].path;
      console.log('🔊 Audio traité:', audioFilePath);
      console.log('🔊 Audio existe?', fs.existsSync(audioFilePath));
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
      audioFile: audioFilePath,
      pageNumber: req.body.pageNumber ? parseInt(req.body.pageNumber) : 1,
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
  { name: 'pdfFile', maxCount: 1 },
  { name: 'audioFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const contentId = parseInt(req.params.id);
    const contentIndex = contents.findIndex(c => c.id === contentId);
    
    if (contentIndex === -1) {
      return res.status(404).json({ message: 'Contenu non trouvé' });
    }
    
    console.log(`✏️ Modification du contenu ${contentId}...`);
    console.log('📝 Données reçues:', req.body);
    console.log('📁 Fichiers reçus:', req.files);
    
    const existingContent = contents[contentIndex];
    let miniaturePath = existingContent.miniature;
    let pdfFilePath = existingContent.pdfFile;
    let audioFilePath = existingContent.audioFile || '';
    
    if (req.files?.miniature) {
      // Supprimer l'ancienne miniature si elle existe
      if (existingContent.miniature && fs.existsSync(existingContent.miniature)) {
        try {
          fs.unlinkSync(existingContent.miniature);
          console.log(`🗑️ Ancienne miniature supprimée: ${existingContent.miniature}`);
        } catch (err) {
          console.error(`❌ Erreur lors de la suppression de l'ancienne miniature: ${err.message}`);
        }
      }
      
      miniaturePath = await resizeImageIfNeeded(req.files.miniature[0].path);
      console.log('🖼️ Nouvelle miniature traitée:', miniaturePath);
    }
    
    if (req.files?.pdfFile) {
      // Supprimer l'ancien PDF s'il existe
      if (existingContent.pdfFile && fs.existsSync(existingContent.pdfFile)) {
        try {
          fs.unlinkSync(existingContent.pdfFile);
          console.log(`🗑️ Ancien PDF supprimé: ${existingContent.pdfFile}`);
        } catch (err) {
          console.error(`❌ Erreur lors de la suppression de l'ancien PDF: ${err.message}`);
        }
      }
      
      pdfFilePath = req.files.pdfFile[0].path;
      console.log('📄 Nouveau PDF traité:', pdfFilePath);
    }

    if (req.files?.audioFile) {
      // Supprimer l'ancien fichier audio s'il existe
      if (existingContent.audioFile && fs.existsSync(existingContent.audioFile)) {
        try {
          fs.unlinkSync(existingContent.audioFile);
          console.log(`🗑️ Ancien fichier audio supprimé: ${existingContent.audioFile}`);
        } catch (err) {
          console.error(`❌ Erreur lors de la suppression de l'ancien fichier audio: ${err.message}`);
        }
      }
      
      audioFilePath = req.files.audioFile[0].path;
      console.log('🔊 Nouveau fichier audio traité:', audioFilePath);
    }
    
    // Mettre à jour le contenu
    contents[contentIndex] = {
      ...existingContent,
      title: req.body.title,
      level: req.body.level,
      category: req.body.category,
      theme: req.body.theme ? parseInt(req.body.theme) : null,
      subcategory: req.body.subcategory || '',
      type: req.body.type,
      description: req.body.description || '',
      miniature: miniaturePath,
      pdfFile: pdfFilePath,
      audioFile: audioFilePath,
      updatedAt: new Date()
    };
    
    // Sauvegarder immédiatement
    saveContents();
    
    console.log('✅ Contenu modifié avec succès');
    res.json(contents[contentIndex]);
  } catch (error) {
    console.error('❌ Erreur lors de la modification du contenu:', error);
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

// PUT - Mise à jour uniquement du numéro de page (JSON, sans multipart)
router.put('/:id/page', verifyToken, (req, res) => {
  try {
    const contentId = parseInt(req.params.id);
    const { pageNumber } = req.body || {};
    const contentIndex = contents.findIndex(c => c.id === contentId);
    if (contentIndex === -1) {
      return res.status(404).json({ message: 'Contenu non trouvé' });
    }
    const page = Number.parseInt(pageNumber, 10);
    if (!Number.isFinite(page) || page < 1) {
      return res.status(400).json({ message: 'Numéro de page invalide' });
    }
    contents[contentIndex].pageNumber = page;
    contents[contentIndex].updatedAt = new Date();
    saveContents();
    res.json({ success: true, id: contentId, pageNumber: contents[contentIndex].pageNumber });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du numéro de page:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du numéro de page' });
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

// MAINTENANCE - Purge des contenus CE6 pour les thèmes 1 à 7 (catégorie THEMES)
// Protégé: nécessite un token et le rôle teacher
router.delete('/maintenance/purge/ce6-themes', verifyToken, (req, res) => {
  try {
    if (!req.user || req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Accès interdit' });
    }

    const beforeCount = contents.length;
    contents = contents.filter((c) => {
      const isCE6 = c.level === 'CE6';
      const isThemes = c.category === 'THEMES';
      const isThemeInRange = Number(c.theme) >= 1 && Number(c.theme) <= 7;
      return !(isCE6 && isThemes && isThemeInRange);
    });

    const removed = beforeCount - contents.length;
    saveContents();
    return res.json({ success: true, removed });
  } catch (error) {
    console.error('❌ Erreur purge CE6:', error);
    return res.status(500).json({ message: 'Erreur lors de la purge CE6' });
  }
});

// MAINTENANCE - Normaliser les thèmes CE6 (7–12 -> 1–6) pour la catégorie THEMES
router.post('/maintenance/normalize/ce6-themes', verifyToken, (req, res) => {
  try {
    if (!req.user || req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Accès interdit' });
    }

    let normalized = 0;
    contents = contents.map((c) => {
      if (c.level === 'CE6' && c.category === 'THEMES' && Number(c.theme) >= 7 && Number(c.theme) <= 12) {
        normalized += 1;
        return { ...c, theme: Number(c.theme) - 6 };
      }
      return c;
    });

    saveContents();
    return res.json({ success: true, normalized });
  } catch (error) {
    console.error('❌ Erreur normalisation CE6:', error);
    return res.status(500).json({ message: 'Erreur lors de la normalisation CE6' });
  }
});

module.exports = router;
