const express = require('express');
const multer = require('multer');
const path = require('path');
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

// Stockage temporaire en mémoire
let contents = [];
let nextId = 1;

// Fonction pour redimensionner les images (version simplifiée sans sharp)
const resizeImageIfNeeded = async (filePath) => {
  // En mode déploiement, on retourne le chemin original
  // Le redimensionnement sera fait côté client si nécessaire
  console.log('Redimensionnement d\'image désactivé en mode déploiement');
  return filePath;
};

// GET - Récupérer le contenu par niveau et catégorie
router.get('/:level/:category', (req, res) => {
  const { level, category } = req.params;
  const filteredContents = contents.filter(content => 
    content.level === level && content.category === category
  );
  res.json(filteredContents);
});

// GET - Récupérer tout le contenu
router.get('/', (req, res) => {
  res.json(contents);
});

// POST - Créer un nouveau contenu
router.post('/', verifyToken, upload.fields([
  { name: 'miniature', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]), async (req, res) => {
  try {
    let miniaturePath = '';
    let pdfFilePath = '';

    if (req.files?.miniature) {
      miniaturePath = await resizeImageIfNeeded(req.files.miniature[0].path);
    }

    if (req.files?.pdfFile) {
      pdfFilePath = req.files.pdfFile[0].path;
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
    res.status(201).json(newContent);
  } catch (error) {
    console.error('Erreur lors de la création:', error);
    res.status(500).json({ message: 'Erreur lors de la création du contenu' });
  }
});

// PUT - Modifier un contenu
router.put('/:id', verifyToken, upload.fields([
  { name: 'miniature', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]), async (req, res) => {
  const contentId = parseInt(req.params.id);
  const contentIndex = contents.findIndex(c => c.id === contentId);

  if (contentIndex === -1) {
    return res.status(404).json({ message: 'Contenu non trouvé' });
  }

  try {
    let miniaturePath = contents[contentIndex].miniature;
    let pdfFilePath = contents[contentIndex].pdfFile;

    if (req.files?.miniature) {
      miniaturePath = await resizeImageIfNeeded(req.files.miniature[0].path);
    }

    if (req.files?.pdfFile) {
      pdfFilePath = req.files.pdfFile[0].path;
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
    res.json(updatedContent);
  } catch (error) {
    console.error('Erreur lors de la modification:', error);
    res.status(500).json({ message: 'Erreur lors de la modification du contenu' });
  }
});

// PUT - Changer la visibilité
router.put('/:id/visibility', verifyToken, (req, res) => {
  const contentId = parseInt(req.params.id);
  const contentIndex = contents.findIndex(c => c.id === contentId);

  if (contentIndex === -1) {
    return res.status(404).json({ message: 'Contenu non trouvé' });
  }

  contents[contentIndex].isVisible = !contents[contentIndex].isVisible;
  contents[contentIndex].updatedAt = new Date();
  contents[contentIndex].visibilityChangedAt = new Date();
  res.json(contents[contentIndex]);
});

// DELETE - Supprimer un contenu
router.delete('/:id', verifyToken, (req, res) => {
  const contentId = parseInt(req.params.id);
  const contentIndex = contents.findIndex(c => c.id === contentId);

  if (contentIndex === -1) {
    return res.status(404).json({ message: 'Contenu non trouvé' });
  }

  contents.splice(contentIndex, 1);
  res.json({ message: 'Contenu supprimé avec succès' });
});

module.exports = router;
