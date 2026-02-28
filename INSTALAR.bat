@echo off
echo ========================================
echo   Electric Move - Instalacao Inicial
echo ========================================
echo.
echo Este script vai instalar as dependencias necessarias.
echo Certifique-se de ter o Node.js instalado.
echo.
echo Pode baixar o Node.js em: https://nodejs.org/
echo.
pause

cd /d "%~dp0"

echo.
echo Instalando dependencias...
call npm install

echo.
echo Fazendo primeira atualizacao do catalogo...
call npm run update

echo.
echo ========================================
echo   Instalacao concluida com sucesso!
echo ========================================
echo.
echo Agora voce pode:
echo   - Duplo clique em ATUALIZAR_CATALOGO.bat para atualizar os veiculos
echo   - Duplo clique em ABRIR_SITE.bat para visualizar o site localmente
echo.
pause
