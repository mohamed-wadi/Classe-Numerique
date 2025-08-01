const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Utilisateurs prédéfinis (peut être étendu avec une base de données)
const users = {
  prof: {
    username: 'prof',
    password: 'prof123',
    role: 'teacher'
  }
};

// Stockage temporaire en mémoire pour les comptes élèves (synchronisé avec students.js)
let students = [
  {
    id: 1,
    username: 'cm2',
    password: '$2a$10$QXA0rYAmC9QzxkrB8XoCW.k59FB9e7B/ueAXiMmwQzce2Y6bjTo0m', // "ecole" hashé
    level: 'CM2',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    username: 'cm1',
    password: '$2a$10$QXA0rYAmC9QzxkrB8XoCW.k59FB9e7B/ueAXiMmwQzce2Y6bjTo0m', // "ecole" hashé
    level: 'CM1',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Fonction pour synchroniser les données des élèves
const syncStudents = (newStudents) => {
  console.log('Synchronisation des données élèves dans auth.js...');
  console.log('Anciennes données:', students.map(s => ({ id: s.id, username: s.username, isActive: s.isActive })));
  console.log('Nouvelles données:', newStudents.map(s => ({ id: s.id, username: s.username, isActive: s.isActive })));
  
  students = newStudents;
  
  console.log('Synchronisation terminée dans auth.js');
};

// Route de connexion
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifier d'abord si c'est un professeur
    const teacher = users[username];
    if (teacher && teacher.password === password) {
      const token = jwt.sign(
        { 
          username: teacher.username, 
          role: teacher.role
        },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          username: teacher.username,
          role: teacher.role
        }
      });
    }

    // Vérifier si c'est un élève
    const student = students.find(s => s.username === username);
    if (student) {
      // Vérifier si le compte est actif
      if (!student.isActive) {
        return res.status(401).json({ 
          message: 'Compte désactivé. Veuillez contacter votre professeur.' 
        });
      }

      // Vérifier le mot de passe
      const isValidPassword = await bcrypt.compare(password, student.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Identifiants incorrects' });
      }

      const token = jwt.sign(
        { 
          username: student.username, 
          role: 'student',
          level: student.level
        },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          username: student.username,
          role: 'student',
          level: student.level
        }
      });
    }

    // Si aucun utilisateur trouvé
    return res.status(401).json({ message: 'Identifiants incorrects' });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
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

module.exports = { router, syncStudents };
