(function () {
  "use strict";

  const PricingModule = {
    cleanupFns: [],
    timeoutIds: [],
    gsapCtx: null,
    root: null,

    init(container = document) {
      const root =
          container.querySelector(".sephi-pricing-page") ||
          (container.classList &&
          container.classList.contains("sephi-pricing-page")
              ? container
              : null);

      if (!root) return null;

      this.destroy();
      this.root = root;

      this.initHeroTerminal(root);
      this.initCardTilt(root);
      this.initFeatureTilt(root);
      this.initWorkflow(root);
      this.initEntrance(root);

      return () => this.destroy();
    },

    destroy() {
      this.cleanupFns.forEach((fn) => {
        try { fn(); } catch (e) {}
      });
      this.cleanupFns = [];

      this.timeoutIds.forEach((id) => {
        try { clearTimeout(id); } catch (e) {}
      });
      this.timeoutIds = [];

      if (this.gsapCtx) {
        try { this.gsapCtx.revert(); } catch (e) {}
        this.gsapCtx = null;
      }

      this.root = null;
    },

    typeText(el, text, speed = 30, done) {
      if (!el) return;
      el.textContent = "";
      el.classList.add("typing");

      let i = 0;
      const step = () => {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          const tid = setTimeout(step, speed);
          this.timeoutIds.push(tid);
        } else {
          el.classList.remove("typing");
          if (typeof done === "function") done();
        }
      };

      step();
    },

    clearTyping() {
      this.timeoutIds.forEach((id) => clearTimeout(id));
      this.timeoutIds = [];
    },

    initHeroTerminal(root) {
      const buttons = Array.from(root.querySelectorAll(".cmd-btn"));
      const kicker = root.querySelector("#term-kicker");
      const title = root.querySelector("#term-title");
      const subtitle = root.querySelector("#term-subtitle");
      const command = root.querySelector(".typewriter-cmd");

      if (!buttons.length || !kicker || !title || !subtitle || !command) return;

      const modes = {
        fullstack: {
          command: "execute --service architecture_core",
          kicker: "FULL-STACK // CYBER DEFENSE",
          title: "تعرفه و خدمات ساخت سامانه‌های اختصاصی و زره‌پوش امنیتی",
          subtitle: "توسعه فول‌استک با پایتون و جنگو، ایمن‌سازی لایه‌ای بر پایه استاندارد OWASP Top 10 و پیاده‌سازی زیرساخت‌های مقاوم در برابر نفوذ."
        },
        pentest: {
          command: "execute --service pentest_owasp",
          kicker: "RED TEAM // OWASP PENTEST",
          title: "تعرفه ارزیابی امنیت، تست نفوذ و کشف آسیب‌پذیری",
          subtitle: "شناسایی ضعف‌های بحرانی در وب‌اپلیکیشن، API و سرورها با رویکرد عملیاتی، گزارش فنی و مدیریتی و راهکار Remediation."
        },
        soc: {
          command: "execute --service siem_soc_deploy",
          kicker: "BLUE TEAM // SIEM MONITORING",
          title: "تعرفه پیاده‌سازی SOC و مانیتورینگ زنده تهدیدات",
          subtitle: "راه‌اندازی Splunk SIEM، جمع‌آوری لاگ، طراحی Rule و Alert، داشبوردهای تحلیلی و واکنش سریع در برابر رخدادهای امنیتی."
        }
      };

      const runMode = (modeKey) => {
        const mode = modes[modeKey] || modes.fullstack;

        buttons.forEach((btn) => {
          btn.classList.toggle("active", btn.dataset.mode === modeKey);
        });

        this.clearTyping();

        kicker.textContent = mode.kicker;
        title.textContent = "";
        subtitle.textContent = "";
        command.textContent = "";

        this.typeText(command, mode.command, 20, () => {
          this.typeText(title, mode.title, 28, () => {
            this.typeText(subtitle, mode.subtitle, 14);
          });
        });
      };

      buttons.forEach((btn) => {
        const onClick = () => runMode(btn.dataset.mode || "fullstack");
        btn.addEventListener("click", onClick);
        this.cleanupFns.push(() => btn.removeEventListener("click", onClick));
      });

      this.cleanupFns.push(() => this.clearTyping());

      runMode("fullstack");
    },

    initEntrance(root) {
      if (typeof gsap === "undefined") return;

      this.gsapCtx = gsap.context(() => {
        const hero = root.querySelector(".terminal-window");
        const cards = root.querySelectorAll(".pricing-card");
        const features = root.querySelectorAll(".feature-card");
        const successCards = root.querySelectorAll(".success-card");

        if (hero) {
          gsap.from(hero, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
          });
        }

        if (cards.length) {
          gsap.from(cards, {
            y: 40,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out"
          });
        }

        if (features.length) {
          gsap.from(features, {
            y: 20,
            opacity: 0,
            duration: 0.55,
            stagger: 0.06,
            ease: "power2.out"
          });
        }

        if (successCards.length) {
          gsap.from(successCards, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out"
          });
        }
      }, root);
    },

    initCardTilt(root) {
      const cards = root.querySelectorAll(".pricing-card");
      if (!cards.length || typeof gsap === "undefined") return;

      cards.forEach((card) => {
        const onMove = (e) => {
          if (window.innerWidth < 992) return;

          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(card, {
            rotateX: -(y / 22),
            rotateY: x / 22,
            duration: 0.3,
            ease: "power2.out",
            transformPerspective: 1000,
            overwrite: "auto"
          });
        };

        const onLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.45,
            ease: "power2.out",
            overwrite: "auto"
          });
        };

        card.addEventListener("mousemove", onMove, { passive: true });
        card.addEventListener("mouseleave", onLeave);

        this.cleanupFns.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });
    },

    initFeatureTilt(root) {
      const cards = root.querySelectorAll(".feature-card");
      if (!cards.length || typeof gsap === "undefined") return;

      cards.forEach((card) => {
        const onMove = (e) => {
          if (window.innerWidth < 992) return;

          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;

          gsap.to(card, {
            x: x * 8,
            y: y * 8,
            duration: 0.25,
            ease: "power1.out",
            overwrite: "auto"
          });
        };

        const onLeave = () => {
          gsap.to(card, {
            x: 0,
            y: 0,
            duration: 0.35,
            ease: "power1.out",
            overwrite: "auto"
          });
        };

        card.addEventListener("mousemove", onMove, { passive: true });
        card.addEventListener("mouseleave", onLeave);

        this.cleanupFns.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });
    },

    initWorkflow(root) {
      const steps = root.querySelectorAll(".success-card");
      if (!steps.length || typeof gsap === "undefined") return;

      steps.forEach((step) => {
        const onEnter = () => {
          gsap.to(step, {
            y: -8,
            scale: 1.02,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto"
          });
        };

        const onLeave = () => {
          gsap.to(step, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto"
          });
        };

        step.addEventListener("mouseenter", onEnter);
        step.addEventListener("mouseleave", onLeave);

        this.cleanupFns.push(() => {
          step.removeEventListener("mouseenter", onEnter);
          step.removeEventListener("mouseleave", onLeave);
        });
      });
    }
  };

  window.SephirootPricing = PricingModule;
})();
