const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API École CM2/CE6 fonctionne!' });
});

// Utilisation du stockage en mémoire pour cette démo
console.log('Utilisation du stockage en mémoire (pas de MongoDB)');

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
