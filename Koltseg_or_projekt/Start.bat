@echo off
title KöltségŐr Indito
color 0A

echo ==================================================
echo         KöltségŐr - Keltsegvetes Koveto
echo ==================================================
echo.

:: Ellenőrizzük, hogy a Node.js telepítve van-e
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [HIBA] A Node.js nincs telepitve! Kerlek telepitsd: https://nodejs.org/
    echo A tanarnak szuksege lesz a Node.js-re a futtatashoz.
    pause
    exit /b
)

echo [1/3] Fuggosegek ellenorzese es telepitese...
call npm install >nul 2>&1

echo [2/3] Felhasznaloi felulet (kliens) elokeszitese...
call npm run build >nul 2>&1

echo [3/3] Szerver inditasa...
echo.
echo Az alkalmazas hamarosan megnyilik a bongeszoben.
echo Ne zard be ezt az ablakot, amig hasznalod a programot!
echo.


start http://localhost:3001


set NODE_ENV=production
node server/index.cjs

pause
