# Script PowerShell simple pour lancer le projet
Write-Host "Starting Ecole CM2 & CM1 project..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "npm detected: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: npm not installed" -ForegroundColor Red
    exit 1
}

# Start backend server
Write-Host "Starting backend server (port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; Write-Host 'Backend server started on http://localhost:5000'; node index.js"

# Wait for server to start
Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if backend is active
Write-Host "Checking backend server..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/content" -Method GET -TimeoutSec 10
    Write-Host "Backend started successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error: Cannot start backend" -ForegroundColor Red
    Write-Host "Check if port 5000 is not used by another application" -ForegroundColor Yellow
    exit 1
}

# Start frontend
Write-Host "Starting frontend (port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; Write-Host 'Frontend started on http://localhost:3000'; npm start"

# Wait for frontend to start
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Application ready!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test credentials:" -ForegroundColor Yellow
Write-Host "   - Teacher: prof / prof123" -ForegroundColor White
Write-Host "   - CM2: cm2 / ecole" -ForegroundColor White
Write-Host "   - CM1: cm1 / ecole" -ForegroundColor White
Write-Host ""
Write-Host "To stop servers, close the PowerShell windows" -ForegroundColor Yellow
Write-Host "Or use Ctrl+C in each window" -ForegroundColor Yellow
Write-Host ""
Write-Host "Server logs: Watch the backend PowerShell window" -ForegroundColor Magenta
Write-Host "Frontend logs: Watch the client PowerShell window" -ForegroundColor Magenta

# Keep window open
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 