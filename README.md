# Electric Move Guarda

Plataforma web para catálogo dinâmico de veículos elétricos e híbridos da Electric Move Guarda, integrada com StandVirtual.

![Electric Move Guarda](https://electricmoveguarda.pt/Logo2.png)

## 🚗 Sobre o Projeto

Electric Move Guarda é uma solução profissional para gestão e exibição de catálogo de veículos elétricos e híbridos. O projeto raspa dados de forma automática do StandVirtual e os exibe em um catálogo interativo e responsivo.

### Características Principais

- ✅ **Catálogo Dinâmico**: Sincronização automática com StandVirtual
- ✅ **Filtros Inteligentes**: Por marca (Tesla, BMW, Mercedes, Hyundai, Outros)
- ✅ **Design Responsivo**: Desktop, tablet e mobile
- ✅ **Performance Otimizada**: Carregamento rápido e imagens otimizadas
- ✅ **SEO Completo**: Meta tags, sitemap, robots.txt
- ✅ **GitHub Pages Ready**: Deploy automático
- ✅ **GDPR/LGPD Compliant**: Consentimento de cookies

## 📁 Estrutura do Projeto

```
ElectricMoveGuarda/
├── index.html           # Página principal
├── privacidade.html     # Página de privacidade
├── script.js            # Lógica frontend
├── cookies.js           # Gestão de cookies
├── styles.css           # Estilos responsivos
├── scraper.js           # Web scraper
├── package.json         # Dependências
├── vehicles.json        # Base de dados
├── .github/             # CI/CD
├── .gitignore           # Git config
└── assets/              # Logos e imagens
```

## 🚀 Quick Start

```bash
# Clonar repositório
git clone https://github.com/kaellovato/ElectricMoveGuarda.git
cd ElectricMoveGuarda

# Instalar dependências
npm install

# Atualizar catálogo (raspar StandVirtual)
npm run update

# Iniciar servidor local
npm start
```

## 🔄 Atualização Automática

O catálogo é atualizado automaticamente via GitHub Actions. Para executar manualmente:

```bash
npm run update
```

## 📊 Dados dos Veículos

Cada veículo possui:

```json
{
  "id": 1,
  "brand": "Tesla",
  "model": "Model 3",
  "fullTitle": "Tesla Model 3 Standard Range",
  "price": "29900",
  "image": "https://...",
  "link": "https://www.standvirtual.com/...",
  "fuel": "Elétrico",
  "date": "Agosto 2023",
  "km": "46 000",
  "category": "tesla"
}
```

## 🛠️ Customizações

**Alterar cores/branding:**
- Editar variáveis CSS em `styles.css`

**Modificar seletores de web scraping:**
- Editar `scraper.js` linha 62-160

**Aumentar páginas de scraping:**
- Editar `scraper.js` linha 34

## 📱 Responsividade

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px  
- **Mobile**: até 767px

## 🌐 Deploy (GitHub Pages)

1. Push para `main` branch
2. GitHub Actions executa build
3. Site em `https://electricmoveguarda.pt`

## 🔐 Segurança

- ✅ CSP (Content Security Policy)
- ✅ HTTPS obrigatório
- ✅ GDPR/LGPD compliant
- ✅ Sanitização de inputs

## 📝 SEO

- ✅ robots.txt
- ✅ sitemap.xml
- ✅ Meta tags
- ✅ Schema.org
- ✅ Lazy loading

## 📧 Contato

**Electric Move Guarda**

- 📍 Estrada Nacional 18, nº19, 6300-766 Guarda
- 📱 +351 928 383 863
- 📧 electricmoveguarda@gmail.com
- 🌐 https://electricmoveguarda.pt

---

**Desenvolvido com ❤️ para Electric Move Guarda**
