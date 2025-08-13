const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Détection automatique de l'environnement local
const isLocalhost = process.env.NODE_ENV !== 'production' || process.env.LOCAL_DEV === 'true';
if (isLocalhost) {
  process.env.NODE_ENV = 'development';
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route spécifique pour les PDF avec affichage inline
app.get('/uploads/*.pdf', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  
  // Vérifier si le fichier existe
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Fichier PDF non trouvé' });
  }
  
  // Lire le fichier
  const fileStream = fs.createReadStream(filePath);
  
  // Définir les headers pour forcer l'affichage inline
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache pour 1 heure
  
  // Envoyer le fichier
  fileStream.pipe(res);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
