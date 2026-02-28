# Electric Move Guarda - Sistema de Catálogo Dinâmico

Este site possui um sistema de catálogo que pode ser atualizado automaticamente a partir do StandVirtual.

## 📁 Estrutura do Projeto

```
ElectricMove/
├── index.html               # Página principal
├── styles.css               # Estilos do site
├── script.js                # JavaScript (carrega veículos do JSON)
├── vehicles.json            # Dados dos veículos (gerado pelo scraper)
├── scraper.js               # Script para atualizar o catálogo
├── package.json             # Dependências do Node.js
├── Logo.png                 # Logo da empresa
├── README.md                # Este arquivo
├── INSTALAR.bat             # 🟢 Instalação inicial (executar primeiro!)
├── ATUALIZAR_CATALOGO.bat   # 🔄 Atualizar veículos do StandVirtual
└── ABRIR_SITE.bat           # 🌐 Abrir site localmente
```

## 🚀 Instalação Rápida (Para Iniciantes)

### 1️⃣ Instalar o Node.js

Baixe e instale o Node.js em: https://nodejs.org/
(Escolha a versão LTS)

### 2️⃣ Executar a Instalação

Dê **duplo clique** no arquivo `INSTALAR.bat`

Isso vai instalar tudo automaticamente e fazer a primeira atualização do catálogo.

### 3️⃣ Pronto!

- Para **atualizar o catálogo**: duplo clique em `ATUALIZAR_CATALOGO.bat`
- Para **visualizar o site**: duplo clique em `ABRIR_SITE.bat`

---

## 🔧 Instalação Manual (Avançado)

```bash
cd ElectricMove
npm install
```

### Atualizar o Catálogo

Execute o comando:

```bash
npm run update
```

Este comando irá:

1. Aceder ao StandVirtual
2. Extrair todos os veículos disponíveis
3. Guardar as informações no arquivo `vehicles.json`
4. O site carregará automaticamente os novos dados

## 🔄 Atualização Automática (Opcional)

### Windows - Agendador de Tarefas

1. Abra o "Agendador de Tarefas"
2. Crie uma nova tarefa
3. Defina o gatilho (ex: diariamente às 8h)
4. Ação: Iniciar programa
   - Programa: `node`
   - Argumentos: `scraper.js`
   - Iniciar em: `C:\Users\kaell\Desktop\ElectricMove`

### Linux/Mac - Cron Job

Adicione ao crontab (`crontab -e`):

```bash
# Atualizar catálogo todos os dias às 8h
0 8 * * * cd /caminho/para/ElectricMove && node scraper.js
```

## 🌐 Hospedagem

### Opção 1: Netlify (Recomendado para sites estáticos)

1. Faça upload da pasta para o GitHub
2. Conecte o repositório ao Netlify
3. Configure uma função serverless para executar o scraper

### Opção 2: Vercel

Similar ao Netlify, com suporte a funções serverless

### Opção 3: Servidor próprio

1. Configure um servidor web (Apache, Nginx)
2. Configure um cron job para executar o scraper periodicamente

## ⚠️ Notas Importantes

1. **CORS**: O arquivo `vehicles.json` deve estar no mesmo domínio do site
2. **Rate Limiting**: Não execute o scraper com muita frequência para evitar bloqueios
3. **Imagens**: As imagens são carregadas diretamente do StandVirtual. Se houver problemas de CORS, um ícone será exibido como fallback
4. **Backup**: Mantenha sempre um backup do `vehicles.json` atualizado

## 🛠️ Testar Localmente

Para testar o site localmente:

```bash
npm start
```

O site estará disponível em `http://localhost:8080`

## 📧 Suporte

Para questões sobre o site, contacte:

- Email: info@electricmoveguarda.pt
- Telefone: +351 000 000 000
