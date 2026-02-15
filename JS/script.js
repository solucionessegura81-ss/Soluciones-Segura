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
// SHINE en MÓVIL: cuando una card entra en pantalla (scroll)
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (!isTouch) return; // Solo móvil / touch

  const cards = document.querySelectorAll(".card");
  if (!cards.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;

        // Evita re-disparos seguidos
        if (el.classList.contains("is-shining-text")) return;

        el.classList.add("is-shining-text");

        // Quitar clase luego del efecto
        setTimeout(() => {
          el.classList.remove("is-shining-text");
        }, 1000);
      });
    },
    { threshold: 0.55 } // se activa cuando la card está bastante visible
  );

  cards.forEach((c) => io.observe(c));
});
