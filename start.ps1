Write-Host "==============================" -ForegroundColor Cyan
Write-Host "  GymGear Marketplace Launcher" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Start backend
Write-Host "[1/2] Starting backend server..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
  Set-Location -LiteralPath "$using:PSScriptRoot\backend"
  $env:PORT = "5000"
  node server.js
}
Start-Sleep -Seconds 2
$backendOutput = Receive-Job -Job $backendJob
if ($backendOutput) { Write-Host $backendOutput -ForegroundColor Gray }

# Start frontend
Write-Host "[2/2] Starting frontend dev server..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
  Set-Location -LiteralPath "$using:PSScriptRoot\frontend"
  npm run dev
}
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "==============================" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to stop both servers..." -ForegroundColor Gray
$null = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Stop-Job $backendJob; Stop-Job $frontendJob
Remove-Job $backendJob; Remove-Job $frontendJob
Write-Host "Servers stopped." -ForegroundColor Cyan
