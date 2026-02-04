/**
 * Soluciones Segura
 * Shine en imágenes + Doble toque para zoom (móvil) / doble clic (PC)
 */

document.addEventListener("DOMContentLoaded", () => {
  const shines = document.querySelectorAll(".img-shine");

  /* ==========================
     1) SHINE con IntersectionObserver
     ========================== */
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;

        // Dispara el brillo
        el.classList.remove("is-shining");
        void el.offsetWidth; // reflow para reiniciar animación
        el.classList.add("is-shining");

        setTimeout(() => el.classList.remove("is-shining"), 1200);
      });
    }, { threshold: 0.45 });

    shines.forEach((el) => observer.observe(el));
  }

  /* ==========================
     2) DOBLE TOQUE / DOBLE CLIC: ZOOM TOGGLE
     ========================== */

  // Cierra zoom si el usuario toca afuera
  const closeAllZoom = (exceptEl = null) => {
    shines.forEach((el) => {
      if (el !== exceptEl) el.classList.remove("is-zoomed");
    });
  };

  // PC: doble clic
  shines.forEach((el) => {
    el.addEventListener("dblclick", (e) => {
      e.preventDefault();
      const willZoom = !el.classList.contains("is-zoomed");
      closeAllZoom(el);
      el.classList.toggle("is-zoomed", willZoom);
    });
  });

  // MÓVIL: doble toque (touch)
  shines.forEach((el) => {
    let lastTap = 0;

    el.addEventListener("touchend", (e) => {
      const now = Date.now();
      const delta = now - lastTap;

      // 250–420ms suele funcionar bien para doble tap
      if (delta > 250 && delta < 420) {
        e.preventDefault();

        const willZoom = !el.classList.contains("is-zoomed");
        closeAllZoom(el);
        el.classList.toggle("is-zoomed", willZoom);

        lastTap = 0;
      } else {
        lastTap = now;
      }
    }, { passive: false });
  });

  // Si tocas fuera de una imagen, se quita el zoom
  document.addEventListener("click", (e) => {
    const clickedInside = e.target.closest(".img-shine");
    if (!clickedInside) closeAllZoom();
  });

  document.addEventListener("touchstart", (e) => {
    const touchedInside = e.target.closest(".img-shine");
    if (!touchedInside) closeAllZoom();
  }, { passive: true });
});
