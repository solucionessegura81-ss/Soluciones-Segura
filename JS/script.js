/**
 * Soluciones Segura
 * Script reservado para funciones futuras
 * Estado actual: sin lógica activa (producción limpia)
 */

document.addEventListener("DOMContentLoaded", () => {
  const shines = document.querySelectorAll(".img-shine");

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;

      // Dispara el brillo
      el.classList.remove("is-shining"); // reinicio por si ya lo tuvo
      void el.offsetWidth;               // fuerza reflow para reiniciar animación
      el.classList.add("is-shining");

      // Quita la clase al terminar para permitir repetir al volver a entrar
      setTimeout(() => el.classList.remove("is-shining"), 1200);
    });
  }, {
    threshold: 0.45 // se activa cuando ~45% de la imagen está visible
  });

  shines.forEach((el) => observer.observe(el));
});
