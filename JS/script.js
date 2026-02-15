/**
 * Soluciones Segura
 * Shine automático cuando la imagen entra en pantalla (PC + móvil)
 * - PC: hover lo maneja CSS
 * - Móvil: NO hay evento por toque (para no afectar pinch-zoom)
 */

document.addEventListener("DOMContentLoaded", () => {
  const shines = document.querySelectorAll(".img-shine");
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      el.classList.remove("is-shining");
      void el.offsetWidth; // reinicia animación
      el.classList.add("is-shining");

      setTimeout(() => el.classList.remove("is-shining"), 1200);
    });
  }, { threshold: 0.45 });

  shines.forEach((el) => observer.observe(el));
});

// =============================================
// SHINE en cards (móvil): al tocar -> barrido
// No bloquea el click, solo agrega clase y la quita
// =============================================
(function () {
  const cards = document.querySelectorAll('.card');
  if (!cards.length) return;

  // Solo aplica en dispositivos touch (móvil/tablet)
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (!isTouchDevice) return;

  let lastTouchTime = 0;

  cards.forEach(card => {
    card.addEventListener('touchstart', () => {
      const now = Date.now();

      // Evita dispararlo demasiadas veces mientras arrastrás
      if (now - lastTouchTime < 220) return;
      lastTouchTime = now;

      card.classList.remove('is-shining'); // reinicia animación
      // Forzar reflow para reiniciar el keyframes
      void card.offsetWidth;
      card.classList.add('is-shining');

      // Quitar clase después del efecto
      setTimeout(() => card.classList.remove('is-shining'), 1100);
    }, { passive: true });
  });
})();

// =====================================================
// SHINE en MÓVIL: SOLO si tocas una card mientras vienes haciendo scroll
// (no abre el link en ese toque)
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (!isTouch) return;

  const cards = Array.from(document.querySelectorAll(".card"));
  if (!cards.length) return;

  // Detecta si el usuario viene haciendo scroll recientemente
  let recentlyScrolling = false;
  let scrollTimer = null;

  window.addEventListener("scroll", () => {
    recentlyScrolling = true;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      recentlyScrolling = false;
    }, 220); // ventana corta: "vengo bajando"
  }, { passive: true });

  // Anti-spam (no repetir brillo demasiado seguido en la misma card)
  let lastCard = null;
  let lastTime = 0;

  const triggerShine = (card) => {
    const now = Date.now();
    if (card === lastCard && now - lastTime < 450) return;

    lastCard = card;
    lastTime = now;

    card.classList.add("is-shining-text");
    setTimeout(() => card.classList.remove("is-shining-text"), 900);
  };

  // Bloquear apertura SOLO en ese toque "mientras bajaba"
  const blockClickOnce = (card) => {
    card.dataset.blockClickOnce = "1";
    setTimeout(() => { delete card.dataset.blockClickOnce; }, 350);
  };

  cards.forEach((card) => {
    // Si tocas una card mientras vienes scrolleando -> brillo + no entrar
    card.addEventListener("touchstart", () => {
      if (!recentlyScrolling) return;  // ✅ si no vienes bajando, no hace nada
      triggerShine(card);
      blockClickOnce(card);
    }, { passive: true });

    // Evita entrar SOLO cuando el toque fue bloqueado
    card.addEventListener("click", (e) => {
      if (card.dataset.blockClickOnce === "1") {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  });
});

// ===== Shine del HEADER al cargar (móvil y PC) =====
window.addEventListener("load", () => {
  const header = document.querySelector(".header");
  if (!header) return;

  // Dispara el efecto después de que ya cargó la imagen y fuentes
  setTimeout(() => {
    header.classList.add("is-shining");

    // Limpia la clase para que pueda volver a dispararse si recargas
    setTimeout(() => header.classList.remove("is-shining"), 1400);
  }, 250);
});
