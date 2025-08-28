# 🧪 Guide de Test - Application École

## ✅ **Tests à effectuer après déploiement**

### 1. **Test de Connexion Enseignant**
- **URL** : Votre site Netlify
- **Identifiants** :
  - Username : `prof`
  - Password : `prof123`
- **Résultat attendu** : Connexion réussie, accès au dashboard enseignant

### 2. **Test de Connexion Élève**
- **Identifiants** :
  - Username : `cm2` ou `ce6`
  - Password : `ecole`
- **Résultat attendu** : Connexion réussie, accès au dashboard élève

### 3. **Test du Formulaire de Contact**
- **Page** : Page Contact
- **Actions** :
  1. Remplir le formulaire (nom, email, message)
  2. Cliquer sur "Envoyer le message"
- **Résultat attendu** : Message "Votre message a été envoyé avec succès !"

### 4. **Test des Fonctionnalités Enseignant**
- **Gestion du contenu** : Ajouter/modifier/supprimer du contenu
- **Gestion des élèves** : Voir la liste des élèves
- **Messages de contact** : Voir les messages reçus

### 5. **Test des Fonctionnalités Élève**
- **Navigation** : Parcourir les différentes catégories
- **Contenu** : Voir et télécharger le contenu

## 🔧 **Dépannage**

### Erreur de Connexion
- **Vérifiez** : L'URL du backend dans les variables d'environnement Netlify
- **Valeur correcte** : `REACT_APP_API_URL=https://classe-numerique.fly.dev`

### Erreur de Contact
- **Vérifiez** : Que le backend Fly.io est actif
- **Commande** : `flyctl status -a classe-numerique`

### Erreur CORS
- **Vérifiez** : Les logs du backend pour les erreurs CORS
- **Commande** : `flyctl logs -a classe-numerique`

## 📊 **URLs Importantes**

- **Frontend** : Votre URL Netlify
- **Backend** : https://classe-numerique.fly.dev
- **API Health** : https://classe-numerique.fly.dev/health
- **API Test** : https://classe-numerique.fly.dev/api

## 🎯 **Résultats Attendus**

✅ **Connexion réussie** pour prof/prof123  
✅ **Formulaire de contact fonctionnel**  
✅ **Navigation fluide** entre les pages  
✅ **Gestion du contenu** pour les enseignants  
✅ **Accès au contenu** pour les élèves  

## 📞 **En cas de problème**

1. **Vérifiez la console du navigateur** (F12) pour les erreurs JavaScript
2. **Vérifiez les logs Netlify** pour les erreurs de build
3. **Vérifiez les logs Fly.io** pour les erreurs backend
4. **Testez l'API directement** avec les URLs ci-dessus 