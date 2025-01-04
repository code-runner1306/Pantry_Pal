function initNavigation() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");

      // Update aria-expanded attribute
      const isExpanded = navLinks.classList.contains("active");
      mobileMenuBtn.setAttribute("aria-expanded", isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (
        !event.target.closest(".main-nav") &&
        navLinks.classList.contains("active")
      ) {
        navLinks.classList.remove("active");
        mobileMenuBtn.setAttribute("aria-expanded", false);
      }
    });

    // Close menu when window is resized to desktop view
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        mobileMenuBtn.setAttribute("aria-expanded", false);
      }
    });
  }
}
