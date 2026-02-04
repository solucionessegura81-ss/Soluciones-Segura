/**
 * Soluciones Segura
 * Script reservado para funciones futuras
 * Estado actual: sin lógica activa (producción limpia)
 */

document.addEventListener("DOMContentLoaded", () => {
  const shines = document.querySelectorAll(".img-shine");
  if (!shines.length) return;

  const trigger = (el) => {
    el.classList.remove("is-shining");
    void el.offsetWidth; // reflow para reiniciar animación
    el.classList.add("is-shining");
    setTimeout(() => el.classList.remove("is-shining"), 1200);
  };

  // ✅ Tap/click: que funcione SIEMPRE en móvil (no solo 1 vez)
  shines.forEach((el) => {
    el.addEventListener("pointerdown", () => trigger(el), { passive: true });
  });

  // ✅ Auto al entrar en pantalla (si el navegador soporta IntersectionObserver)
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      trigger(entry.target);
    });
  }, {
    threshold: 0.45
  });

  shines.forEach((el) => observer.observe(el));
});
