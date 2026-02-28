/**
 * Scraper para Electric Move Guarda
 * Atualiza automaticamente o catálogo com dados do StandVirtual
 *
 * Uso: npm run update
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const STANDVIRTUAL_URL =
  "https://jsfeelelectricmove.standvirtual.com/inventory";
const OUTPUT_FILE = path.join(__dirname, "vehicles.json");

async function scrapeVehicles() {
  console.log("🚗 Iniciando scraping do StandVirtual...");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Configurar viewport e user agent
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  );

  let allVehicles = [];
  let pageNum = 1;
  const maxPages = 3; // Máximo de páginas para varrer

  try {
    for (pageNum = 1; pageNum <= maxPages; pageNum++) {
      const pageUrl =
        pageNum === 1
          ? STANDVIRTUAL_URL
          : `${STANDVIRTUAL_URL}?page=${pageNum}`;
      console.log(`📡 Acessando página ${pageNum}... (${pageUrl})`);

      await page.goto(pageUrl, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });

      // Aguardar carregamento dos anúncios
      try {
        await page.waitForSelector("article", { timeout: 10000 });
      } catch (e) {
        console.log(`⚠️ Nenhum artigo encontrado na página ${pageNum}`);
        break;
      }

      // Scroll para carregar todos os veículos da página
      await autoScroll(page);

      console.log(`🔍 Extraindo dados da página ${pageNum}...`);

      const vehicles = await page.evaluate(() => {
        const items = [];
        const articles = document.querySelectorAll("article");

        articles.forEach((article, index) => {
          try {
            // Link do anúncio
            const linkEl = article.querySelector('a[href*="standvirtual.com"]');
            const link = linkEl ? linkEl.href : "";

            // Imagem
            const imgEl = article.querySelector("img");
            const image = imgEl ? imgEl.src : "";

            // Título/Nome do veículo
            const titleEl = article.querySelector(
              'h2, h3, [data-testid="ad-title"]',
            );
            const fullTitle = titleEl ? titleEl.textContent.trim() : "";

            // Separar marca e modelo
            const titleParts = fullTitle.split(" ");
            const brand = titleParts[0] || "";
            const model = titleParts.slice(1).join(" ") || "";

            // Preço - tentar diferentes seletores
            let price = "";
            const priceSelectors = [
              '[class*="price"]',
              '[data-testid="ad-price"]',
              'p[class*="Price"]',
              'span[class*="price"]',
            ];
            for (const selector of priceSelectors) {
              const priceEl = article.querySelector(selector);
              if (priceEl) {
                const priceText = priceEl.textContent.trim();
                const priceMatch = priceText.match(/([\d\s]+)\s*(EUR|€)/i);
                if (priceMatch) {
                  price = priceMatch[1].replace(/\s/g, " ").trim();
                  break;
                }
              }
            }

            // Detalhes (combustível, data, km) - tentar o texto completo do artigo
            const articleText = article.textContent || "";

            // Extrair informações
            const isElectric =
              articleText.toLowerCase().includes("eléctrico") ||
              articleText.toLowerCase().includes("elétrico") ||
              articleText.toLowerCase().includes("electric");

            // Extrair ano/mês - formato: Mês · AAAA
            const dateMatch = articleText.match(
              /(Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro)\s*·?\s*(\d{4})/i,
            );
            const date = dateMatch ? `${dateMatch[1]} ${dateMatch[2]}` : "";

            // Extrair quilometragem - formato: XXX XXX km (antes de EUR)
            let km = "";
            // Tentar capturar o padrão: ano · XXXXX km
            const kmMatch = articleText.match(/\d{4}\s*·?\s*(\d[\d\s]*)\s*km/i);
            if (kmMatch) {
              km = kmMatch[1].replace(/\s/g, "").trim();
              // Formatar com espaços para milhares
              km = parseInt(km).toLocaleString("pt-PT");
            }

            // Extrair preço - formato: XX XXX EUR
            const priceMatch = articleText.match(/(\d[\d\s]*)\s*EUR/i);
            if (priceMatch && !price) {
              price = priceMatch[1].replace(/\s/g, "").trim();
            }

            if (link && fullTitle) {
              items.push({
                brand: brand,
                model: model,
                fullTitle: fullTitle,
                price: price,
                image: image,
                link: link,
                fuel: isElectric ? "Elétrico" : "Híbrido",
                date: date,
                km: km,
              });
            }
          } catch (e) {
            console.error("Erro ao processar artigo:", e);
          }
        });

        return items;
      });

      if (vehicles.length === 0) {
        console.log(
          `⚠️ Nenhum veículo encontrado na página ${pageNum} - fim da paginação`,
        );
        break;
      }

      allVehicles = allVehicles.concat(vehicles);
      console.log(
        `✅ Página ${pageNum}: ${vehicles.length} veículos encontrados (Total: ${allVehicles.length})`,
      );

      // Pausa entre páginas
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Remover duplicados baseado no link
    const uniqueVehicles = [];
    const seenLinks = new Set();
    for (const vehicle of allVehicles) {
      if (!seenLinks.has(vehicle.link)) {
        seenLinks.add(vehicle.link);
        vehicle.id = uniqueVehicles.length + 1;
        uniqueVehicles.push(vehicle);
      }
    }

    // Determinar categoria/marca para filtros
    uniqueVehicles.forEach((vehicle) => {
      const brandLower = vehicle.brand.toLowerCase();
      if (brandLower.includes("tesla")) {
        vehicle.category = "tesla";
      } else if (brandLower.includes("bmw")) {
        vehicle.category = "bmw";
      } else if (brandLower.includes("mercedes")) {
        vehicle.category = "mercedes";
      } else if (brandLower.includes("hyundai")) {
        vehicle.category = "hyundai";
      } else {
        vehicle.category = "outros";
      }
    });

    console.log(
      `✅ Total: ${uniqueVehicles.length} veículos únicos encontrados`,
    );

    // Salvar dados
    const data = {
      lastUpdate: new Date().toISOString(),
      totalVehicles: uniqueVehicles.length,
      sourceUrl: STANDVIRTUAL_URL,
      vehicles: uniqueVehicles,
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), "utf8");
    console.log(`💾 Dados salvos em ${OUTPUT_FILE}`);

    await browser.close();
    return data;
  } catch (error) {
    console.error("❌ Erro durante scraping:", error.message);
    await browser.close();
    throw error;
  }
}

// Função para scroll automático e carregar mais conteúdo
async function autoScroll(page) {
  let previousCount = 0;
  let attempts = 0;
  const maxAttempts = 30; // Máximo de tentativas

  while (attempts < maxAttempts) {
    // Contar artigos atuais
    const currentCount = await page.evaluate(
      () => document.querySelectorAll("article").length,
    );

    console.log(`   📊 Artigos carregados: ${currentCount}`);

    if (currentCount === previousCount) {
      attempts++;
      if (attempts >= 5) break; // Para após 5 tentativas sem novos artigos
    } else {
      attempts = 0; // Reset se encontrou novo conteúdo
    }

    previousCount = currentCount;

    // Scroll até o final
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Aguardar carregamento de novo conteúdo
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Tentar clicar no botão "Carregar mais" se existir
    try {
      const loadMoreBtn = await page.$(
        'button[class*="load"], button[class*="more"], [class*="loadMore"]',
      );
      if (loadMoreBtn) {
        await loadMoreBtn.click();
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (e) {
      // Ignorar se não encontrar botão
    }
  }

  // Scroll final
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const finalCount = await page.evaluate(
    () => document.querySelectorAll("article").length,
  );
  console.log(`📜 Scroll completo - ${finalCount} artigos carregados`);
}

// Executar
scrapeVehicles()
  .then((data) => {
    console.log("🎉 Scraping concluído com sucesso!");
    console.log(`📊 Total de veículos: ${data.totalVehicles}`);
    console.log(`🕐 Última atualização: ${data.lastUpdate}`);
  })
  .catch((error) => {
    console.error("💥 Falha no scraping:", error);
    process.exit(1);
  });
