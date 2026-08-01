(function ($) {
  "use strict";

  const SELECTORS = {
    preloader: "#preloader",
    offcanvasOpen: "#offcanvase, .offcanvase",
    offcanvasClose: ".cm-menu-overlay, .cm-close-icon, .cm-menu ul li a.link",
    offcanvasPanels: ".cm-offcanvase, .cm-menu-inner",
    offcanvasInner: ".cm-menu-inner, .cm-offcanvase",
    themeToggle: "#theme-mode, #theme-mode-2",
    activeLinks: ".link",
    svgImages: "img.svg",
    testimonialSlider: ".cm-testimonial",
    projectSlider: ".project-slider",
    parallaxCard: ".parallax-page"
  };

  const PAGE_CLASSES = [
    "page-home",
    "page-about",
    "page-services",
    "page-education",
    "page-pricing"
  ];

  const STORAGE_KEYS = { theme: "axz-portfolio" };

  const SephirootHome = {
    init() {
      const cards = document.querySelectorAll(SELECTORS.parallaxCard);
      if (!cards.length) return;

      cards.forEach((card) => {
        card.style.willChange = "transform";
        card.style.transformStyle = "preserve-3d";

        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const rotateX = Math.max(-12, Math.min(12, -(y / 20)));
          const rotateY = Math.max(-12, Math.min(12, x / 20));

          card.style.transform =
              `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener("mouseleave", () => {
          card.style.transform =
              "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
        });
      });
    }
  };

  const App = {
    init() {
      this.initGlobalUI();
      this.initThemeSwitcher();
      this.applyStoredTheme();
      this.setActiveLinks();
      this.injectSVGs();
      this.initSwipers();
      this.initPageModules();
    },

    initGlobalUI() {
      $(window).on("load", () => $(SELECTORS.preloader).fadeOut(500));
      $(document).on("click", SELECTORS.offcanvasClose, () =>
          $(SELECTORS.offcanvasPanels).removeClass("cm-active")
      );
      $(document).on("click", SELECTORS.offcanvasOpen, () =>
          $(SELECTORS.offcanvasInner).addClass("cm-active")
      );
    },

    applyStoredTheme() {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
      if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
    },

    initThemeSwitcher() {
      $(document).on("click", SELECTORS.themeToggle, () => {
        const next =
            document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem(STORAGE_KEYS.theme, next);
      });
    },

    setActiveLinks() {
      const path = window.location.pathname.replace(/\/+$/, "") || "/";
      document.querySelectorAll(SELECTORS.activeLinks).forEach((link) => {
        const href = link.getAttribute("href")?.replace(/\/+$/, "") || "/";
        link.classList.toggle("active", href === path);
      });
    },

    injectSVGs() {
      if (typeof SVGInject !== "undefined") {
        const svgs = document.querySelectorAll(SELECTORS.svgImages);
        if (svgs.length) SVGInject(svgs);
      }
    },

    initSwipers() {
      if (typeof Swiper === "undefined") return;

      const testimonial = document.querySelector(SELECTORS.testimonialSlider);
      if (testimonial) {
        new Swiper(testimonial, {
          slidesPerView: 2,
          spaceBetween: 25,
          loop: true,
          pagination: { el: ".pagination__dot", clickable: true },
          breakpoints: { 1200: { slidesPerView: 2 }, 320: { slidesPerView: 1 } }
        });
      }

      const project = document.querySelector(SELECTORS.projectSlider);
      if (project) {
        new Swiper(project, {
          slidesPerView: 3,
          spaceBetween: 25,
          loop: true,
          breakpoints: {
            1200: { slidesPerView: 3 },
            768: { slidesPerView: 2 },
            320: { slidesPerView: 1 }
          }
        });
      }
    },

    hasPageClass(name) {
      return document.body.classList.contains(name);
    },

    initPageModules() {
      if (this.hasPageClass("page-home")) {
        SephirootHome.init();
      }
      if (this.hasPageClass("page-about") && window.SephirootLuxDashboard) {
        window.SephirootLuxDashboard.init(document);
      }
      if (this.hasPageClass("page-services") && window.SephirootServices) {
        window.SephirootServices.init(document);
      }
      if (this.hasPageClass("page-education") && window.SephirootEducation) {
        window.SephirootEducation.init(document);
      }
      if (this.hasPageClass("page-pricing") && window.SephirootPricing) {
        window.SephirootPricing.init(document);
      }
    }
  };

  $(document).ready(() => App.init());
})(jQuery);
