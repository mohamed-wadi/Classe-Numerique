# 📁 Guide de Déploiement et Corrections - Fichiers Persistants

## 🎯 Problème Initial

Lors du déploiement sur Fly.io, les fichiers uploadés (PDF et images) disparaissaient après le redémarrage du conteneur. Cela empêchait l'affichage correct des PDF et miniatures dans l'application déployée.

## 🔍 Analyse du Problème

### Symptômes
- Message d'erreur : `{"message":"Route non trouvée","path":"/uploads/nom-du-fichier.pdf","method":"GET"}`
- Les miniatures ne s'affichaient pas
- Les PDF ne pouvaient pas être ouverts

### Cause Racine
Les fichiers étaient stockés dans le système de fichiers éphémère du conteneur (`/app/uploads`) au lieu du volume persistant monté sur `/app/data`.

## 🛠️ Solution Implémentée

### 1. Modification du Stockage des Fichiers

#### Avant (❌ Problématique)
```javascript
// server/routes/content.js
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier éphémère
  },
  // ...
});
```

#### Après (✅ Correct)
```javascript
// server/routes/content.js
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Utiliser le volume persistant pour les uploads en production
    const uploadDir = process.env.NODE_ENV === 'production' 
      ? '/app/data/uploads' 
      : 'uploads/';
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`📁 Dossier d'uploads créé: ${uploadDir}`);
    }
    
    cb(null, uploadDir);
  },
  // ...
});
```

### 2. Mise à jour du Service de Fichiers Statiques

#### Avant (❌ Problématique)
```javascript
// server/index.js
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

#### Après (✅ Correct)
```javascript
// server/index.js
// Servir les fichiers statiques depuis le dossier uploads (local et production)
const uploadsPath = process.env.NODE_ENV === 'production' 
  ? '/app/data/uploads' 
  : path.join(__dirname, 'uploads');

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log(`📁 Dossier d'uploads créé: ${uploadsPath}`);
}

app.use('/uploads', express.static(uploadsPath));
```

### 3. Mise à jour de la Route PDF Spécifique

#### Avant (❌ Problématique)
```javascript
// server/index.js
app.get('/uploads/*.pdf', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  // ...
});
```

#### Après (✅ Correct)
```javascript
// server/index.js
app.get('/uploads/*.pdf', (req, res) => {
  // Utiliser le bon chemin pour les uploads selon l'environnement
  const uploadsBasePath = process.env.NODE_ENV === 'production' 
    ? '/app/data/uploads' 
    : path.join(__dirname, 'uploads');
    
  const filePath = path.join(uploadsBasePath, req.params[0] + '.pdf');
  // ...
});
```

### 4. Mise à jour du Dockerfile

#### Avant (❌ Problématique)
```dockerfile
# Créer le dossier uploads s'il n'existe pas
RUN mkdir -p uploads
```

#### Après (✅ Correct)
```dockerfile
# Créer le dossier uploads s'il n'existe pas
RUN mkdir -p /app/data/uploads
```

## ✅ Résultat Final

- Les fichiers uploadés sont maintenant stockés dans le volume persistant
- Ils survivent aux redémarrages du conteneur
- Les PDF et miniatures s'affichent correctement dans l'application déployée
- La persistance des données est assurée

## 🧪 Procédure de Test

1. **Déploiement**
   ```bash
   cd server
   flyctl deploy
   ```

2. **Vérification**
   - Accéder à https://wadi-fz.netlify.app/teacher
   - Se connecter avec les identifiants professeur
   - Ajouter un contenu avec PDF et miniature
   - Vérifier que les fichiers s'affichent correctement
   - Redémarrer le conteneur : `flyctl apps restart classe-numerique`
   - Vérifier que les fichiers sont toujours accessibles

## 📞 Support

En cas de problème :
1. Vérifier les logs : `flyctl logs -a classe-numerique`
2. Vérifier que le volume est bien monté : `flyctl volumes list -a classe-numerique`
3. Vérifier les permissions du dossier uploads

## 📚 Documentation Complémentaire

- [SOLUTION_PERSISTANCE_FLY.md](SOLUTION_PERSISTANCE_FLY.md) - Solution détaillée pour la persistance des fichiers
- [FLY_DEPLOYMENT.md](FLY_DEPLOYMENT.md) - Guide de déploiement sur Fly.io
- [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) - Guide de déploiement sur Netlify