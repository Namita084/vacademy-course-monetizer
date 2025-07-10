Write-Host "Starting Vacademy Course Monetizer Development Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Server will be available at: http://localhost:8080" -ForegroundColor Yellow
Write-Host ""

try {
    npm run dev
} catch {
    Write-Host "Error running npm run dev. Trying alternative approach..." -ForegroundColor Red
    Write-Host "Attempting to run with node directly..." -ForegroundColor Yellow
    
    try {
        node node_modules/.bin/vite
    } catch {
        Write-Host "Failed to start development server." -ForegroundColor Red
        Write-Host "Please check:" -ForegroundColor Yellow
        Write-Host "1. Node.js is installed" -ForegroundColor White
        Write-Host "2. Dependencies are installed (run: npm install)" -ForegroundColor White
        Write-Host "3. PowerShell execution policy allows script execution" -ForegroundColor White
        Write-Host ""
        Write-Host "To fix execution policy, run as Administrator:" -ForegroundColor Yellow
        Write-Host "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor White
    }
}

Read-Host "Press Enter to exit" 