// Initialize Lucide icons
lucide.createIcons();

// Mobile menu functionality
const mobileMenuButton = document.querySelector(".mobile-menu");
const navLinks = document.querySelector(".nav-links");

let isMenuOpen = false;

function toggleMenu() {
  isMenuOpen = !isMenuOpen;

  if (isMenuOpen) {
    navLinks.style.display = "flex";
    navLinks.style.flexDirection = "column";
    navLinks.style.position = "absolute";
    navLinks.style.top = "100%";
    navLinks.style.left = "0";
    navLinks.style.right = "0";
    navLinks.style.background = "white";
    navLinks.style.padding = "1rem";
    navLinks.style.boxShadow = "var(--shadow-md)";
  } else {
    navLinks.style.display = "";
    navLinks.style.flexDirection = "";
    navLinks.style.position = "";
    navLinks.style.top = "";
    navLinks.style.left = "";
    navLinks.style.right = "";
    navLinks.style.background = "";
    navLinks.style.padding = "";
    navLinks.style.boxShadow = "";
  }
}

mobileMenuButton.addEventListener("click", toggleMenu);

// Close mobile menu when clicking outside
document.addEventListener("click", (event) => {
  const isClickInsideMenu =
    navLinks.contains(event.target) || mobileMenuButton.contains(event.target);

  if (!isClickInsideMenu && isMenuOpen) {
    toggleMenu();
  }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const section = document.querySelector(this.getAttribute("href"));
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
      // Close mobile menu if open
      if (isMenuOpen) {
        toggleMenu();
      }
    }
  });
});

// Search functionality
const searchInput = document.querySelector(".search-container input");
const searchButton = document.querySelector(".search-container .btn-primary");

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    // Add your search logic here
    console.log("Searching for:", searchTerm);
  }
});

// Enter key for search
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchButton.click();
  }
});

// Add intersection observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Animate sections on scroll
document.querySelectorAll("section").forEach((section) => {
  section.style.opacity = "0";
  section.style.transform = "translateY(20px)";
  section.style.transition = "all 0.6s ease-out";
  observer.observe(section);
});

// Initialize all components
document.addEventListener("DOMContentLoaded", () => {
  // Initialize features
  initFeatures();

  // Initialize navigation
  initNavigation();

  // Set current year in footer
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Initialize smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
});
