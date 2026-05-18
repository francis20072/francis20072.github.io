const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");
const audioPlayers = document.querySelectorAll("audio");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const themeText = document.querySelector(".theme-text");

function applyTheme(theme) {
  const isLight = theme === "light";

  document.body.classList.toggle("light-theme", isLight);
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute("aria-label", isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro");
  themeIcon.textContent = isLight ? "☾" : "☀";
  themeText.textContent = isLight ? "Oscuro" : "Claro";
  localStorage.setItem("theme", theme);
}

function setActiveLink() {
  const scrollPosition = window.scrollY + 140;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${section.id}`);
      });
    }
  });
}

audioPlayers.forEach((player) => {
  player.addEventListener("play", () => {
    audioPlayers.forEach((otherPlayer) => {
      if (otherPlayer !== player) {
        otherPlayer.pause();
      }
    });
  });
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
  applyTheme(nextTheme);
});

applyTheme(localStorage.getItem("theme") || "dark");
window.addEventListener("scroll", setActiveLink);
setActiveLink();
