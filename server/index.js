const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS pour accepter Netlify et autres domaines
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'https://*.netlify.app',
    'https://*.netlify.com',
    'https://classe-numerique.netlify.app',
    'https://classe-numerique.netlify.com',
    // Accepter tous les domaines en développement
    ...(process.env.NODE_ENV !== 'production' ? ['*'] : [])
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configuration multer pour upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
const { router: authRoutes } = require('./routes/auth');
const contentRoutes = require('./routes/content');
const contactRoutes = require('./routes/contact');
const studentsRoutes = require('./routes/students');

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/students', studentsRoutes);

// Route de test
app.get('/api', (req, res) => {
  res.json({ message: 'API École CM2/CM1 fonctionne!' });
});

// Route pour vérifier la santé du serveur
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Route racine pour Fly.io
app.get('/', (req, res) => {
  res.json({ 
    message: 'API École CM2/CM1 - Backend déployé sur Fly.io',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Utilisation du stockage en mémoire pour cette démo
console.log('Utilisation du stockage en mémoire (pas de MongoDB)');
console.log('Mode déploiement : sans redimensionnement d\'images');

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
