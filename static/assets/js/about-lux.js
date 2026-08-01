document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const aboutPage = document.querySelector("[data-about-page]");
    if (!aboutPage) return;

    const root = aboutPage.querySelector("#aboutLux");
    if (!root) return;

    const tabs = [...root.querySelectorAll(".lux-tab")];
    const panels = [...root.querySelectorAll(".lux-panel")];
    const prev = root.querySelector("#aboutPrev");
    const next = root.querySelector("#aboutNext");
    const progress = root.querySelector("#aboutProgress");
    const counter = root.querySelector("#aboutCounter");
    const nodeLabel = root.querySelector("#panelNode");
    const statusLabel = root.querySelector("#panelStatus");
    const particlesRoot = root.querySelector(".lux-particles");

    if (!tabs.length || !panels.length) return;

    let current = 0;
    let isAnimating = false;

    const statusTexts = [
        "ACTIVE_CONNECTION",
        "APPLICATION_LAYER_READY",
        "THREAT_MONITORING",
        "AUTOMATION_PIPELINE",
        "SECURE_CHANNEL_READY"
    ];

    function createParticles() {
        if (!particlesRoot || particlesRoot.dataset.ready === "true") return;

        particlesRoot.dataset.ready = "true";

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < 26; i++) {
            const particle = document.createElement("span");

            particle.className = "lux-particle";
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.setProperty("--duration", `${3 + Math.random() * 5}s`);
            particle.style.setProperty("--move-x", `${-25 + Math.random() * 50}px`);
            particle.style.setProperty("--move-y", `${-35 + Math.random() * 70}px`);
            particle.style.animationDelay = `${Math.random() * -5}s`;

            fragment.appendChild(particle);
        }

        particlesRoot.appendChild(fragment);
    }

    function render(index) {
        if (isAnimating) return;

        isAnimating = true;
        current = (index + panels.length) % panels.length;

        tabs.forEach((tab, tabIndex) => {
            const active = tabIndex === current;

            tab.classList.toggle("is-active", active);
            tab.setAttribute("aria-selected", String(active));
        });

        panels.forEach((panel, panelIndex) => {
            const active = panelIndex === current;

            panel.classList.toggle("is-active", active);
            panel.setAttribute("aria-hidden", String(!active));
        });

        if (progress) {
            progress.style.width = `${((current + 1) / panels.length) * 100}%`;
        }

        if (counter) {
            counter.textContent =
                `${String(current + 1).padStart(2, "0")} / ${String(panels.length).padStart(2, "0")}`;
        }

        if (nodeLabel) {
            nodeLabel.textContent = `NODE_${String(current + 1).padStart(2, "0")}`;
        }

        if (statusLabel) {
            statusLabel.textContent = statusTexts[current] || statusTexts[0];
        }

        window.setTimeout(() => {
            isAnimating = false;
        }, 420);
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => render(index));
    });

    if (prev) {
        prev.addEventListener("click", () => render(current - 1));
    }

    if (next) {
        next.addEventListener("click", () => render(current + 1));
    }

    root.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            render(current + 1);
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            render(current - 1);
        }

        if (event.key === "Home") {
            event.preventDefault();
            render(0);
        }

        if (event.key === "End") {
            event.preventDefault();
            render(panels.length - 1);
        }
    });

    root.addEventListener("mousemove", (event) => {
        const rect = root.getBoundingClientRect();

        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;

        root.style.setProperty("--mouse-x", `${x}px`);
        root.style.setProperty("--mouse-y", `${y}px`);

        const activePanel = root.querySelector(".lux-panel.is-active");

        if (
            activePanel &&
            window.matchMedia("(prefers-reduced-motion: no-preference)").matches
        ) {
            activePanel.style.setProperty(
                "--panel-shift",
                `translate(${x * -0.18}px, ${y * -0.18}px)`
            );
        }
    });

    root.addEventListener("mouseleave", () => {
        root.style.setProperty("--mouse-x", "0px");
        root.style.setProperty("--mouse-y", "0px");

        const activePanel = root.querySelector(".lux-panel.is-active");

        if (activePanel) {
            activePanel.style.removeProperty("--panel-shift");
        }
    });

    root.addEventListener(
        "wheel",
        (event) => {
            if (Math.abs(event.deltaY) < 20) return;

            event.preventDefault();
            render(event.deltaY > 0 ? current + 1 : current - 1);
        },
        { passive: false }
    );

    createParticles();
    render(0);
});
