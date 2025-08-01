const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['CM2', 'CE6'],
    required: true
  },
  category: {
    type: String,
    enum: [
      'THEMES',
      'LECTURE_SUIVIE',
      'PRODUCTION_ECRIT',
      'EVALUATIONS',
      'EVIL_SCIENTIFIQUE'
    ],
    required: true
  },
  theme: {
    type: Number,
    min: 1,
    max: 6,
    required: function() {
      return this.category === 'THEMES';
    }
  },
  subcategory: {
    type: String,
    enum: [
      'expression_orale',
      'lecture',
      'vocabulaire_thematique',
      'grammaire',
      'conjugaison',
      'orthographe',
      'vocabulaire',
      'poesie',
      'expression_ecrite',
      'cours_a_ecrire',
      'exercices'
    ]
  },
  type: {
    type: String,
    enum: ['cours_manuel', 'cours_a_ecrire', 'exercice'],
    required: true
  },
  miniature: {
    type: String, // chemin vers l'image
    default: ''
  },
  pdfFile: {
    type: String, // chemin vers le PDF
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  isVisible: {
    type: Boolean,
    default: false // Le prof doit cliquer pour rendre visible aux étudiants
  },
  createdBy: {
    type: String,
    default: 'teacher'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Content', ContentSchema);
