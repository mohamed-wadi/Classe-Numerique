const express = require('express');
const router = express.Router();

// Stockage temporaire en mémoire pour les messages de contact
let contactMessages = [];
let nextMessageId = 1;

// POST - Envoyer un message de contact
router.post('/send', (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Nom, email et message sont requis' });
  }

  const newMessage = {
    id: nextMessageId++,
    name,
    email,
    phone: phone || '',
    message,
    createdAt: new Date(),
    isRead: false
  };

  contactMessages.push(newMessage);
  res.status(201).json({ message: 'Message envoyé avec succès', data: newMessage });
});

// GET - Récupérer tous les messages (pour le professeur)
router.get('/messages', (req, res) => {
  // Trier par date de création (plus récent en premier)
  const sortedMessages = contactMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sortedMessages);
});

// GET - Récupérer un message spécifique
router.get('/messages/:id', (req, res) => {
  const messageId = parseInt(req.params.id);
  const message = contactMessages.find(m => m.id === messageId);
  
  if (!message) {
    return res.status(404).json({ message: 'Message non trouvé' });
  }
  
  res.json(message);
});

// PUT - Marquer un message comme lu
router.put('/messages/:id/read', (req, res) => {
  const messageId = parseInt(req.params.id);
  const messageIndex = contactMessages.findIndex(m => m.id === messageId);
  
  if (messageIndex === -1) {
    return res.status(404).json({ message: 'Message non trouvé' });
  }
  
  contactMessages[messageIndex].isRead = true;
  res.json(contactMessages[messageIndex]);
});

// DELETE - Supprimer un message
router.delete('/messages/:id', (req, res) => {
  const messageId = parseInt(req.params.id);
  const messageIndex = contactMessages.findIndex(m => m.id === messageId);
  
  if (messageIndex === -1) {
    return res.status(404).json({ message: 'Message non trouvé' });
  }
  
  contactMessages.splice(messageIndex, 1);
  res.json({ message: 'Message supprimé avec succès' });
});

module.exports = router; 