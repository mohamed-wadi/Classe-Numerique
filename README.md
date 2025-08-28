# 🏫 École CM2 & CE6 - Plateforme d'Apprentissage

Une plateforme scolaire moderne et interactive pour les niveaux CM2 et CE6, permettant aux professeurs de gérer le contenu éducatif et aux élèves d'accéder aux cours et exercices.

## ✨ Fonctionnalités

### 👨‍🏫 Interface Professeur
- **Gestion complète du contenu** : Ajouter, modifier, supprimer cours et exercices
- **Organisation par niveaux** : CM2 et CE6 avec structure identique
- **Catégories disponibles** :
  - 🏠 HOME
  - 📚 THÈMES (6 thèmes avec sous-catégories)
  - 📖 LECTURE SUIVIE
  - ✍️ PRODUCTION DE L'ÉCRIT
  - 📝 ÉVALUATIONS
  - 🔬 ÉVEIL SCIENTIFIQUE
- **Upload de fichiers** : Miniatures et documents PDF
- **Contrôle de visibilité** : Publier/masquer le contenu pour les élèves

### 👥 Interface Classe (Élèves)
- **Accès par niveau** : Contenu spécifique CM2 ou CE6
- **Navigation intuitive** : Interface adaptée aux enfants
- **Consultation des cours** : Visualisation du contenu publié par le professeur
- **Téléchargement de documents** : Accès aux PDF mis à disposition

## 🔐 Comptes de Connexion

### Professeur
- **Nom d'utilisateur** : `prof`
- **Mot de passe** : `prof123`

### Classes
- **CM2** : nom = `cm2`, mot de passe = `ecole`
- **CE6** : nom = `ce6`, mot de passe = `ecole`

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd ecole-cm2-ce6-platform

# Installer les dépendances
npm run install-all
```

### Démarrage
```bash
# Démarrer le serveur et le client simultanément
npm run dev
```

L'application sera accessible sur :
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000

## 🏗️ Architecture Technique

### Backend (Node.js/Express)
- **API RESTful** avec authentification JWT
- **Upload de fichiers** avec Multer
- **Stockage** : En mémoire (extensible vers MongoDB)
- **Structure modulaire** : Routes séparées pour auth et contenu

### Frontend (React)
- **Material-UI** pour l'interface utilisateur
- **React Router** pour la navigation
- **Axios** pour les appels API
- **Context API** pour la gestion d'état
- **Design responsive** et moderne

## 📁 Structure du Projet

```
ecole-cm2-ce6-platform/
├── server/                 # Backend Node.js
│   ├── models/            # Modèles de données
│   ├── routes/            # Routes API
│   ├── uploads/           # Fichiers uploadés
│   └── index.js           # Point d'entrée serveur
├── client/                # Frontend React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── contexts/      # Contextes (Auth)
│   │   └── App.js         # Composant principal
└── package.json           # Scripts de développement
```

## 🎨 Design et UX

- **Thème éducatif** : Couleurs vertes et oranges
- **Interface intuitive** : Navigation simple pour les enfants
- **Animations fluides** : Transitions et effets visuels
- **Responsive design** : Compatible mobile et tablette
- **Accessibilité** : Contrastes et tailles de police adaptés

## 🔧 Fonctionnalités Avancées

### Gestion du Contenu
- **Types de contenu** : Cours du manuel, Cours à écrire, Exercices
- **Sous-catégories** : Expression orale, Lecture, Grammaire, etc.
- **Métadonnées** : Titre, description, niveau, thème
- **Fichiers multimédias** : Images et PDF

### Sécurité
- **Authentification JWT** : Tokens sécurisés
- **Rôles utilisateurs** : Professeur vs Élèves
- **Validation des uploads** : Types de fichiers autorisés
- **Protection des routes** : Accès contrôlé par rôle

## 🚀 Déploiement

### Développement
```bash
npm run dev
```

### Production
```bash
# Backend
cd server && npm start

# Frontend (build)
cd client && npm run build
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contacter l'équipe de développement

---

**Développé avec ❤️ pour l'éducation des enfants CM2 et CE6**
