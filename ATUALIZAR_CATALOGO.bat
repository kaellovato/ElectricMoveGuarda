@echo off
echo ========================================
echo   Electric Move - Atualizador de Stock
echo ========================================
echo.
echo A atualizar o catalogo do StandVirtual...
echo.

cd /d "%~dp0"
call npm run update

echo.
echo ========================================
echo   Atualizacao concluida!
echo ========================================
echo.
pause
