# 🚀 Guide de Déploiement Netlify

## 📋 Prérequis
- Compte GitHub avec le projet `Classe-Numerique`
- Compte Netlify (gratuit)

## 🔧 Configuration Netlify

### 1. Connexion à Netlify
1. Allez sur [netlify.com](https://netlify.com)
2. Cliquez sur "Sign up" et connectez-vous avec votre compte GitHub

### 2. Déploiement depuis GitHub
1. Cliquez sur "New site from Git"
2. Choisissez "GitHub" comme provider
3. Sélectionnez le repository `mohamed-wadi/Classe-Numerique`

### 3. Configuration du Build
Utilisez ces paramètres :
- **Base directory** : `client`
- **Build command** : `DISABLE_ESLINT_PLUGIN=true npm run build`
- **Publish directory** : `build`

### 4. Variables d'Environnement
Ajoutez cette variable d'environnement :
- **Key** : `REACT_APP_API_URL`
- **Value** : `https://classe-numerique.fly.dev`

### 5. Déploiement
1. Cliquez sur "Deploy site"
2. Attendez que le build se termine (2-3 minutes)

## ✅ Vérification

### Test de l'Application
1. **Accédez à votre site Netlify** (URL fournie)
2. **Testez la connexion** :
   - Username : `prof`
   - Password : `prof123`
3. **Testez le formulaire de contact**

### URLs Importantes
- **Frontend** : Votre URL Netlify
- **Backend** : https://classe-numerique.fly.dev

## 🔧 Dépannage

### Erreur de Build
- Vérifiez que la commande de build est correcte
- Assurez-vous que `DISABLE_ESLINT_PLUGIN=true` est inclus

### Erreur de Connexion
- Vérifiez que le backend Fly.io est actif
- Vérifiez la variable d'environnement `REACT_APP_API_URL`

### Erreur CORS
- Le backend est configuré pour accepter les domaines Netlify
- Si problème persiste, vérifiez les logs du backend

## 📞 Support
En cas de problème, vérifiez :
1. Les logs de build Netlify
2. Les logs du backend Fly.io
3. La console du navigateur pour les erreurs JavaScript 