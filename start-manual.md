# 🚀 GUIDE DE DÉMARRAGE MANUEL DU PROJET

## 📋 **Prérequis**
- ✅ Node.js installé (version 16 ou supérieure)
- ✅ npm installé
- ✅ Ports 3000 et 5000 libres

## 🔧 **Démarrage du Backend (Serveur)**

### **Étape 1: Ouvrir un terminal PowerShell**
```powershell
cd server
```

### **Étape 2: Installer les dépendances (si pas déjà fait)**
```powershell
npm install
```

### **Étape 3: Démarrer le serveur**
```powershell
npm start
```

**Résultat attendu :**
```
🚀 Serveur démarré sur le port 5000
✅ Contenus chargés depuis le stockage local: 0 éléments
📝 Aucun fichier de contenus trouvé, utilisation du stockage en mémoire
```

## 🎨 **Démarrage du Frontend (Client)**

### **Étape 1: Ouvrir un NOUVEAU terminal PowerShell**
```powershell
cd client
```

### **Étape 2: Installer les dépendances (si pas déjà fait)**
```powershell
npm install
```

### **Étape 3: Démarrer le client React**
```powershell
npm start
```

**Résultat attendu :**
```
Compiled successfully!

You can now view ecole-client in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

## 🌐 **Accès à l'application**

### **URLs d'accès :**
- **Frontend :** http://localhost:3000
- **Backend :** http://localhost:5000

### **Identifiants de test :**
- **Professeur :** `prof` / `prof123`
- **CM2 :** `cm2` / `ecole`
- **CM1 :** `cm1` / `ecole`

## 🛠️ **Démarrage automatique (Recommandé)**

### **Option 1: Script PowerShell**
```powershell
.\start-local.ps1
```

### **Option 2: Script Bash (si Git Bash disponible)**
```bash
./start.sh
```

## 🔍 **Vérification du bon fonctionnement**

### **1. Vérifier le backend**
- Ouvrir http://localhost:5000/api/content
- Devrait retourner un tableau JSON (même vide)

### **2. Vérifier le frontend**
- Ouvrir http://localhost:3000
- Devrait afficher la page de connexion

### **3. Test de connexion**
- Se connecter avec les identifiants de test
- Vérifier l'accès au dashboard

## ❌ **Résolution des problèmes courants**

### **Port 5000 occupé**
```powershell
# Vérifier les processus utilisant le port 5000
netstat -ano | findstr :5000

# Tuer le processus (remplacer PID par l'ID du processus)
taskkill /PID <PID> /F
```

### **Port 3000 occupé**
```powershell
# Vérifier les processus utilisant le port 3000
netstat -ano | findstr :3000

# Tuer le processus (remplacer PID par l'ID du processus)
taskkill /PID <PID> /F
```

### **Erreur de dépendances**
```powershell
# Nettoyer et réinstaller
rm -rf node_modules
rm package-lock.json
npm install
```

## 📊 **Structure des dossiers**
```
Ecole-main/
├── server/          # Backend Node.js
│   ├── index.js     # Point d'entrée du serveur
│   ├── routes/      # Routes API
│   └── data/        # Données persistantes
├── client/          # Frontend React
│   ├── src/         # Code source
│   └── public/      # Fichiers publics
└── start-local.ps1  # Script de démarrage PowerShell
```

## 🎯 **Fonctionnalités disponibles localement**

- ✅ **Authentification** - Connexion professeur/élèves
- ✅ **Dashboard professeur** - Gestion des contenus
- ✅ **Upload de fichiers** - Miniatures et PDFs
- ✅ **Persistance locale** - Sauvegarde des données
- ✅ **Gestion des thèmes** - Organisation du contenu

## 💡 **Conseils d'utilisation**

1. **Gardez les deux terminaux ouverts** pour surveiller les logs
2. **Utilisez Ctrl+C** pour arrêter proprement les serveurs
3. **Vérifiez les ports** avant de redémarrer
4. **Consultez les logs** en cas de problème

## 🆘 **Support**

En cas de problème :
1. Vérifiez que les ports sont libres
2. Consultez les logs dans les terminaux
3. Vérifiez que Node.js et npm sont installés
4. Relancez les serveurs dans l'ordre (backend puis frontend) 