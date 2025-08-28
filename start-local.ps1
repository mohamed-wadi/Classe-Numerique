# Script PowerShell pour lancer le projet École CM2 & CE6 localement
Write-Host "🚀 Démarrage de l'École CM2 & CE6..." -ForegroundColor Green

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur: Node.js n'est pas installé ou n'est pas dans le PATH" -ForegroundColor Red
    Write-Host "📥 Veuillez installer Node.js depuis https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Vérifier si npm est installé
try {
    $npmVersion = npm --version
    Write-Host "✅ npm détecté: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur: npm n'est pas installé" -ForegroundColor Red
    exit 1
}

# Nettoyer le port 5000 si nécessaire
Write-Host "🔧 Vérification du port 5000..." -ForegroundColor Yellow
try {
    $processes = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
    if ($processes) {
        Write-Host "⚠️  Port 5000 occupé, tentative de libération..." -ForegroundColor Yellow
        Get-Process -Id $processes.OwningProcess | Stop-Process -Force
        Start-Sleep -Seconds 2
    }
} catch {
    Write-Host "ℹ️  Port 5000 libre" -ForegroundColor Green
}

# Démarrer le serveur backend
Write-Host "📡 Démarrage du serveur backend (port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; Write-Host '🚀 Serveur backend démarré sur http://localhost:5000'; node index.js"

# Attendre que le serveur démarre
Write-Host "⏳ Attente du démarrage du serveur..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Vérifier que le backend est actif
Write-Host "🔍 Vérification du serveur backend..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/content" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend démarré avec succès!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur: Impossible de démarrer le backend" -ForegroundColor Red
    Write-Host "💡 Vérifiez que le port 5000 n'est pas utilisé par une autre application" -ForegroundColor Yellow
    exit 1
}

# Démarrer le frontend
Write-Host "🎨 Démarrage du frontend (port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; Write-Host '🎨 Frontend démarré sur http://localhost:3000'; npm start"

# Attendre un peu pour que le frontend démarre
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🎯 Application prête!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Identifiants de test:" -ForegroundColor Yellow
Write-Host "   - Professeur: prof / prof123" -ForegroundColor White
Write-Host "   - CM2: cm2 / ecole" -ForegroundColor White
Write-Host "   - CE6: ce6 / ecole" -ForegroundColor White
Write-Host ""
Write-Host "💡 Pour arrêter les serveurs, fermez les fenêtres PowerShell ouvertes" -ForegroundColor Yellow
Write-Host "💡 Ou utilisez Ctrl+C dans chaque fenêtre" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔍 Logs du serveur: Surveillez la fenêtre PowerShell du serveur" -ForegroundColor Magenta
Write-Host "🎨 Logs du frontend: Surveillez la fenêtre PowerShell du client" -ForegroundColor Magenta

# Garder la fenêtre ouverte
Write-Host ""
Write-Host "Appuyez sur une touche pour fermer cette fenêtre..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 