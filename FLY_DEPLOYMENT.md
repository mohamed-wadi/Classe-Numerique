# Guide de Déploiement sur Fly.io

## Prérequis

1. **Installer flyctl** :
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   
   # Ou télécharger depuis : https://fly.io/docs/hands-on/install-flyctl/
   ```

2. **Se connecter à Fly.io** :
   ```bash
   flyctl auth login
   ```

## Déploiement

### Option 1 : Déploiement automatique
```bash
# Rendre le script exécutable (Linux/Mac)
chmod +x deploy-fly.sh

# Exécuter le script
./deploy-fly.sh
```

### Option 2 : Déploiement manuel
```bash
# Aller dans le dossier server
cd server

# Déployer
flyctl deploy

# Vérifier le statut
flyctl status
```

## Vérification des logs

### Voir les logs en temps réel :
```bash
flyctl logs -a classe-numerique
```

### Voir les logs avec plus de détails :
```bash
flyctl logs -a classe-numerique --all
```

### Voir les logs d'une machine spécifique :
```bash
flyctl logs -a classe-numerique -i <machine-id>
```

## Commandes utiles

### Redémarrer l'application :
```bash
flyctl apps restart classe-numerique
```

### Voir les machines :
```bash
flyctl machines list -a classe-numerique
```

### Ouvrir l'application :
```bash
flyctl open -a classe-numerique
```

### Voir les variables d'environnement :
```bash
flyctl secrets list -a classe-numerique
```

## Dépannage

### Si le déploiement échoue :
1. Vérifiez les logs : `flyctl logs -a classe-numerique`
2. Vérifiez la configuration : `flyctl config show -a classe-numerique`
3. Redéployez : `flyctl deploy`

### Si l'application ne démarre pas :
1. Vérifiez les variables d'environnement
2. Vérifiez que le port 5000 est bien exposé
3. Vérifiez que le Dockerfile est correct

## URL de l'application
- **Backend** : https://classe-numerique.fly.dev
- **API Health Check** : https://classe-numerique.fly.dev/health
- **API Test** : https://classe-numerique.fly.dev/api 