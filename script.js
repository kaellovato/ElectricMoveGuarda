// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenu = document.querySelector(".mobile-menu");
  const navLinks = document.querySelector(".nav-links");

  mobileMenu.addEventListener("click", function () {
    navLinks.classList.toggle("active");

    // Toggle icon
    const icon = mobileMenu.querySelector("i");
    if (navLinks.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });

  // Close mobile menu when clicking on a link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      const icon = mobileMenu.querySelector("i");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    });
  });

  // Header scroll effect
  const header = document.querySelector(".header");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.style.boxShadow = "0 2px 30px rgba(0, 0, 0, 0.15)";
    } else {
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    }

    lastScroll = currentScroll;
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Load vehicles from JSON
  loadVehicles();

  // Vehicle Filter System
  const filterBtns = document.querySelectorAll(".filter-btn");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      filterBtns.forEach((b) => b.classList.remove("active"));
      // Add active class to clicked button
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      const vehicleCards = document.querySelectorAll(".vehicle-card");

      vehicleCards.forEach((card) => {
        if (filter === "all") {
          card.classList.remove("hidden");
        } else if (card.dataset.brand === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Add animation to sections
  const animatedElements = document.querySelectorAll(
    ".about-content, .contact-card, .social-section",
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});

// Function to load vehicles - carrega do JSON local (atualizado via GitHub Actions)
async function loadVehicles() {
  const vehiclesGrid = document.getElementById("vehiclesGrid");
  const vehicleCount = document.getElementById("vehicleCount");
  const lastUpdate = document.getElementById("lastUpdate");

  let data = null;

  try {
    // Carrega os dados do arquivo JSON local
    const localResponse = await fetch("vehicles.json");
    if (!localResponse.ok) {
      throw new Error("Erro ao carregar veículos");
    }
    data = await localResponse.json();
    console.log("📁 Dados carregados do catálogo");
    } catch (e) {
      throw new Error("Não foi possível carregar os veículos");
    }
  }

  try {
    // Update vehicle count
    vehicleCount.textContent = `${data.totalVehicles} veículos`;

    // Format and display last update
    if (data.lastUpdate) {
      const updateDate = new Date(data.lastUpdate);
      const formattedDate = updateDate.toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      lastUpdate.textContent = `Última atualização: ${formattedDate}`;
    }

    // Clear loading message
    vehiclesGrid.innerHTML = "";

    // Render vehicles
    data.vehicles.forEach((vehicle, index) => {
      const card = createVehicleCard(vehicle);
      vehiclesGrid.appendChild(card);

      // Animate cards on load
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 50);
    });
  } catch (error) {
    console.error("Erro ao carregar veículos:", error);
    vehiclesGrid.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>Não foi possível carregar os veículos. Por favor, visite diretamente o 
        <a href="https://jsfeelelectricmove.standvirtual.com/inventory" target="_blank">StandVirtual</a>.</p>
      </div>
    `;
  }
}

// Function to create vehicle card HTML
function createVehicleCard(vehicle) {
  const card = document.createElement("a");
  card.href = vehicle.link;
  card.target = "_blank";
  card.className = "vehicle-card";
  card.dataset.brand = vehicle.category;
  card.style.opacity = "0";
  card.style.transform = "translateY(30px)";
  card.style.transition = "opacity 0.4s ease, transform 0.4s ease";

  // Format price
  const formattedPrice = parseInt(vehicle.price).toLocaleString("pt-PT");

  // Determine icon based on vehicle type
  const isMotorcycle =
    vehicle.link.includes("/motos/") ||
    vehicle.model.toLowerCase().includes("moto") ||
    vehicle.model.toLowerCase().includes("scooter") ||
    vehicle.brand.toLowerCase().includes("seat mó") ||
    vehicle.fullTitle.toLowerCase().includes("ce 02");

  const vehicleIcon = isMotorcycle ? "fa-motorcycle" : "fa-car";

  card.innerHTML = `
    <div class="vehicle-badge">${vehicle.fuel}</div>
    <div class="vehicle-image">
      ${
        vehicle.image && vehicle.image.startsWith("http")
          ? `<img src="${vehicle.image}" alt="${vehicle.fullTitle}" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='<i class=\\'fas ${vehicleIcon}\\'></i>';">`
          : `<i class="fas ${vehicleIcon}"></i>`
      }
    </div>
    <div class="vehicle-info">
      <h3>${vehicle.brand} ${vehicle.model.split(" ").slice(0, 2).join(" ")}</h3>
      <p class="vehicle-version">${vehicle.model}</p>
      <div class="vehicle-specs">
        <span><i class="fas fa-calendar"></i> ${vehicle.date || "N/A"}</span>
        <span><i class="fas fa-road"></i> ${vehicle.km || "N/A"} km</span>
      </div>
      <div class="vehicle-price">${formattedPrice} €</div>
    </div>
  `;

  return card;
}

// ========================================
// BOTÃO FLUTUANTE DE AJUDA (FAB)
// ========================================
document.addEventListener("DOMContentLoaded", function () {
  const fabButton = document.getElementById("helpFabButton");
  const fabMenu = document.getElementById("helpFabMenu");
  const fabIcon = document.getElementById("helpFabIcon");

  if (fabButton && fabMenu) {
    // Toggle do menu ao clicar no botão
    fabButton.addEventListener("click", function (e) {
      e.stopPropagation();
      fabButton.classList.toggle("active");
      fabMenu.classList.toggle("show");

      // Mudar ícone
      if (fabButton.classList.contains("active")) {
        fabIcon.classList.remove("fa-question");
        fabIcon.classList.add("fa-times");
      } else {
        fabIcon.classList.remove("fa-times");
        fabIcon.classList.add("fa-question");
      }
    });

    // Fechar menu ao clicar fora
    document.addEventListener("click", function (e) {
      if (!fabButton.contains(e.target) && !fabMenu.contains(e.target)) {
        fabButton.classList.remove("active");
        fabMenu.classList.remove("show");
        fabIcon.classList.remove("fa-times");
        fabIcon.classList.add("fa-question");
      }
    });

    // Fechar menu ao pressionar Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && fabMenu.classList.contains("show")) {
        fabButton.classList.remove("active");
        fabMenu.classList.remove("show");
        fabIcon.classList.remove("fa-times");
        fabIcon.classList.add("fa-question");
      }
    });

    // Fechar menu ao clicar em um item (exceto cookies que tem seu próprio handler)
    fabMenu.querySelectorAll(".help-fab-item:not(.cookies)").forEach((item) => {
      item.addEventListener("click", function () {
        fabButton.classList.remove("active");
        fabMenu.classList.remove("show");
        fabIcon.classList.remove("fa-times");
        fabIcon.classList.add("fa-question");
      });
    });
  }
});
