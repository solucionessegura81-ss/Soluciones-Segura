(() => {
  const initializePromotionZoom = () => {
    const cards = Array.from(document.querySelectorAll(".promotion-card"));

    if (!cards.length) return;

    const modal = document.createElement("div");
    modal.className = "promotion-modal";
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
      <div class="promotion-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="promotionModalTitle">
        <h2 id="promotionModalTitle" class="promotion-modal__sr-only">Promoción ampliada</h2>

        <button class="promotion-modal__close" type="button" aria-label="Cerrar imagen ampliada">
          ×
        </button>

        <img class="promotion-modal__image" alt="">

        <a class="promotion-modal__whatsapp" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
          Consultar este producto
        </a>

        <p class="promotion-modal__hint">
          Tocá la imagen nuevamente para cerrarla.
        </p>
      </div>
    `;

    document.body.append(modal);

    const modalImage = modal.querySelector(".promotion-modal__image");
    const closeButton = modal.querySelector(".promotion-modal__close");
    const whatsappButton = modal.querySelector(".promotion-modal__whatsapp");
    let activeCard = null;

    const closeModal = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("promotion-modal-open");
      modalImage.removeAttribute("src");

      if (activeCard) {
        activeCard.focus();
      }
    };

    const openModal = (card) => {
      const image = card.querySelector("img");

      if (!image) return;

      activeCard = card;
      modalImage.src = image.currentSrc || image.src;
      modalImage.alt = image.alt;
      whatsappButton.href = card.href;

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("promotion-modal-open");
      closeButton.focus();
    };

    cards.forEach((card) => {
      card.addEventListener("click", (event) => {
        event.preventDefault();
        openModal(card);
      });
    });

    closeButton.addEventListener("click", closeModal);

    modalImage.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePromotionZoom, { once: true });
  } else {
    initializePromotionZoom();
  }
})();
