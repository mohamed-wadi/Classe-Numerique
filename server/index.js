const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Détection automatique de l'environnement
// Sur Fly.io, NODE_ENV n'est pas défini par défaut, donc on le force à 'production'
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

// Forcer en développement seulement si LOCAL_DEV est explicitement défini
if (process.env.LOCAL_DEV === 'true') {
  process.env.NODE_ENV = 'development';
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());

// Route spécifique pour tous les fichiers uploads avec logs de débogage
app.get('/uploads/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  console.log(`🔍 Demande de fichier: ${filename}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV}`);
  
  // Utiliser le bon chemin pour les uploads selon l'environnement
  const uploadsBasePath = process.env.NODE_ENV === 'production'
    ? '/app/data/uploads'
    : path.join(__dirname, 'uploads');
    
  const filePath = path.join(uploadsBasePath, filename);
  console.log(`📁 Chemin du fichier: ${filePath}`);
  
  // Vérifier si le fichier existe
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Fichier non trouvé: ${filePath}`);
    
    // Essayer de trouver des fichiers similaires (pour les problèmes d'encodage)
    try {
      const files = fs.readdirSync(uploadsBasePath);
      console.log(`📂 Fichiers disponibles dans ${uploadsBasePath}:`, files);
      
      // Chercher des fichiers avec des noms similaires
      const similarFiles = files.filter(file => {
        const baseRequested = filename.replace(/^\d+-/, '');
        const baseFile = file.replace(/^\d+-/, '');
        return baseFile.includes(baseRequested.split('.')[0]) || baseRequested.includes(baseFile.split('.')[0]);
      });
      
      if (similarFiles.length > 0) {
        console.log(`🔍 Fichiers similaires trouvés:`, similarFiles);
        // Essayer le premier fichier similaire
        const similarFilePath = path.join(uploadsBasePath, similarFiles[0]);
        if (fs.existsSync(similarFilePath)) {
          console.log(`✅ Utilisation du fichier similaire: ${similarFiles[0]}`);
          return serveFile(similarFilePath, similarFiles[0], res);
        }
      }
    } catch (error) {
      console.log(`❌ Impossible de lire le dossier ${uploadsBasePath}:`, error.message);
    }
    
    return res.status(404).json({
      message: 'Fichier non trouvé',
      requestedFile: filename,
      searchPath: filePath,
      uploadsPath: uploadsBasePath
    });
  }
  
  console.log(`✅ Fichier trouvé: ${filePath}`);
  return serveFile(filePath, filename, res);
});

// Fonction helper pour servir les fichiers
function serveFile(filePath, filename, res) {
  // Déterminer le type de contenu
  const ext = path.extname(filename).toLowerCase();
  let contentType = 'application/octet-stream';
  let disposition = 'attachment';
  
  if (ext === '.pdf') {
    contentType = 'application/pdf';
    disposition = 'inline';
  } else if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
    contentType = `image/${ext.substring(1)}`;
    disposition = 'inline';
  } else if (['.mp3', '.mpeg'].includes(ext)) {
    contentType = 'audio/mpeg';
    disposition = 'inline';
  } else if (ext === '.wav') {
    contentType = 'audio/wav';
    disposition = 'inline';
  } else if (ext === '.ogg') {
    contentType = 'audio/ogg';
    disposition = 'inline';
  } else if (ext === '.webm') {
    // Could be audio or video; default to video for browser playback
    contentType = 'video/webm';
    disposition = 'inline';
  } else if (ext === '.mp4') {
    contentType = 'video/mp4';
    disposition = 'inline';
  }
  
  // Lire le fichier
  const fileStream = fs.createReadStream(filePath);
  
  // Définir les headers avec support UTF-8
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `${disposition}; filename*=UTF-8''${encodeURIComponent(filename)}`);
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Gérer les erreurs de lecture
  fileStream.on('error', (error) => {
    console.log(`❌ Erreur de lecture du fichier: ${error.message}`);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Erreur de lecture du fichier' });
    }
  });
  
  // Envoyer le fichier
  fileStream.pipe(res);
}

// Servir les fichiers statiques depuis le dossier uploads (local et production)
const uploadsPath = process.env.NODE_ENV === 'production'
  ? '/app/data/uploads'
  : path.join(__dirname, 'uploads');
  
// Créer le dossier s'il n'existe pas
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log(`📁 Dossier d'uploads créé: ${uploadsPath}`);
}

app.use('/uploads', express.static(uploadsPath));

// Route de débogage pour lister les fichiers uploads
app.get('/debug/uploads', (req, res) => {
  const uploadsBasePath = process.env.NODE_ENV === 'production'
    ? '/app/data/uploads'
    : path.join(__dirname, 'uploads');
  
  try {
    const files = fs.readdirSync(uploadsBasePath);
    res.json({
      uploadsPath: uploadsBasePath,
      environment: process.env.NODE_ENV,
      filesCount: files.length,
      files: files.map(file => ({
        name: file,
        fullPath: path.join(uploadsBasePath, file),
        stats: fs.statSync(path.join(uploadsBasePath, file))
      }))
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      uploadsPath: uploadsBasePath,
      environment: process.env.NODE_ENV
    });
  }
});

// Route de migration des fichiers (à utiliser une seule fois après déploiement)
app.post('/migrate/uploads', (req, res) => {
  const oldUploadsPath = '/app/uploads';
  const newUploadsPath = '/app/data/uploads';
  
  try {
    // Créer le nouveau dossier s'il n'existe pas
    if (!fs.existsSync(newUploadsPath)) {
      fs.mkdirSync(newUploadsPath, { recursive: true });
    }
    
    // Lister les fichiers dans l'ancien dossier
    const files = fs.readdirSync(oldUploadsPath);
    let migratedCount = 0;
    let errors = [];
    
    for (const file of files) {
      if (file === '.gitkeep') continue;
      
      const oldPath = path.join(oldUploadsPath, file);
      const newPath = path.join(newUploadsPath, file);
      
      try {
        // Copier le fichier (ne pas déplacer pour éviter les erreurs)
        fs.copyFileSync(oldPath, newPath);
        migratedCount++;
        console.log(`✅ Fichier migré: ${file}`);
      } catch (error) {
        errors.push({ file, error: error.message });
        console.log(`❌ Erreur migration ${file}: ${error.message}`);
      }
    }
    
    res.json({
      success: true,
      message: 'Migration terminée',
      migratedCount,
      totalFiles: files.length - 1, // -1 pour .gitkeep
      errors,
      oldPath: oldUploadsPath,
      newPath: newUploadsPath
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      oldPath: oldUploadsPath,
      newPath: newUploadsPath
    });
  }
});

// Route de santé pour Fly.io
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
    volumePath: '/app/data'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth').router);
app.use('/api/content', require('./routes/content'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/students', require('./routes/students'));

// Route racine
app.get('/', (req, res) => {
  res.json({ 
    message: 'API École CM2 & CM1', 
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route non trouvée',
    path: req.originalUrl,
    method: req.method
  });
});

// Gestion globale des erreurs
app.use((error, req, res, next) => {
  console.error('❌ Erreur globale:', error);
  res.status(500).json({ 
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Volume persistant: /app/data`);
});
