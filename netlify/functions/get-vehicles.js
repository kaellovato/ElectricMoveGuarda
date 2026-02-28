const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const STANDVIRTUAL_URL =
  "https://jsfeelelectricmove.standvirtual.com/inventory";

exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=3600", // Cache de 1 hora
  };

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    );

    let allVehicles = [];

    // Buscar página 1 e 2
    for (let pageNum = 1; pageNum <= 2; pageNum++) {
      const url =
        pageNum === 1
          ? STANDVIRTUAL_URL
          : `${STANDVIRTUAL_URL}?page=${pageNum}`;

      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

      try {
        await page.waitForSelector("article", { timeout: 10000 });
      } catch (e) {
        break;
      }

      // Scroll para carregar imagens
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise((r) => setTimeout(r, 2000));

      const vehicles = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll("article").forEach((article) => {
          try {
            const linkEl = article.querySelector('a[href*="standvirtual.com"]');
            const link = linkEl ? linkEl.href : "";

            const imgEl = article.querySelector("img");
            const image = imgEl ? imgEl.src : "";

            const titleEl = article.querySelector("h2, h3");
            const fullTitle = titleEl ? titleEl.textContent.trim() : "";

            const titleParts = fullTitle.split(" ");
            const brand = titleParts[0] || "";
            const model = titleParts.slice(1).join(" ") || "";

            const articleText = article.textContent || "";

            const isElectric =
              articleText.toLowerCase().includes("eléctrico") ||
              articleText.toLowerCase().includes("elétrico");

            const dateMatch = articleText.match(
              /(Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro)\s*·?\s*(\d{4})/i,
            );
            const date = dateMatch ? `${dateMatch[1]} ${dateMatch[2]}` : "";

            const kmMatch = articleText.match(/\d{4}\s*·?\s*(\d[\d\s]*)\s*km/i);
            let km = kmMatch ? kmMatch[1].replace(/\s/g, "") : "";

            const priceMatch = articleText.match(/(\d[\d\s]*)\s*EUR/i);
            const price = priceMatch ? priceMatch[1].replace(/\s/g, "") : "";

            if (link && fullTitle) {
              const brandLower = brand.toLowerCase();
              let category = "outros";
              if (brandLower.includes("tesla")) category = "tesla";
              else if (brandLower.includes("bmw")) category = "bmw";
              else if (brandLower.includes("mercedes")) category = "mercedes";
              else if (brandLower.includes("hyundai")) category = "hyundai";

              items.push({
                brand,
                model,
                fullTitle,
                price,
                image,
                link,
                fuel: isElectric ? "Elétrico" : "Híbrido",
                date,
                km,
                category,
              });
            }
          } catch (e) {}
        });
        return items;
      });

      allVehicles = allVehicles.concat(vehicles);
    }

    await browser.close();

    // Remover duplicados
    const uniqueVehicles = [];
    const seenLinks = new Set();
    allVehicles.forEach((v, i) => {
      if (!seenLinks.has(v.link)) {
        seenLinks.add(v.link);
        v.id = uniqueVehicles.length + 1;
        uniqueVehicles.push(v);
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        lastUpdate: new Date().toISOString(),
        totalVehicles: uniqueVehicles.length,
        sourceUrl: STANDVIRTUAL_URL,
        vehicles: uniqueVehicles,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
