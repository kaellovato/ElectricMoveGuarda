@echo off
echo ========================================
echo   Electric Move - Servidor Local
echo ========================================
echo.
echo Iniciando servidor em http://localhost:8080
echo.
echo Para parar o servidor, pressione CTRL+C
echo.

cd /d "%~dp0"
start http://localhost:8080
call npm start
