(function () {
  "use strict";

  const PricingModule = {
    cleanupFns: [],
    timeoutIds: [],
    observers: [],
    root: null,

    packages: {
      corporate: {
        bronze: {
          command: "inspect --package personal_branding --tier=bronze",
          kicker: "BRONZE // PERSONAL BRANDING",
          title: "وب سایت شخصی، رزومه و برندینگ حرفه ای",
          description:
              "برای متخصصانی که به یک پایگاه دیجیتال سریع، مستقل و قابل اعتماد نیاز دارند. تمرکز این پکیج بر نمایش اعتبار حرفه ای، رزومه، خدمات و نمونه کارها با طراحی اختصاصی است.",
          price: "۵۹,۰۰۰,۰۰۰ تومان",
          duration: "۱۵ تا ۳۰ روز کاری",
          support: "۱ ماه پشتیبانی فنی",
          deliverables: [
            "طراحی UI/UX اختصاصی و واکنش گرا",
            "صفحه رزومه، خدمات و نمونه کار",
            "فرم تماس ایمن با محافظت Anti-Spam",
            "بهینه سازی پایه SEO و Core Web Vitals"
          ]
        },
        silver: {
          command: "inspect --package business_presence --tier=silver",
          kicker: "SILVER // BUSINESS PRESENCE",
          title: "وب سایت شرکتی و معرفی خدمات چندلایه",
          description:
              "برای شرکت ها، کلینیک ها و مجموعه هایی که به معرفی ساختاریافته خدمات، مخاطب بین المللی و پنل دسترسی امن مشتریان نیاز دارند.",
          price: "۸۹,۰۰۰,۰۰۰ تومان",
          duration: "۳۰ تا ۴۵ روز کاری",
          support: "۳ ماه پشتیبانی فنی",
          deliverables: [
            "تمام قابلیت های پکیج شخصی",
            "ساختار چندزبانه قابل توسعه",
            "کاتالوگ آنلاین خدمات و محصولات",
            "ورود امن مشتریان با OTP یا SMS"
          ]
        },
        gold: {
          command: "inspect --package enterprise_platform --tier=gold",
          kicker: "GOLD // DJANGO ENTERPRISE",
          title: "سامانه اختصاصی Django و داشبورد مدیریتی",
          description:
              "برای پروژه هایی که با یک وب سایت معرفی ساده حل نمی شوند و نیازمند منطق اختصاصی، API، داشبورد عملیاتی، کنترل دسترسی و زیرساخت Production هستند.",
          price: "از ۱۹۹,۰۰۰,۰۰۰ تومان",
          duration: "۳۰ تا ۶۰ روز کاری",
          support: "۵ ماه پشتیبانی فنی و امنیتی",
          deliverables: [
            "معماری اختصاصی Python و Django REST",
            "پنل مدیریت و نقش های کاربری سفارشی",
            "استقرار امن با Nginx و SSL/TLS",
            "ارزیابی اولیه OWASP پیش از تحویل"
          ]
        }
      },

      commerce: {
        store: {
          command: "inspect --package django_store --mode=single_vendor",
          kicker: "E-COMMERCE // SINGLE STORE",
          title: "فروشگاه اختصاصی با هسته Django",
          description:
              "برای فروشگاه های مستقل که به عملکرد پایدار، مدیریت محصول و سفارش، پرداخت امن و آمادگی برای اتصال به کانال های فروش نیاز دارند.",
          price: "۱۰۵,۰۰۰,۰۰۰ تومان",
          duration: "۴۰ تا ۶۰ روز کاری",
          support: "۶ ماه پشتیبانی فنی و امنیتی",
          deliverables: [
            "مدیریت محصول، سفارش، انبار و فاکتور",
            "درگاه پرداخت زرین پال با اعتبارسنجی Callback",
            "اتصال پیامکی وضعیت سفارش",
            "آمادگی اتصال به ترب، ایمالز و باسلام"
          ]
        },
        marketplace: {
          command: "inspect --package marketplace_core --mode=multi_vendor",
          kicker: "MARKETPLACE // MULTI VENDOR",
          title: "پلتفرم چندفروشندگی مقیاس پذیر",
          description:
              "برای کسب و کارهایی با فروشندگان متعدد، مدل کمیسیون، تسویه حساب، پنل مجزای فروشنده و نیازهای پردازشی سنگین.",
          price: "از ۲۹۹,۰۰۰,۰۰۰ تومان",
          duration: "۹۰ تا ۱۲۰ روز کاری",
          support: "۱ سال پشتیبانی اختصاصی",
          deliverables: [
            "پنل مرکزی مدیریت و پنل فروشندگان",
            "مدل کمیسیون، تسویه و گزارش های مالی",
            "صف بندی پردازش ها با Celery Queue",
            "طراحی زیرساخت قابل رشد پس از تحلیل نیازمندی"
          ]
        }
      },

      security: {
        pentest: {
          command: "run --assessment owasp_pentest --scope=authorized",
          kicker: "RED TEAM // AUTHORIZED PENTEST",
          title: "ارزیابی امنیت و تست نفوذ مجاز وب اپلیکیشن",
          description:
              "ارزیابی هدفمند وب اپلیکیشن، API و سرویس های در محدوده مجاز پروژه برای شناسایی آسیب پذیری های قابل بهره برداری و اولویت بندی اصلاح آن ها.",
          price: "از ۷۹,۵۰۰,۰۰۰ تومان",
          duration: "۷ تا ۱۵ روز کاری",
          support: "گزارش + یک مرحله Re-test",
          deliverables: [
            "آزمون بر مبنای OWASP Top 10",
            "بررسی کنترل دسترسی و منطق کسب و کار",
            "گزارش فنی و مدیریتی با سطح ریسک",
            "راهنمای Remediation و تست مجدد توافق شده"
          ]
        },
        soc: {
          command: "deploy --siem splunk --mode=soc_foundation",
          kicker: "BLUE TEAM // SPLUNK SIEM",
          title: "پیاده سازی Splunk SIEM و پایه مانیتورینگ SOC",
          description:
              "طراحی و راه اندازی مسیر جمع آوری لاگ، داشبوردهای عملیاتی، Alertهای اولیه و کانال های هشداردهی برای دید بهتر نسبت به رخدادهای امنیتی.",
          price: "نیازمند برآورد زیرساخت",
          duration: "پس از بررسی محیط",
          support: "مستندسازی و تحویل عملیاتی",
          deliverables: [
            "نصب و پیکربندی Splunk Enterprise",
            "دریافت لاگ Linux، Nginx، Django و دیتابیس",
            "Rule و Alert برای الگوهای پرخطر اولیه",
            "داشبورد و هشدار تلگرام یا ایمیل"
          ]
        }
      }
    },

    init(container = document) {
      this.destroy();

      const root =
          container.querySelector(".sephi-pricing-page") ||
          (container.classList &&
          container.classList.contains("sephi-pricing-page")
              ? container
              : null);

      if (!root) {
        return null;
      }

      this.root = root;

      this.initHeroTerminal(root);
      this.initServiceTerminals(root);
      this.initReveal(root);
      this.initHoverEffects(root);

      return () => this.destroy();
    },

    destroy() {
      this.observers.forEach((observer) => observer.disconnect());
      this.observers = [];

      this.cleanupFns.forEach((cleanup) => {
        try {
          cleanup();
        } catch (error) {
          /* Cleanup must not block the rest of the page lifecycle. */
        }
      });
      this.cleanupFns = [];

      this.timeoutIds.forEach((id) => window.clearTimeout(id));
      this.timeoutIds = [];

      this.root = null;
    },

    prefersReducedMotion() {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },

    queueTimeout(callback, delay) {
      const timeoutId = window.setTimeout(() => {
        this.timeoutIds = this.timeoutIds.filter((id) => id !== timeoutId);
        callback();
      }, delay);

      this.timeoutIds.push(timeoutId);
      return timeoutId;
    },

    typeText(element, text, speed, done) {
      if (!element) {
        return;
      }

      if (this.prefersReducedMotion()) {
        element.textContent = text;
        if (typeof done === "function") {
          done();
        }
        return;
      }

      element.textContent = "";

      let index = 0;

      const step = () => {
        if (index >= text.length) {
          if (typeof done === "function") {
            done();
          }
          return;
        }

        element.textContent += text.charAt(index);
        index += 1;
        this.queueTimeout(step, speed);
      };

      step();
    },

    initHeroTerminal(root) {
      const buttons = Array.from(root.querySelectorAll(".cmd-btn"));
      const kicker = root.querySelector("#term-kicker");
      const title = root.querySelector("#term-title");
      const subtitle = root.querySelector("#term-subtitle");
      const command = root.querySelector(".typewriter-cmd");

      if (!buttons.length || !kicker || !title || !subtitle || !command) {
        return;
      }

      const modes = {
        fullstack: {
          command: "execute --service architecture_core",
          kicker: "FULL-STACK // CYBER DEFENSE",
          title: "تعرفه و خدمات ساخت سامانه های اختصاصی و امن",
          subtitle:
              "توسعه فول استک با Python و Django، طراحی زیرساخت Production و پیاده سازی کنترل های امنیتی متناسب با نیاز پروژه."
        },
        pentest: {
          command: "execute --service pentest_owasp",
          kicker: "RED TEAM // AUTHORIZED PENTEST",
          title: "تعرفه ارزیابی امنیت و تست نفوذ مجاز",
          subtitle:
              "شناسایی و اولویت بندی آسیب پذیری های وب اپلیکیشن، API و سرویس های در محدوده توافق شده همراه با گزارش و راهکار اصلاح."
        },
        soc: {
          command: "execute --service splunk_siem_soc",
          kicker: "BLUE TEAM // SIEM MONITORING",
          title: "تعرفه پیاده سازی Splunk SIEM و مانیتورینگ",
          subtitle:
              "راه اندازی جمع آوری لاگ، داشبوردهای تحلیلی، Rule و Alertهای پایه برای افزایش دید امنیتی تیم شما."
        }
      };

      const runMode = (modeKey) => {
        const mode = modes[modeKey] || modes.fullstack;

        this.timeoutIds.forEach((id) => window.clearTimeout(id));
        this.timeoutIds = [];

        buttons.forEach((button) => {
          button.classList.toggle("active", button.dataset.mode === modeKey);
        });

        kicker.textContent = mode.kicker;
        title.textContent = "";
        subtitle.textContent = "";
        command.textContent = "";

        this.typeText(command, mode.command, 16, () => {
          this.typeText(title, mode.title, 18, () => {
            this.typeText(subtitle, mode.subtitle, 9);
          });
        });
      };

      buttons.forEach((button) => {
        const handleClick = () => runMode(button.dataset.mode || "fullstack");

        button.addEventListener("click", handleClick);
        this.cleanupFns.push(() => {
          button.removeEventListener("click", handleClick);
        });
      });

      runMode("fullstack");
    },

    initServiceTerminals(root) {
      const terminals = root.querySelectorAll("[data-service-terminal]");

      terminals.forEach((terminal) => {
        const serviceName = terminal.dataset.serviceTerminal;
        const packageData = this.packages[serviceName];

        if (!packageData) {
          return;
        }

        const buttons = Array.from(
            terminal.querySelectorAll(".service-package-btn")
        );

        const command = terminal.querySelector(".service-terminal__command-text");
        const kicker = terminal.querySelector(".service-terminal__kicker");
        const title = terminal.querySelector(".service-terminal__title");
        const description = terminal.querySelector(
            ".service-terminal__description"
        );
        const price = terminal.querySelector(".service-terminal__price");
        const duration = terminal.querySelector(".service-terminal__duration");
        const support = terminal.querySelector(".service-terminal__support");
        const deliverables = terminal.querySelector(
            ".service-terminal__deliverables"
        );

        const updateTerminal = (packageKey) => {
          const selectedPackage = packageData[packageKey];

          if (!selectedPackage) {
            return;
          }

          buttons.forEach((button) => {
            const isActive = button.dataset.packageKey === packageKey;

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-selected", String(isActive));
          });

          command.textContent = selectedPackage.command;
          kicker.textContent = selectedPackage.kicker;
          title.textContent = selectedPackage.title;
          description.textContent = selectedPackage.description;
          price.textContent = selectedPackage.price;
          duration.textContent = selectedPackage.duration;
          support.textContent = selectedPackage.support;

          deliverables.replaceChildren();

          selectedPackage.deliverables.forEach((item) => {
            const listItem = document.createElement("li");
            listItem.textContent = item;
            deliverables.appendChild(listItem);
          });
        };

        buttons.forEach((button) => {
          const handleClick = () => {
            updateTerminal(button.dataset.packageKey);
          };

          button.addEventListener("click", handleClick);

          this.cleanupFns.push(() => {
            button.removeEventListener("click", handleClick);
          });
        });

        const initialButton =
            terminal.querySelector(".service-package-btn.active") || buttons[0];

        if (initialButton) {
          updateTerminal(initialButton.dataset.packageKey);
        }
      });
    },

    initReveal(root) {
      const elements = root.querySelectorAll(
          ".terminal-window, .pricing-section, .calculator-section, .security-features-section"
      );

      if (!elements.length) {
        return;
      }

      if (
          this.prefersReducedMotion() ||
          !("IntersectionObserver" in window)
      ) {
        elements.forEach((element) => {
          element.classList.add("pricing-is-visible");
        });
        return;
      }

      elements.forEach((element) => {
        element.classList.add("pricing-reveal");
      });

      const observer = new IntersectionObserver(
          (entries, activeObserver) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                return;
              }

              entry.target.classList.add("pricing-is-visible");
              activeObserver.unobserve(entry.target);
            });
          },
          {
            root: null,
            rootMargin: "0px 0px -8% 0px",
            threshold: 0.08
          }
      );

      elements.forEach((element) => observer.observe(element));
      this.observers.push(observer);
    },

    initHoverEffects(root) {
      const hoverItems = root.querySelectorAll(
          ".pricing-card, .feature-card, .success-card"
      );

      const supportsHover = window.matchMedia(
          "(hover: hover) and (pointer: fine)"
      ).matches;

      if (!supportsHover || this.prefersReducedMotion()) {
        return;
      }

      hoverItems.forEach((item) => {
        const onEnter = () => item.classList.add("pricing-hovered");
        const onLeave = () => item.classList.remove("pricing-hovered");

        item.addEventListener("pointerenter", onEnter);
        item.addEventListener("pointerleave", onLeave);

        this.cleanupFns.push(() => {
          item.removeEventListener("pointerenter", onEnter);
          item.removeEventListener("pointerleave", onLeave);
        });
      });
    }
  };

  window.SephirootPricing = PricingModule;

  document.addEventListener("DOMContentLoaded", () => {
    PricingModule.init(document);
  });
})();
