/**
 * Cookie Consent Manager
 * Gerenciamento de cookies em conformidade com LGPD e GDPR
 * Electric Move Guarda
 */

// Nome do cookie que guarda as preferências
const COOKIE_CONSENT_NAME = "electricmove_cookie_consent";
const COOKIE_EXPIRY_DAYS = 365;

// Verifica se o banner deve ser exibido
document.addEventListener("DOMContentLoaded", function () {
  const consent = getCookieConsent();

  if (!consent) {
    // Mostrar banner após um pequeno delay
    setTimeout(() => {
      showCookieBanner();
    }, 1000);
  } else {
    // Aplicar preferências salvas
    applyConsent(consent);
  }
});

// Mostra o banner de cookies
function showCookieBanner() {
  const banner = document.getElementById("cookieBanner");
  if (banner) {
    banner.classList.add("show");
    banner.classList.remove("hide");
  }
}

// Esconde o banner de cookies
function hideCookieBanner() {
  const banner = document.getElementById("cookieBanner");
  if (banner) {
    banner.classList.remove("show");
    banner.classList.add("hide");
  }
}

// Aceita todos os cookies
function acceptAllCookies() {
  const consent = {
    essential: true,
    performance: true,
    functional: true,
    timestamp: new Date().toISOString(),
    version: "1.0",
  };

  saveCookieConsent(consent);
  applyConsent(consent);
  hideCookieBanner();

  // Log para analytics (se estiver ativado)
  console.log("✅ Todos os cookies foram aceites");
}

// Rejeita cookies opcionais (apenas essenciais)
function rejectOptionalCookies() {
  const consent = {
    essential: true,
    performance: false,
    functional: false,
    timestamp: new Date().toISOString(),
    version: "1.0",
  };

  saveCookieConsent(consent);
  applyConsent(consent);
  hideCookieBanner();

  console.log("⚠️ Apenas cookies essenciais aceites");
}

// Abre o modal de configurações
function openCookieSettings() {
  const modal = document.getElementById("cookieModal");
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";

    // Carregar preferências atuais
    const consent = getCookieConsent();
    if (consent) {
      const perfCheckbox = document.getElementById("cookiePerformance");
      const funcCheckbox = document.getElementById("cookieFunctional");

      if (perfCheckbox) perfCheckbox.checked = consent.performance;
      if (funcCheckbox) funcCheckbox.checked = consent.functional;
    }
  }
}

// Fecha o modal de configurações
function closeCookieSettings() {
  const modal = document.getElementById("cookieModal");
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }
}

// Guarda as configurações personalizadas
function saveCookieSettings() {
  const perfCheckbox = document.getElementById("cookiePerformance");
  const funcCheckbox = document.getElementById("cookieFunctional");

  const consent = {
    essential: true,
    performance: perfCheckbox ? perfCheckbox.checked : false,
    functional: funcCheckbox ? funcCheckbox.checked : false,
    timestamp: new Date().toISOString(),
    version: "1.0",
  };

  saveCookieConsent(consent);
  applyConsent(consent);
  closeCookieSettings();
  hideCookieBanner();

  console.log("💾 Preferências de cookies guardadas:", consent);
}

// Guarda o consentimento no localStorage e cookie
function saveCookieConsent(consent) {
  // Guardar no localStorage
  localStorage.setItem(COOKIE_CONSENT_NAME, JSON.stringify(consent));

  // Guardar também como cookie (para acessibilidade do servidor)
  const expiryDate = new Date();
  expiryDate.setTime(
    expiryDate.getTime() + COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  );

  document.cookie =
    `${COOKIE_CONSENT_NAME}=${encodeURIComponent(JSON.stringify(consent))}; ` +
    `expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax; Secure`;
}

// Obtém o consentimento guardado
function getCookieConsent() {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_NAME);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Erro ao ler preferências de cookies:", e);
  }
  return null;
}

// Aplica o consentimento (ativa/desativa funcionalidades baseado nas preferências)
function applyConsent(consent) {
  if (!consent) return;

  // Performance cookies - analytics
  if (consent.performance) {
    // Aqui você pode adicionar Google Analytics, Hotjar, etc.
    // Exemplo: initGoogleAnalytics();
    enablePerformanceCookies();
  } else {
    disablePerformanceCookies();
  }

  // Functional cookies - preferências do usuário
  if (consent.functional) {
    enableFunctionalCookies();
  } else {
    disableFunctionalCookies();
  }
}

// Ativa cookies de desempenho (analytics)
function enablePerformanceCookies() {
  // Placeholder para Google Analytics ou outros serviços de analítica
  // Se você adicionar Google Analytics no futuro, descomente e configure:
  /*
  if (typeof gtag !== 'undefined') {
    gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
  }
  */
  console.log("📊 Cookies de desempenho ativados");
}

// Desativa cookies de desempenho
function disablePerformanceCookies() {
  // Remove cookies de analytics se existirem
  deleteCookie("_ga");
  deleteCookie("_gid");
  deleteCookie("_gat");

  console.log("📊 Cookies de desempenho desativados");
}

// Ativa cookies funcionais
function enableFunctionalCookies() {
  // Cookies de preferências do usuário
  console.log("⚙️ Cookies funcionais ativados");
}

// Desativa cookies funcionais
function disableFunctionalCookies() {
  console.log("⚙️ Cookies funcionais desativados");
}

// Função auxiliar para deletar um cookie
function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Verifica se um tipo específico de cookie foi aceite
function isCookieTypeAccepted(type) {
  const consent = getCookieConsent();
  if (!consent) return false;
  return consent[type] === true;
}

// Permite que o usuário reabra as configurações de cookies
// Pode ser chamada de qualquer lugar do site
function reopenCookieSettings() {
  openCookieSettings();
}

// Revoga todo o consentimento (para link de "Revogar Cookies" na política de privacidade)
function revokeAllCookies() {
  localStorage.removeItem(COOKIE_CONSENT_NAME);
  deleteCookie(COOKIE_CONSENT_NAME);

  // Deletar outros cookies conhecidos
  deleteCookie("_ga");
  deleteCookie("_gid");
  deleteCookie("_gat");

  // Mostrar banner novamente
  showCookieBanner();

  console.log("🗑️ Todos os cookies foram revogados");
  alert(
    "Todos os cookies foram revogados com sucesso. O banner de cookies irá aparecer novamente.",
  );
}

// Fecha modal ao clicar fora dele
document.addEventListener("click", function (e) {
  const modal = document.getElementById("cookieModal");
  if (modal && e.target === modal) {
    closeCookieSettings();
  }
});

// Fecha modal com tecla Escape
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeCookieSettings();
  }
});

// Exporta funções para uso global
window.acceptAllCookies = acceptAllCookies;
window.rejectOptionalCookies = rejectOptionalCookies;
window.openCookieSettings = openCookieSettings;
window.closeCookieSettings = closeCookieSettings;
window.saveCookieSettings = saveCookieSettings;
window.reopenCookieSettings = reopenCookieSettings;
window.revokeAllCookies = revokeAllCookies;
window.isCookieTypeAccepted = isCookieTypeAccepted;
