const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Stockage temporaire en mémoire pour les comptes élèves
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
let nextStudentId = 3;

// Fonction pour synchroniser avec auth.js
const syncWithAuth = () => {
  try {
    console.log('Synchronisation avec auth.js...');
    console.log('Données des élèves avant sync:', students.map(s => ({ id: s.id, username: s.username, isActive: s.isActive })));
    
    const authModule = require('./auth');
    if (authModule.syncStudents) {
      authModule.syncStudents(students);
      console.log('Synchronisation réussie avec auth.js');
    } else {
      console.error('Fonction syncStudents non trouvée dans auth.js');
    }
  } catch (error) {
    console.error('Erreur lors de la synchronisation avec auth:', error);
  }
};

// GET - Récupérer tous les comptes élèves
router.get('/', (req, res) => {
  // Ne pas renvoyer les mots de passe
  const studentsWithoutPasswords = students.map(student => ({
    id: student.id,
    username: student.username,
    level: student.level,
    isActive: student.isActive,
    createdAt: student.createdAt,
    updatedAt: student.updatedAt
  }));
  
  res.json(studentsWithoutPasswords);
});

// POST - Créer un nouveau compte élève
router.post('/', async (req, res) => {
  const { username, password, level } = req.body;

  if (!username || !password || !level) {
    return res.status(400).json({ message: 'Nom d\'utilisateur, mot de passe et niveau sont requis' });
  }

  // Vérifier si le nom d'utilisateur existe déjà
  const existingStudent = students.find(s => s.username === username);
  if (existingStudent) {
    return res.status(400).json({ message: 'Ce nom d\'utilisateur existe déjà' });
  }

  try {
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = {
      id: nextStudentId++,
      username,
      password: hashedPassword,
      level,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    students.push(newStudent);
    
    // Synchroniser avec auth.js
    syncWithAuth();
    
    // Renvoyer l'élève sans le mot de passe
    const { password: _, ...studentWithoutPassword } = newStudent;
    res.status(201).json(studentWithoutPassword);
  } catch (error) {
    console.error('Erreur lors du hashage du mot de passe:', error);
    res.status(500).json({ message: 'Erreur lors de la création du compte' });
  }
});

// PUT - Modifier un compte élève
router.put('/:id', async (req, res) => {
  const studentId = parseInt(req.params.id);
  const { username, password, level } = req.body;

  const studentIndex = students.findIndex(s => s.id === studentId);
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Compte élève non trouvé' });
  }

  try {
    const updatedStudent = { ...students[studentIndex] };
    
    if (username) {
      // Vérifier si le nouveau nom d'utilisateur existe déjà (sauf pour le même élève)
      const existingStudent = students.find(s => s.username === username && s.id !== studentId);
      if (existingStudent) {
        return res.status(400).json({ message: 'Ce nom d\'utilisateur existe déjà' });
      }
      updatedStudent.username = username;
    }
    
    // Le mot de passe est optionnel lors de la modification
    if (password && password.trim() !== '') {
      updatedStudent.password = await bcrypt.hash(password, 10);
    }
    
    if (level) {
      updatedStudent.level = level;
    }
    
    updatedStudent.updatedAt = new Date();
    students[studentIndex] = updatedStudent;
    
    // Synchroniser avec auth.js
    syncWithAuth();
    
    // Renvoyer l'élève sans le mot de passe
    const { password: _, ...studentWithoutPassword } = updatedStudent;
    res.json(studentWithoutPassword);
  } catch (error) {
    console.error('Erreur lors de la modification:', error);
    res.status(500).json({ message: 'Erreur lors de la modification du compte' });
  }
});

// PUT - Changer le statut d'un compte élève (actif/inactif)
router.put('/:id/status', (req, res) => {
  const studentId = parseInt(req.params.id);
  const { isActive } = req.body;

  const studentIndex = students.findIndex(s => s.id === studentId);
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Compte élève non trouvé' });
  }

  students[studentIndex].isActive = isActive;
  students[studentIndex].updatedAt = new Date();
  
  // Synchroniser avec auth.js
  syncWithAuth();
  
  // Renvoyer l'élève sans le mot de passe
  const { password: _, ...studentWithoutPassword } = students[studentIndex];
  res.json(studentWithoutPassword);
});

// DELETE - Supprimer un compte élève
router.delete('/:id', (req, res) => {
  const studentId = parseInt(req.params.id);
  const studentIndex = students.findIndex(s => s.id === studentId);
  
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Compte élève non trouvé' });
  }
  
  students.splice(studentIndex, 1);
  
  // Synchroniser avec auth.js
  syncWithAuth();
  
  res.json({ message: 'Compte élève supprimé avec succès' });
});

module.exports = router; 