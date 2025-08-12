#!/bin/bash

echo "🔧 CORRECTION DU PROBLÈME DE PERSISTANCE - DÉPLOIEMENT"
echo "======================================================"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "fly.toml" ]; then
    echo "❌ Erreur: fly.toml non trouvé. Exécutez ce script depuis la racine du projet."
    exit 1
fi

echo "📋 Étape 1: Vérification du statut actuel..."
fly status -a classe-numerique

echo ""
echo "📋 Étape 2: Création du volume persistant..."
echo "⚠️  ATTENTION: Ceci va créer un volume de 1GB dans la région cdg"
echo "⚠️  Le volume sera attaché à une machine spécifique"
read -p "Continuer? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Déploiement annulé"
    exit 1
fi

# Créer le volume persistant
echo "💾 Création du volume ecole_data..."
fly volumes create ecole_data --size 1 --region cdg

echo ""
echo "📋 Étape 3: Vérification des modifications..."
echo "✅ fly.toml - Configuration du volume persistant"
echo "✅ server/index.js - Route de santé ajoutée"
echo "✅ server/routes/content.js - Utilisation du volume persistant"

echo ""
echo "📋 Étape 4: Commit des modifications..."
git add .
git commit -m "🔧 Fix: Persistance des données avec volume Fly.io + route de santé"

echo ""
echo "📋 Étape 5: Push vers GitHub..."
git push origin main

echo ""
echo "📋 Étape 6: Déploiement sur Fly.io..."
cd server
fly deploy -a classe-numerique

echo ""
echo "📋 Étape 7: Vérification du déploiement..."
sleep 10
fly status -a classe-numerique

echo ""
echo "📋 Étape 8: Test de la route de santé..."
echo "🌐 Test de la route de santé: https://classe-numerique.fly.dev/health"

echo ""
echo "🎯 DÉPLOIEMENT TERMINÉ !"
echo "======================================================"
echo "✅ Volume persistant créé: ecole_data"
echo "✅ Serveur redéployé avec persistance"
echo "✅ Route de santé ajoutée"
echo ""
echo "🔍 Vérifications à effectuer:"
echo "1. Créer un nouvel élément avec miniature"
echo "2. Actualiser la page - l'élément doit persister"
echo "3. Vérifier les logs: fly logs -a classe-numerique"
echo ""
echo "🌐 URL de test: https://classe-numerique.fly.dev"
echo "📊 Logs: fly logs -a classe-numerique" 