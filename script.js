const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const navigationLinks = document.querySelectorAll(".site-nav a");
const revealElements = document.querySelectorAll("[data-reveal]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Ouvrir le menu");
  navigation.classList.remove("is-open");
}

menuButton.addEventListener("click", () => {
  const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isExpanded));
  menuButton.setAttribute("aria-label", isExpanded ? "Ouvrir le menu" : "Fermer le menu");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigationLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  // Reveal sections as they enter the viewport without delaying reduced-motion users.
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

  revealElements.forEach((element) => revealObserver.observe(element));
}

// Keep the navigation's current-section marker in sync while scrolling.
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const activeLink = document.querySelector(`.site-nav a[href="#${entry.target.id}"]`);
    navigationLinks.forEach((link) => link.removeAttribute("aria-current"));
    activeLink?.setAttribute("aria-current", "location");
  });
}, { rootMargin: "-35% 0px -55% 0px" });

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

reducedMotion.addEventListener?.("change", (event) => {
  if (event.matches) revealElements.forEach((element) => element.classList.add("is-visible"));
});

document.documentElement.classList.add("js-ready");