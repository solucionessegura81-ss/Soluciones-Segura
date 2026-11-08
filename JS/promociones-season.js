(() => {
  const season = {
    enabled: true,
    theme: "black-friday"
  };

  if (!season.enabled || season.theme !== "black-friday") return;

  document.body.classList.add("black-friday-active");

  const decoration = document.createElement("div");
  decoration.className = "bf-decoration";
  decoration.setAttribute("aria-hidden", "true");

  const colors = ["#ffc500", "#ffffff", "#f59e0b"];

  for (let index = 0; index < 24; index += 1) {
    const particle = document.createElement("span");
    particle.className = "bf-particle";
    particle.style.setProperty("--x", `${Math.random() * 100}%`);
    particle.style.setProperty("--size", `${5 + Math.random() * 10}px`);
    particle.style.setProperty("--duration", `${8 + Math.random() * 8}s`);
    particle.style.setProperty("--delay", `${-Math.random() * 12}s`);
    particle.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
    particle.style.setProperty(
      "--color",
      colors[Math.floor(Math.random() * colors.length)]
    );
    decoration.append(particle);
  }

  document.body.prepend(decoration);
})();
