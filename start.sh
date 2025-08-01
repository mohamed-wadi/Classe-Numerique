#!/bin/bash
echo "🚀 Démarrage de l'École CM2 & CE6..."

# Nettoyer le port 5000
echo "🔧 Nettoyage du port 5000..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || true

# Démarrer le serveur backend
echo "📡 Démarrage du serveur backend (port 5000)..."
cd server
node index.js &
BACKEND_PID=$!
sleep 3

# Vérifier que le backend est actif
if curl -s http://localhost:5000/api/auth/login -X POST -H "Content-Type: application/json" -d '{"username":"prof","password":"prof123"}' > /dev/null; then
    echo "✅ Backend démarré avec succès!"
    
    # Démarrer le frontend
    cd ../client
    echo "🎨 Démarrage du frontend (port 3000)..."
    npm start &
    FRONTEND_PID=$!
    
    echo "🎯 Application prête!"
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend: http://localhost:5000"
    echo "📝 Identifiants de test:"
    echo "   - Professeur: prof / prof123"
    echo "   - CM2: cm2 / ecole"
    echo "   - CE6: ce6 / ecole"
    
    echo "💡 Appuyez sur Ctrl+C pour arrêter tous les serveurs"
    wait
else
    echo "❌ Erreur: Impossible de démarrer le backend"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi
