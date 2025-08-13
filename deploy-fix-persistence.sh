#!/bin/bash

echo "🚀 Déploiement des corrections de persistance des fichiers sur Fly.io"
echo "=================================================================="

# Aller dans le dossier server
cd server

echo "📦 Vérification de la configuration Fly.io..."
flyctl config show -a classe-numerique

echo "🔧 Déploiement en cours..."
flyctl deploy -a classe-numerique

echo "⏳ Attente du déploiement..."
sleep 10

echo "🔍 Vérification du statut de l'application..."
flyctl status -a classe-numerique

echo "📊 Vérification des logs..."
flyctl logs -a classe-numerique --lines 20

echo "🧪 Test de l'API de santé..."
curl -s https://classe-numerique.fly.dev/health | jq .

echo "🧪 Test de l'API de débogage des uploads..."
curl -s https://classe-numerique.fly.dev/debug/uploads | jq .

echo "✅ Déploiement terminé!"
echo "🌐 Application disponible sur: https://classe-numerique.fly.dev"
echo "🎯 Frontend disponible sur: https://wadi-fz.netlify.app/teacher"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Accéder à https://wadi-fz.netlify.app/teacher"
echo "2. Se connecter avec prof/prof123"
echo "3. Ajouter un contenu avec PDF et miniature"
echo "4. Vérifier que les fichiers s'affichent correctement"
echo "5. Consulter les logs avec: flyctl logs -a classe-numerique"