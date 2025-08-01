const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Utilisateurs prédéfinis (peut être étendu avec une base de données)
const users = {
  prof: {
    username: 'prof',
    password: 'prof123',
    role: 'teacher'
  },
  cm2: {
    username: 'cm2',
    password: 'ecole',
    role: 'student',
    level: 'CM2'
  },
  cm1: {
    username: 'cm1',
    password: 'ecole',
    role: 'student',
    level: 'CM1'
  }
};

// Route de connexion
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Vérifier les identifiants
  const user = Object.values(users).find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Identifiants incorrects' });
  }

  // Créer le token JWT
  const token = jwt.sign(
    { 
      username: user.username, 
      role: user.role,
      level: user.level || null
    },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      username: user.username,
      role: user.role,
      level: user.level || null
    }
  });
});

// Middleware de vérification du token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token invalide' });
  }
};

// Route pour vérifier le token
router.get('/verify', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
