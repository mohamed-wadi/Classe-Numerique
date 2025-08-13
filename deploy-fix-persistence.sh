#!/bin/bash

# Script de déploiement avec correction de persistance pour Fly.io
echo "🚀 Déploiement de l'application avec correction de persistance..."

# Vérifier si Fly CLI est installé
if ! command -v fly &> /dev/null; then
    echo "❌ Fly CLI n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si on est dans le bon répertoire
if [ ! -f "fly.toml" ]; then
    echo "❌ Fichier fly.toml non trouvé. Veuillez exécuter ce script depuis la racine du projet."
    exit 1
fi

echo "🔧 Mise à jour du code source..."
git add .
git commit -m "🔧 Correction de persistance et chemins de fichiers" || echo "ℹ️  Aucun changement à commiter"
git push origin main

echo "📦 Déploiement sur Fly.io..."
fly deploy --config server/fly.toml

echo "⏱️  Attente de 10 secondes pour que l'application démarre..."
sleep 10

echo "🔍 Vérification de l'état de l'application..."
fly status

echo "🔧 Exécution du script de correction des chemins de fichiers..."
fly ssh console -C "cd /app && npm run fix-paths"

echo "✅ Déploiement terminé avec correction de persistance !"
echo "🔗 URL de l'application: https://classe-numerique.fly.dev"