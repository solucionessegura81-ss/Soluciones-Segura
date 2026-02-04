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
    void el.offsetWidth;
    el.classList.add("is-shining");
    setTimeout(() => el.classList.remove("is-shining"), 1200);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) triggerShine(entry.target);
    });
  }, { threshold: 0.45 });

  shines.forEach((el) => {
    observer.observe(el);

    // ✅ Tap: funciona en iPhone/Android y se repite cada vez
    const tapHandler = () => triggerShine(el);

    el.addEventListener("pointerdown", tapHandler, { passive: true });
    el.addEventListener("touchstart", tapHandler, { passive: true });
    el.addEventListener("click", tapHandler);
  });
});
