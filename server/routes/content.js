const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configuration multer pour upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Accepter les images et PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté'), false);
    }
  }
});

// Middleware de vérification du token
const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token invalide' });
  }
};

// Stockage temporaire en mémoire (remplacer par MongoDB en production)
let contents = [];
let nextId = 1;

// GET - Récupérer tout le contenu (pour prof) ou contenu visible (pour étudiants)
router.get('/', verifyToken, (req, res) => {
  let filteredContent = contents;

  if (req.user.role === 'student') {
    // Les étudiants ne voient que le contenu visible de leur niveau
    filteredContent = contents.filter(
      content => content.isVisible && content.level === req.user.level
    );
  }

  res.json(filteredContent);
});

// GET - Récupérer contenu par niveau et catégorie
router.get('/:level/:category', verifyToken, (req, res) => {
  const { level, category } = req.params;
  let filteredContent = contents.filter(
    content => content.level === level && content.category === category
  );

  if (req.user.role === 'student') {
    filteredContent = filteredContent.filter(content => content.isVisible);
  }

  res.json(filteredContent);
});

// POST - Ajouter nouveau contenu (professeur seulement)
router.post('/', verifyToken, upload.fields([
  { name: 'miniature', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]), (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Accès refusé. Professeur requis.' });
  }

  const {
    title,
    level,
    category,
    theme,
    subcategory,
    type,
    description
  } = req.body;

  const newContent = {
    id: nextId++,
    title,
    level,
    category,
    theme: theme ? parseInt(theme) : null,
    subcategory,
    type,
    description: description || '',
    miniature: req.files?.miniature ? req.files.miniature[0].path : '',
    pdfFile: req.files?.pdfFile ? req.files.pdfFile[0].path : '',
    isVisible: false,
    createdBy: req.user.username,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  contents.push(newContent);
  res.status(201).json(newContent);
});

// PUT - Modifier contenu (professeur seulement)
router.put('/:id', verifyToken, upload.fields([
  { name: 'miniature', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]), (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Accès refusé. Professeur requis.' });
  }

  const contentId = parseInt(req.params.id);
  const contentIndex = contents.findIndex(c => c.id === contentId);

  if (contentIndex === -1) {
    return res.status(404).json({ message: 'Contenu non trouvé' });
  }

  const updatedContent = {
    ...contents[contentIndex],
    ...req.body,
    updatedAt: new Date()
  };

  if (req.files?.miniature) {
    updatedContent.miniature = req.files.miniature[0].path;
  }
  if (req.files?.pdfFile) {
    updatedContent.pdfFile = req.files.pdfFile[0].path;
  }

  contents[contentIndex] = updatedContent;
  res.json(updatedContent);
});

// PUT - Basculer la visibilité du contenu (professeur seulement)
router.put('/:id/visibility', verifyToken, (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Accès refusé. Professeur requis.' });
  }

  const contentId = parseInt(req.params.id);
  const contentIndex = contents.findIndex(c => c.id === contentId);

  if (contentIndex === -1) {
    return res.status(404).json({ message: 'Contenu non trouvé' });
  }

  contents[contentIndex].isVisible = !contents[contentIndex].isVisible;
  contents[contentIndex].updatedAt = new Date();

  res.json(contents[contentIndex]);
});

// DELETE - Supprimer contenu (professeur seulement)
router.delete('/:id', verifyToken, (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Accès refusé. Professeur requis.' });
  }

  const contentId = parseInt(req.params.id);
  const contentIndex = contents.findIndex(c => c.id === contentId);

  if (contentIndex === -1) {
    return res.status(404).json({ message: 'Contenu non trouvé' });
  }

  // Supprimer les fichiers associés
  const content = contents[contentIndex];
  if (content.miniature && fs.existsSync(content.miniature)) {
    fs.unlinkSync(content.miniature);
  }
  if (content.pdfFile && fs.existsSync(content.pdfFile)) {
    fs.unlinkSync(content.pdfFile);
  }

  contents.splice(contentIndex, 1);
  res.json({ message: 'Contenu supprimé avec succès' });
});

module.exports = router;
