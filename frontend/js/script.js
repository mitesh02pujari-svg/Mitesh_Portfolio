const API_BASE_URL = "http://localhost:5000";

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const navLinksList = document.querySelectorAll(".nav-links a");
const navbar = document.querySelector(".navbar");
const revealItems = document.querySelectorAll(".reveal");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("show");
  });

  navLinksList.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

const setActiveNavLink = () => {
  const sections = [...document.querySelectorAll("main section[id]")];
  let currentSection = "home";

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 180 && rect.bottom >= 180) currentSection = section.id;
  });

  navLinksList.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentSection}`;
    link.classList.toggle("active", isActive);
  });
};

const handleScrollEffects = () => {
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 12);
  setActiveNavLink();
};

window.addEventListener("scroll", handleScrollEffects, { passive: true });
window.addEventListener("load", handleScrollEffects);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const contactFormStatus = document.getElementById("contactFormStatus");
  const contactSubmitButton = contactForm.querySelector('button[type="submit"]');
  const contactSubmitButtonText = contactSubmitButton ? contactSubmitButton.textContent.trim() : "Send Message";

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fields = ["name", "email", "subject", "message"];
    const payload = {};

    for (const field of fields) {
      const input = contactForm.elements.namedItem(field);
      payload[field] = input.value.trim();

      if (!payload[field]) {
        input.setCustomValidity("Please complete this field.");
        input.reportValidity();
        input.setCustomValidity("");
        input.focus();
        return;
      }
    }

    if (contactFormStatus) contactFormStatus.textContent = "";
    if (contactSubmitButton) { contactSubmitButton.disabled = true; contactSubmitButton.textContent = "Sending..."; }

    try {
      let response;
      try {
        response = await fetch(`${API_BASE_URL}/api/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch {
        if (contactFormStatus) contactFormStatus.textContent = "Unable to connect to the server. Please try again later.";
        return;
      }

      let result;
      try {
        result = await response.json();
      } catch {
        if (contactFormStatus) contactFormStatus.textContent = "Unable to send your message right now. Please try again.";
        return;
      }

      if (!response.ok || !result || result.success !== true) {
        if (contactFormStatus) contactFormStatus.textContent = "Unable to send your message right now. Please try again.";
        return;
      }

      contactForm.reset();
      if (contactFormStatus) contactFormStatus.textContent = "Message sent successfully. I'll get back to you soon.";
    } finally {
      if (contactSubmitButton) {
        contactSubmitButton.disabled = false;
        contactSubmitButton.textContent = contactSubmitButtonText;
      }
    }
  });
}
