# Electric Move Guarda - Sistema de Catálogo Dinâmico

Site profissional com catálogo dinâmico de veículos elétricos, sistema de cookies em conformidade com RGPD/GDPR, e atualização automática via GitHub Actions.

## 🚗 Funcionalidades

- ✅ **Catálogo dinâmico** - Atualizado automaticamente do StandVirtual
- ✅ **Atualização semanal automática** - Via GitHub Actions (segundas-feiras às 6h)
- ✅ **Responsivo** - Otimizado para desktop, tablet e mobile
- ✅ **RGPD/GDPR** - Banner de cookies e política de privacidade
- ✅ **Segurança** - Headers de segurança (HSTS, CSP, XSS Protection)
- ✅ **SEO** - Meta tags, Open Graph, Schema.org

## 📁 Estrutura do Projeto

```
ElectricMove/
├── index.html               # Página principal
├── privacidade.html         # Política de privacidade
├── styles.css               # Estilos do site
├── script.js                # JavaScript principal
├── cookies.js               # Gestão de cookies (RGPD)
├── vehicles.json            # Dados dos veículos
├── scraper.js               # Script de scraping
├── package.json             # Dependências
├── sitemap.xml              # Mapa do site para SEO
├── robots.txt               # Instruções para crawlers
├── Logo2.png                # Logo da empresa
├── .github/
│   └── workflows/
│       └── update-catalog.yml  # 🔄 Atualização automática semanal
├── INSTALAR.bat             # Instalação inicial
├── ATUALIZAR_CATALOGO.bat   # Atualizar manualmente
└── ABRIR_SITE.bat           # Abrir site local
```

## 🔄 Atualização Automática (GitHub Actions)

O catálogo é atualizado **automaticamente todas as segundas-feiras às 6h** (horário de Portugal) via GitHub Actions.

### Como funciona:

1. O workflow executa o scraper.js
2. Extrai os veículos do StandVirtual
3. Atualiza o vehicles.json
4. Faz commit automático se houver mudanças

### Executar manualmente:

1. Vá para o repositório no GitHub
2. Clique em **Actions** > **Atualizar Catálogo de Veículos**
3. Clique em **Run workflow**

## 🔒 Segurança Implementada

### Headers de Segurança (via meta tags HTML)

- **CSP** - Content Security Policy
- **X-Content-Type-Options** - Previne MIME sniffing
- **Referrer-Policy** - Controle de referrer

### Cookies (RGPD/GDPR)

- Banner de consentimento de cookies
- Modal de configuração granular
- Opção de aceitar/rejeitar cookies
- Link para revogar cookies a qualquer momento
- Política de privacidade completa

## 🚀 Instalação Local

### 1️⃣ Pré-requisitos

- Node.js 18+ ([nodejs.org](https://nodejs.org/))
- Git

### 2️⃣ Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/ElectricMove.git
cd ElectricMove

# Instale dependências
npm install

# Atualize o catálogo
npm run update

# Abra o site
npm start
```

### 3️⃣ Ou use os arquivos .bat (Windows)

- `INSTALAR.bat` - Instalação inicial
- `ATUALIZAR_CATALOGO.bat` - Atualizar catálogo
- `ABRIR_SITE.bat` - Abrir site no browser

## 🌐 Deploy no GitHub Pages

1. Faça push do código para o GitHub
2. Vá em **Settings** > **Pages**
3. Em "Source", selecione **Deploy from a branch**
4. Selecione a branch **main** e pasta **/ (root)**
5. Clique em **Save**

O site estará disponível em `https://SEU_USUARIO.github.io/NOME_REPOSITORIO/`

### Domínio personalizado

1. Compre um domínio (ex: electricmoveguarda.pt)
2. No GitHub: **Settings** > **Pages** > **Custom domain**
3. Configure os registros DNS:
   - **A record**: Aponte para os IPs do GitHub Pages
   - **CNAME**: Aponte `www` para `SEU_USUARIO.github.io`

### Segurança extra com Cloudflare (Recomendado)

Para headers de segurança HTTP completos:

1. Use o Cloudflare como proxy DNS (gratuito)
2. Configure Page Rules ou Transform Rules para headers adicionais
3. Ative "Always Use HTTPS" e "Auto Minify"

## ⚠️ Notas Importantes

1. **CORS**: O arquivo `vehicles.json` deve estar no mesmo domínio do site
2. **Rate Limiting**: Não execute o scraper com muita frequência para evitar bloqueios
3. **Imagens**: As imagens são carregadas diretamente do StandVirtual. Se houver problemas de CORS, um ícone será exibido como fallback
4. **Backup**: Mantenha sempre um backup do `vehicles.json` atualizado
5. **GitHub Actions**: O catálogo é atualizado automaticamente às segundas-feiras às 6h

## 🛠️ Testar Localmente

Para testar o site localmente:

```bash
npm start
```

O site estará disponível em `http://localhost:8080`

## 📧 Suporte

Para questões sobre o site, contacte:

- Email: electricmoveguarda@gmail.com
- Telefone: +351 928 383 863
