#!/bin/bash

echo "🚀 Déploiement sur Fly.io..."

# Vérifier que flyctl est installé
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl n'est pas installé. Installez-le depuis https://fly.io/docs/hands-on/install-flyctl/"
    exit 1
fi

# Aller dans le dossier server
cd server

# Déployer sur Fly.io
echo "📦 Construction et déploiement..."
flyctl deploy

# Vérifier le statut
echo "📊 Statut du déploiement..."
flyctl status

echo "✅ Déploiement terminé!"
echo "🌐 Votre app est disponible sur: https://classe-numerique.fly.dev" 