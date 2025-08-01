# 🚀 Guide de Déploiement - École CM2/CM1

## 📋 Vue d'ensemble
Ce projet utilise :
- **Backend** : Node.js/Express avec stockage en mémoire (pas de base de données)
- **Frontend** : React avec Material-UI
- **Déploiement** : Railway (backend) + Netlify (frontend)

---

## 🔧 ÉTAPE 1 : Déployer le Backend sur Railway

### 1.1 Préparer le repository
```bash
# Créer un repository séparé pour le backend
mkdir ecole-backend
cd ecole-backend
# Copier le dossier server/ dans ce nouveau repository
```

### 1.2 Déployer sur Railway
1. Aller sur [Railway.app](https://railway.app)
2. Se connecter avec GitHub
3. Cliquer sur "New Project" → "Deploy from GitHub repo"
4. Sélectionner le repository backend
5. Railway détectera automatiquement Node.js

### 1.3 Variables d'environnement Railway
Dans les paramètres du projet Railway, ajouter :
```
JWT_SECRET=votre_secret_jwt_tres_securise
FRONTEND_URL=https://votre-app.netlify.app
NODE_ENV=production
```

### 1.4 Obtenir l'URL du backend
- Railway générera une URL comme : `https://votre-app.railway.app`
- Notez cette URL pour l'étape suivante

---

## 🌐 ÉTAPE 2 : Déployer le Frontend sur Netlify

### 2.1 Préparer le repository frontend
```bash
# Créer un repository séparé pour le frontend
mkdir ecole-frontend
cd ecole-frontend
# Copier le dossier client/ dans ce nouveau repository
```

### 2.2 Variables d'environnement
Créer un fichier `.env` dans le dossier client :
```
REACT_APP_API_URL=https://votre-app.railway.app
```

### 2.3 Déployer sur Netlify
1. Aller sur [Netlify.com](https://netlify.com)
2. Se connecter avec GitHub
3. Cliquer sur "New site from Git"
4. Sélectionner le repository frontend
5. Configuration automatique :
   - Build command : `npm run build`
   - Publish directory : `build`

### 2.4 Variables d'environnement Netlify
Dans les paramètres du site Netlify :
- Aller dans "Site settings" → "Environment variables"
- Ajouter : `REACT_APP_API_URL` = `https://votre-app.railway.app`

---

## 🔗 ÉTAPE 3 : Connecter Frontend et Backend

### 3.1 Mettre à jour l'URL du backend
Dans Railway, mettre à jour la variable :
```
FRONTEND_URL=https://votre-app.netlify.app
```

### 3.2 Redéployer
- Railway et Netlify redéploieront automatiquement
- Les deux services sont maintenant connectés

---

## 📁 Structure des Repositories

### Repository Backend (Railway)
```
ecole-backend/
├── index.js
├── package.json
├── railway.json
├── routes/
├── utils/
└── uploads/
```

### Repository Frontend (Netlify)
```
ecole-frontend/
├── public/
├── src/
├── package.json
├── netlify.toml
└── .env
```

---

## 🔍 Test du Déploiement

### Backend
- Test de santé : `https://votre-app.railway.app/health`
- API test : `https://votre-app.railway.app/api`

### Frontend
- Site principal : `https://votre-app.netlify.app`
- Login test :
  - Prof : `prof` / `prof123`
  - Élève : `cm2` / `ecole`

---

## ⚠️ Limitations du Stockage en Mémoire

**Important** : Le projet utilise actuellement du stockage en mémoire, ce qui signifie :
- Les données sont perdues à chaque redémarrage du serveur
- Pas de persistance des contenus, messages, comptes élèves
- Idéal pour les démonstrations, pas pour la production

### Pour la Production
Considérer l'ajout d'une base de données :
- MongoDB Atlas (gratuit)
- PostgreSQL sur Railway
- SQLite pour les petits projets

---

## 🛠️ Dépannage

### Erreurs CORS
- Vérifier que `FRONTEND_URL` est correct dans Railway
- S'assurer que l'URL commence par `https://`

### Erreurs de build
- Vérifier que Node.js 18+ est utilisé
- Contrôler les dépendances dans package.json

### Erreurs de connexion
- Vérifier les variables d'environnement
- Tester l'API directement avec Postman

---

## 📞 Support
Pour toute question sur le déploiement, vérifier :
1. Les logs Railway dans l'onglet "Deployments"
2. Les logs Netlify dans l'onglet "Functions"
3. La console du navigateur pour les erreurs frontend 