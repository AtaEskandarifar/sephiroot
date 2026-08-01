(function () {
    "use strict";

    const EducationModule = {
        cleanupFns: [],
        observers: [],

        init(container = document) {
            const root = container.querySelector(".sephi-education-page");
            if (!root) return null;

            this.destroy();
            this.root = root;

            this.initReveal(root);
            this.initSkillBars(root);
            this.initTilt(root);

            return () => this.destroy();
        },

        destroy() {
            this.cleanupFns.forEach((fn) => {
                try { fn(); } catch (e) {}
            });
            this.cleanupFns = [];

            this.observers.forEach((observer) => {
                try { observer.disconnect(); } catch (e) {}
            });
            this.observers = [];

            this.root = null;
        },

        initReveal(root) {
            const items = root.querySelectorAll(
                ".single-info-item, .education-timeline, .language-card, .expertise__single"
            );

            if (!items.length) return;

            if (!("IntersectionObserver" in window)) {
                items.forEach((el) => el.classList.add("is-visible"));
                return;
            }

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("is-visible");
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.14,
                    rootMargin: "0px 0px -40px 0px"
                }
            );

            items.forEach((item) => observer.observe(item));
            this.observers.push(observer);
        },

        initSkillBars(root) {
            const bars = root.querySelectorAll(".progress-bar");
            if (!bars.length) return;

            const setTargetWidth = (bar) => {
                const ariaValue = parseInt(bar.getAttribute("aria-valuenow"), 10);
                const inlineWidth = bar.style.width;
                const match = inlineWidth.match(/(\d+)%/);
                const fallback = match ? parseInt(match[1], 10) : 0;
                const target = Number.isFinite(ariaValue) ? ariaValue : fallback;

                bar.dataset.targetWidth = target;
                bar.style.width = "0%";
            };

            bars.forEach(setTargetWidth);

            if (!("IntersectionObserver" in window)) {
                bars.forEach((bar) => {
                    bar.style.width = `${bar.dataset.targetWidth || 0}%`;
                });
                return;
            }

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;

                        const bar = entry.target;
                        const target = bar.dataset.targetWidth || "0";
                        requestAnimationFrame(() => {
                            bar.style.width = `${target}%`;
                        });

                        observer.unobserve(bar);
                    });
                },
                {
                    threshold: 0.35
                }
            );

            bars.forEach((bar) => observer.observe(bar));
            this.observers.push(observer);
        },

        initTilt(root) {
            const cards = root.querySelectorAll(".education-timeline, .language-card, .single-info-item");
            if (!cards.length) return;

            cards.forEach((card) => {
                const handleMove = (e) => {
                    if (window.innerWidth < 992) return;

                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const rotateY = ((x / rect.width) - 0.5) * 5;
                    const rotateX = ((y / rect.height) - 0.5) * -5;

                    card.style.transform =
                        `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
                };

                const handleLeave = () => {
                    card.style.transform = "";
                };

                card.addEventListener("mousemove", handleMove, { passive: true });
                card.addEventListener("mouseleave", handleLeave);

                this.cleanupFns.push(() => {
                    card.removeEventListener("mousemove", handleMove);
                    card.removeEventListener("mouseleave", handleLeave);
                    card.style.transform = "";
                });
            });
        }
    };

    window.SephirootEducation = EducationModule;
})();
