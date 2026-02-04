/**
 * Soluciones Segura
 * Script reservado para funciones futuras
 * Estado actual: sin lógica activa (producción limpia)
 */

document.addEventListener("DOMContentLoaded", () => {
  const shines = document.querySelectorAll(".img-shine");

  if (!("IntersectionObserver" in window)) return;

  const triggerShine = (el) => {
    el.classList.remove("is-shining");
    void el.offsetWidth; // fuerza reflow
    el.classList.add("is-shining");

    setTimeout(() => {
      el.classList.remove("is-shining");
    }, 1200);
  };

  /* 👉 ACTIVAR AL ENTRAR EN PANTALLA */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        triggerShine(entry.target);
      }
    });
  }, {
    threshold: 0.45
  });

  shines.forEach((el) => {
    observer.observe(el);

    /* 👉 ACTIVAR EN MÓVIL AL TOCAR (SIEMPRE) */
    el.addEventListener("touchstart", () => {
      triggerShine(el);
    }, { passive: true });
  });
});
