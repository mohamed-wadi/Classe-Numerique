const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const teacherStore = require('../utils/teacherStore');
const router = express.Router();

// Utilisateurs prédéfinis (configurables via variables d'environnement)
const teacherUsername = process.env.TEACHER_USERNAME || 'prof';
const teacherPassword = process.env.TEACHER_PASSWORD || 'prof123';

const users = {
  [teacherUsername]: {
    username: teacherUsername,
    password: teacherPassword,
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
    username: 'ce6',
    password: '$2a$10$QXA0rYAmC9QzxkrB8XoCW.k59FB9e7B/ueAXiMmwQzce2Y6bjTo0m', // "ecole" hashé
    level: 'CE6',
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
  const normalizedUsername = (username || '').trim();
  
  console.log(`Tentative de connexion pour l'utilisateur: ${username}`);
  console.log('Corps de la requête:', req.body);

  try {
    // Vérifier d'abord si c'est un professeur
    let teacher = users[normalizedUsername];

    // Écrase avec valeur persistée si disponible
    const persisted = teacherStore.loadTeacher();
    if (persisted && persisted.username === normalizedUsername) {
      const ok = await bcrypt.compare(password, persisted.passwordHash);
      if (ok) {
        console.log(`Connexion réussie (persistée) pour le professeur: ${normalizedUsername}`);
        const token = jwt.sign(
          { username: persisted.username, role: 'teacher' },
          process.env.JWT_SECRET || 'secret_key',
          { expiresIn: '24h' }
        );
        return res.json({ token, user: { username: persisted.username, role: 'teacher' } });
      }
    }

    if (teacher && teacher.password === password) {
      console.log(`Connexion réussie pour le professeur: ${normalizedUsername}`);
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
    const student = students.find(s => s.username === normalizedUsername);
    if (student) {
      console.log(`Élève trouvé: ${normalizedUsername}, actif: ${student.isActive}`);
      // Vérifier si le compte est actif
      if (!student.isActive) {
        console.log(`Compte désactivé pour: ${username}`);
        return res.status(401).json({ 
          message: 'Compte désactivé. Veuillez contacter votre professeur.' 
        });
      }

      // Vérifier le mot de passe
      const isValidPassword = await bcrypt.compare(password, student.password);
      console.log(`Vérification mot de passe pour ${username}: ${isValidPassword}`);
      if (!isValidPassword) {
        console.log(`Mot de passe incorrect pour: ${username}`);
        return res.status(401).json({ message: 'Identifiants incorrects' });
      }

      console.log(`Connexion réussie pour l'élève: ${username}`);
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
    console.log(`Aucun utilisateur trouvé pour: ${username}`);
    return res.status(401).json({ message: 'Identifiants incorrects' });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

// Initier un reset: le client envoie un code (déjà envoyé par email côté client)
router.post('/reset/init', (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ message: 'Code requis' });
  const payload = teacherStore.initReset(code);
  res.json({ success: true, expiresAt: payload.expiresAt });
});

// Appliquer le nouveau mot de passe avec le code
router.post('/reset/confirm', async (req, res) => {
  const { username, code, newPassword } = req.body;
  const normalizedUsername = (username || '').trim();
  if (!normalizedUsername || !code || !newPassword) {
    return res.status(400).json({ message: 'Données manquantes' });
  }
  const current = teacherStore.getReset();
  if (!current || current.code !== code) {
    return res.status(400).json({ message: 'Code invalide ou expiré' });
  }
  await teacherStore.setTeacherCredentials(normalizedUsername, newPassword);
  teacherStore.clearReset();
  res.json({ success: true });
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
