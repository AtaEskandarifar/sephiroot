(function () {
    "use strict";

    const EducationModule = {
        root: null,
        observers: [],
        cleanupFns: [],
        animationFrame: null,

        init(container = document) {
            this.destroy();

            const root = container.querySelector(".sephi-education-page");

            if (!root) {
                return;
            }

            this.root = root;

            this.initReveal(root);
            this.initSkillBars(root);
            this.initParallax(root);
        },

        destroy() {
            this.observers.forEach((observer) => observer.disconnect());
            this.observers = [];

            this.cleanupFns.forEach((cleanup) => cleanup());
            this.cleanupFns = [];

            if (this.animationFrame) {
                window.cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            }

            if (this.root) {
                this.root.style.removeProperty("--edu-pointer-x");
                this.root.style.removeProperty("--edu-pointer-y");
            }

            this.root = null;
        },

        prefersReducedMotion() {
            return window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;
        },

        initReveal(root) {
            const elements = [
                ...root.querySelectorAll(".reveal-block"),
                ...root.querySelectorAll(".reveal-item"),
                ...root.querySelectorAll(".expertise__single"),
            ];

            if (!elements.length) {
                return;
            }

            if (
                this.prefersReducedMotion() ||
                !("IntersectionObserver" in window)
            ) {
                elements.forEach((element) => {
                    element.classList.add("is-visible");
                });

                return;
            }

            const observer = new IntersectionObserver(
                (entries, currentObserver) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add("is-visible");
                        currentObserver.unobserve(entry.target);
                    });
                },
                {
                    root: null,
                    rootMargin: "0px 0px -8% 0px",
                    threshold: 0.12,
                }
            );

            elements.forEach((element) => observer.observe(element));
            this.observers.push(observer);
        },

        initSkillBars(root) {
            const bars = [...root.querySelectorAll(".progress-bar")];

            if (!bars.length) {
                return;
            }

            bars.forEach((bar) => {
                const ariaValue = Number(bar.getAttribute("aria-valuenow"));
                const inlineWidth = Number.parseFloat(bar.style.width);
                const targetWidth = Number.isFinite(ariaValue)
                    ? ariaValue
                    : inlineWidth || 0;

                bar.dataset.targetWidth = String(targetWidth);
                bar.style.width = "0%";
            });

            const animateBar = (bar) => {
                const targetWidth = Number(bar.dataset.targetWidth || 0);

                window.requestAnimationFrame(() => {
                    bar.style.width = `${targetWidth}%`;
                });
            };

            if (
                this.prefersReducedMotion() ||
                !("IntersectionObserver" in window)
            ) {
                bars.forEach(animateBar);
                return;
            }

            const observer = new IntersectionObserver(
                (entries, currentObserver) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) {
                            return;
                        }

                        const bar = entry.target;

                        if (bar.dataset.animated === "true") {
                            currentObserver.unobserve(bar);
                            return;
                        }

                        bar.dataset.animated = "true";
                        animateBar(bar);
                        currentObserver.unobserve(bar);
                    });
                },
                {
                    root: null,
                    rootMargin: "0px 0px -10% 0px",
                    threshold: 0.25,
                }
            );

            bars.forEach((bar) => observer.observe(bar));
            this.observers.push(observer);
        },

        initParallax(root) {
            const supportsFinePointer = window.matchMedia(
                "(hover: hover) and (pointer: fine)"
            ).matches;

            if (this.prefersReducedMotion() || !supportsFinePointer) {
                return;
            }

            let pointerX = 0;
            let pointerY = 0;
            let targetX = 0;
            let targetY = 0;

            const updateParallax = () => {
                pointerX += (targetX - pointerX) * 0.1;
                pointerY += (targetY - pointerY) * 0.1;

                root.style.setProperty(
                    "--edu-pointer-x",
                    `${pointerX.toFixed(2)}px`
                );

                root.style.setProperty(
                    "--edu-pointer-y",
                    `${pointerY.toFixed(2)}px`
                );

                const hasMovement =
                    Math.abs(targetX - pointerX) > 0.05 ||
                    Math.abs(targetY - pointerY) > 0.05;

                if (hasMovement) {
                    this.animationFrame = window.requestAnimationFrame(
                        updateParallax
                    );
                } else {
                    this.animationFrame = null;
                }
            };

            const requestUpdate = () => {
                if (this.animationFrame) {
                    return;
                }

                this.animationFrame = window.requestAnimationFrame(
                    updateParallax
                );
            };

            const handlePointerMove = (event) => {
                const bounds = root.getBoundingClientRect();

                const relativeX = (event.clientX - bounds.left) / bounds.width;
                const relativeY = (event.clientY - bounds.top) / bounds.height;

                const normalizedX = Math.max(-1, Math.min(1, relativeX * 2 - 1));
                const normalizedY = Math.max(-1, Math.min(1, relativeY * 2 - 1));

                /*
                 * Kept intentionally subtle. CSS applies different movement
                 * multipliers to the background and header layers.
                 */
                targetX = normalizedX * 18;
                targetY = normalizedY * 14;

                requestUpdate();
            };

            const handlePointerLeave = () => {
                targetX = 0;
                targetY = 0;
                requestUpdate();
            };

            root.addEventListener("pointermove", handlePointerMove, {
                passive: true,
            });

            root.addEventListener("pointerleave", handlePointerLeave, {
                passive: true,
            });

            this.cleanupFns.push(() => {
                root.removeEventListener("pointermove", handlePointerMove);
                root.removeEventListener("pointerleave", handlePointerLeave);

                root.style.setProperty("--edu-pointer-x", "0px");
                root.style.setProperty("--edu-pointer-y", "0px");
            });
        },
    };

    window.SephirootEducation = EducationModule;

    document.addEventListener("DOMContentLoaded", () => {
        EducationModule.init(document);
    });
})();
