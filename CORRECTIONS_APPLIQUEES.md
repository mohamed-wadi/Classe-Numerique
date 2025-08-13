# 📋 Corrections Appliquées - Problème de Fichiers sur Fly.io

## 📋 Résumé des Corrections

Ce document résume toutes les corrections appliquées pour résoudre le problème de disparition des fichiers uploadés sur Fly.io.

## 🎯 Problème Initial

Lors du déploiement sur Fly.io, les fichiers uploadés (PDF et images) disparaissaient après le redémarrage du conteneur, empêchant leur affichage dans l'application déployée.

## 🔧 Corrections Appliquées

### 1. server/routes/content.js

Modification du système de stockage pour utiliser le volume persistant :

```javascript
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
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
```

### 2. server/index.js

Mise à jour du service de fichiers statiques et de la route PDF :

```javascript
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

// Route spécifique pour les PDF avec affichage inline
app.get('/uploads/*.pdf', (req, res) => {
  // Utiliser le bon chemin pour les uploads selon l'environnement
  const uploadsBasePath = process.env.NODE_ENV === 'production' 
    ? '/app/data/uploads' 
    : path.join(__dirname, 'uploads');
    
  const filePath = path.join(uploadsBasePath, req.params[0] + '.pdf');

  // Vérifier si le fichier existe
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Fichier PDF non trouvé' });
  }

  // Lire le fichier
  const fileStream = fs.createReadStream(filePath);

  // Définir les headers pour forcer l'affichage inline
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache pour 1 heure

  // Envoyer le fichier
  fileStream.pipe(res);
});
```

### 3. server/Dockerfile

Mise à jour du dossier de création :

```dockerfile
# Créer le dossier uploads s'il n'existe pas
RUN mkdir -p /app/data/uploads
```

## ✅ Résultat Final

- Les fichiers uploadés sont maintenant stockés dans le volume persistant
- Ils survivent aux redémarrages du conteneur
- Les PDF et miniatures s'affichent correctement dans l'application déployée
- La persistance des données est assurée

## 📚 Documentation Complémentaire

- [SOLUTION_PERSISTANCE_FLY.md](SOLUTION_PERSISTANCE_FLY.md) - Solution détaillée pour la persistance des fichiers
- [GUIDE_DEPLOIEMENT_CORRECTIONS.md](GUIDE_DEPLOIEMENT_CORRECTIONS.md) - Guide complet de déploiement et corrections
- [FLY_DEPLOYMENT.md](FLY_DEPLOYMENT.md) - Guide de déploiement sur Fly.io
- [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) - Guide de déploiement sur Netlify

## 🧪 Procédure de Vérification

1. Déployer sur Fly.io : `cd server && flyctl deploy`
2. Accéder à l'application : https://wadi-fz.netlify.app/teacher
3. Se connecter avec les identifiants professeur
4. Ajouter un contenu avec PDF et miniature
5. Vérifier que les fichiers s'affichent correctement
6. Redémarrer le conteneur : `flyctl apps restart classe-numerique`
7. Vérifier que les fichiers sont toujours accessibles

## 📞 Support

En cas de problème :
1. Vérifier les logs : `flyctl logs -a classe-numerique`
2. Vérifier que le volume est bien monté : `flyctl volumes list -a classe-numerique`
3. Vérifier les permissions du dossier uploads