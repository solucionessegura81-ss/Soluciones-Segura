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
// SHINE en MÓVIL: cuando el dedo pasa por una card mientras haces scroll
// (no abre el link si estabas desplazándote)
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (!isTouch) return;

  const cards = Array.from(document.querySelectorAll(".card"));
  if (!cards.length) return;

  let moved = false;
  let startX = 0;
  let startY = 0;

  // Para evitar disparos repetidos en la misma card
  let lastCard = null;
  let lastTime = 0;

  // Evita que se abra el link si fue un gesto de scroll sobre una card
  const blockClickOnce = (card) => {
    card.dataset.blockClickOnce = "1";
    setTimeout(() => { delete card.dataset.blockClickOnce; }, 350);
  };

  // Bloquea el click SOLO si venías haciendo scroll
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (card.dataset.blockClickOnce === "1") {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  });

  const triggerShine = (card) => {
    const now = Date.now();
    // Anti-spam (misma card muy seguido)
    if (card === lastCard && now - lastTime < 450) return;

    lastCard = card;
    lastTime = now;

    card.classList.add("is-shining-text");
    setTimeout(() => card.classList.remove("is-shining-text"), 900);
  };

  const cardFromPoint = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    return el.closest ? el.closest(".card") : null;
  };

  document.addEventListener("touchstart", (e) => {
    moved = false;
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
  }, { passive: true });

  document.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - startX);
    const dy = Math.abs(t.clientY - startY);

    // Si se movió lo suficiente, es scroll (no tap)
    if (dx > 6 || dy > 6) moved = true;

    if (!moved) return;

    const card = cardFromPoint(t.clientX, t.clientY);
    if (!card) return;

    // Dispara brillo y bloquea apertura del link en este gesto de scroll
    triggerShine(card);
    blockClickOnce(card);
  }, { passive: true });

});
