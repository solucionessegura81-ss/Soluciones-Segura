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
   cards = document.querySelectorAll('.card');
  if (!cards.length) return;

  // Solo aplica en dispositivos touch (móvil/tablet)
   isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (!isTouchDevice) return;

  let lastTouchTime = 0;

  cards.forEach(card => {
    card.addEventListener('touchstart', () => {
       now = Date.now();

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
   isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (!isTouch) return;

   cards = Array.from(document.querySelectorAll(".card"));
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

   triggerShine = (card) => {
     now = Date.now();
    if (card === lastCard && now - lastTime < 450) return;

    lastCard = card;
    lastTime = now;

    card.classList.add("is-shining-text");
    setTimeout(() => card.classList.remove("is-shining-text"), 900);
  };

  // Bloquear apertura SOLO en ese toque "mientras bajaba"
   blockClickOnce = (card) => {
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
   header = document.querySelector(".header");
  if (!header) return;

  // Dispara el efecto después de que ya cargó la imagen y fuentes
  setTimeout(() => {
    header.classList.add("is-shining");

    // Limpia la clase para que pueda volver a dispararse si recargas
    setTimeout(() => header.classList.remove("is-shining"), 1400);
  }, 250);
});

(function () {
  const track = document.getElementById("promoTrack");
  const dotsWrap = document.getElementById("promoDots");
  if (!track || !dotsWrap) return;

  const slides = Array.from(track.querySelectorAll(".promo-slider__slide"));
  if (slides.length <= 1) return;

  let index = 0;
  let timer = null;
  const intervalMs = 4500;

  // Crear dots (limpia por si el script se ejecuta 2 veces)
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "promo-slider__dot" + (i === 0 ? " is-active" : "");
    b.setAttribute("aria-label", "Ir a promoción " + (i + 1));
    b.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(b);
  });

  const dots = Array.from(dotsWrap.querySelectorAll(".promo-slider__dot"));

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
  }

  function goTo(i, restart) {
    index = (i + slides.length) % slides.length;
    render();
    if (restart) restartAuto();
  }

  function next() {
    goTo(index + 1, false);
  }

  function startAuto() {
    if (timer) return; // ✅ evita múltiples timers (causa de “saltos” rápidos)
    timer = setInterval(next, intervalMs);
  }

  function stopAuto() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }

  function restartAuto() {
    stopAuto();
    startAuto();
  }

  // Pausa/continúa con interacción (sin duplicar timers)
  dotsWrap.addEventListener("mouseenter", stopAuto);
  dotsWrap.addEventListener("mouseleave", startAuto);

  // En móvil: si toca los dots, no se acelera
  dotsWrap.addEventListener("touchstart", stopAuto, { passive: true });
  dotsWrap.addEventListener("touchend", startAuto);

  // Si la pestaña pierde foco, evita “acumulación” y saltos al volver
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  render();
  startAuto();
})();

// ✅ Re-disparar el "shine" del header cada vez que el logo/header sea visible
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  if (!header) return;

  // Si el usuario prefiere reducir movimiento, no forzamos animaciones
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  // Función que dispara el efecto (reinicia la animación)
  const triggerShine = () => {
    header.classList.remove("is-shining");
    // Forzar reflow para reiniciar animación CSS
    void header.offsetWidth;
    header.classList.add("is-shining");
  };

  // Cada vez que termina la animación, quitamos la clase
  // para que pueda volver a activarse la próxima vez que entre en pantalla
  header.addEventListener("animationend", (e) => {
    if (e.animationName === "shineSweep") {
      header.classList.remove("is-shining");
    }
  });

  // Observa cuando el header entra/sale de la pantalla
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          triggerShine();
        }
      });
    },
    {
      threshold: 0.45, // cuando ~45% del header está visible, dispara
    }
  );

  io.observe(header);
});
