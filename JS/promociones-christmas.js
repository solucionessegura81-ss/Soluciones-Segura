(() => {
  const page = document.querySelector(".promotions-page");

  if (!page || page.dataset.season !== "christmas") return;

  page.classList.add("christmas-active");

  const decoration = document.createElement("div");
  decoration.className = "christmas-decoration";
  decoration.setAttribute("aria-hidden", "true");

  const ornamentColors = ["#c62828", "#f6c945", "#167244", "#d63c3c"];
  const snowflakeAmount = window.innerWidth <= 700 ? 28 : 46;

  for (let index = 0; index < snowflakeAmount; index += 1) {
    const snowflake = document.createElement("span");
    snowflake.className = "christmas-snowflake";
    snowflake.textContent = "❄";
    snowflake.style.setProperty("--x", `${Math.random() * 100}%`);
    snowflake.style.setProperty("--size", `${12 + Math.random() * 19}px`);
    snowflake.style.setProperty("--duration", `${8 + Math.random() * 11}s`);
    snowflake.style.setProperty("--delay", `${Math.random() * -18}s`);
    snowflake.style.setProperty("--drift", `${-55 + Math.random() * 110}px`);

    decoration.append(snowflake);
  }

  for (let index = 0; index < 11; index += 1) {
    const ornament = document.createElement("span");
    ornament.className = "christmas-ornament";
    ornament.style.setProperty("--x", `${3 + index * 9.4}%`);
    ornament.style.setProperty("--size", `${26 + Math.random() * 17}px`);
    ornament.style.setProperty(
      "--color",
      ornamentColors[index % ornamentColors.length]
    );
    ornament.style.setProperty("--delay", `${index * -0.3}s`);

    decoration.append(ornament);
  }

  page.prepend(decoration);
})();
