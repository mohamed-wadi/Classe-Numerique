# 🚀 Guide de Déploiement Netlify - MISE À JOUR

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
Utilisez ces paramètres **EXACTS** :
- **Base directory** : `client`
- **Build command** : `DISABLE_ESLINT_PLUGIN=true npm run build:prod`
- **Publish directory** : `build`

### 4. Variables d'Environnement (OPTIONNEL)
Si vous voulez ajouter une variable d'environnement manuellement :
- **Key** : `REACT_APP_API_URL`
- **Value** : `https://classe-numerique.fly.dev`

**Note** : La variable est maintenant incluse dans le script de build, donc ce n'est plus nécessaire.

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
- Vérifiez que la commande de build est exactement : `DISABLE_ESLINT_PLUGIN=true npm run build:prod`
- Assurez-vous que le base directory est `client`

### Erreur de Connexion
- Vérifiez que le backend Fly.io est actif
- Vérifiez que l'URL `https://classe-numerique.fly.dev` est accessible

### Erreur CORS
- Le backend est configuré pour accepter les domaines Netlify
- Si problème persiste, vérifiez les logs du backend

## 📞 Support
En cas de problème, vérifiez :
1. Les logs de build Netlify
2. Les logs du backend Fly.io
3. La console du navigateur pour les erreurs JavaScript
4. Que l'URL du backend est correcte dans le build 