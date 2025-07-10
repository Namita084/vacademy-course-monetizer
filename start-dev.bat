@echo off
echo Starting Vacademy Course Monetizer Development Server...
echo.
echo If you encounter PowerShell execution policy issues, try:
echo 1. Run this as Administrator
echo 2. Or use: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
echo.
echo Starting server on http://localhost:8080
echo.
npm run dev
pause 