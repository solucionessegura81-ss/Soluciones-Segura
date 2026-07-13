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

(function () {
  const track = document.getElementById("promoTrack");
  const dotsWrap = document.getElementById("promoDots");
  if (!track || !dotsWrap) return;

  const sliderBox = track.closest(".promo-slider__box");

  track.querySelectorAll("[data-promo-clone='true']").forEach((clone) => clone.remove());

  const slides = Array.from(track.querySelectorAll(".promo-slider__slide"));
  if (slides.length <= 1) return;

  const totalSlides = slides.length;
  const firstClone = slides[0].cloneNode(true);

  firstClone.dataset.promoClone = "true";
  firstClone.setAttribute("aria-hidden", "true");
  track.appendChild(firstClone);

  let index = 0;
  let timer = null;
  const intervalMs = 4500;

  dotsWrap.innerHTML = "";

  slides.forEach((_, i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "promo-slider__dot" + (i === 0 ? " is-active" : "");
    button.setAttribute("aria-label", "Ir a promoción " + (i + 1));
    button.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(button);
  });

  const dots = Array.from(dotsWrap.querySelectorAll(".promo-slider__dot"));

  function setTransition(enabled) {
    track.style.transition = enabled ? "transform 0.45s ease" : "none";
  }

  function render(animated = true) {
    setTransition(animated);
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index % totalSlides));
  }

  function goTo(newIndex, restart) {
    index = newIndex;
    render(true);

    if (restart) restartAuto();
  }

  function next() {
    goTo(index + 1, false);
  }

  track.addEventListener("transitionend", () => {
    if (index === totalSlides) {
      index = 0;
      render(false);
      void track.offsetWidth;
      setTransition(true);
    }
  });

  function startAuto() {
    if (timer) return;
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

  if (sliderBox) {
    sliderBox.addEventListener("mouseenter", stopAuto);
    sliderBox.addEventListener("mouseleave", startAuto);

    sliderBox.addEventListener("touchstart", stopAuto, { passive: true });
    sliderBox.addEventListener("touchend", startAuto);
    sliderBox.addEventListener("touchcancel", startAuto);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  render(false);
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

// ===== CERRAR PROMO FLOTANTE =====

window.addEventListener("load", () => {

  const cerrarPromo = document.getElementById("cerrarPromo");
  const promoFlotante = document.getElementById("promoFlotante");

  if(cerrarPromo && promoFlotante){

    cerrarPromo.addEventListener("click", () => {
      promoFlotante.remove();
    });

  }

});

// ===== Ordenar productos por precio: menor a mayor =====
document.addEventListener("DOMContentLoaded", () => {
  const grids = document.querySelectorAll(".productos-grid");
  if (!grids.length) return;

  const getPriceValue = (card) => {
    const priceElement = card.querySelector(".producto-card__precio");
    if (!priceElement) return Number.MAX_SAFE_INTEGER;

    const text = priceElement.textContent.trim();

    // Si dice "Consultar precio", lo manda al final
    if (/consultar/i.test(text)) return Number.MAX_SAFE_INTEGER;

    // Toma el primer precio encontrado, útil para rangos como ₡39.800 - ₡45.500
    const match = text.match(/[\d.]+/);
    if (!match) return Number.MAX_SAFE_INTEGER;

    return Number(match[0].replace(/\./g, ""));
  };

  grids.forEach((grid) => {
    const cards = Array.from(grid.querySelectorAll(".producto-card"));

    cards
      .sort((a, b) => getPriceValue(a) - getPriceValue(b))
      .forEach((card) => grid.appendChild(card));
  });
});
