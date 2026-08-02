(() => {
    "use strict";

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
        return;
    }

    const blogPage = document.querySelector(".seph-blog-page");

    if (!blogPage) {
        return;
    }

    const parallaxItems = blogPage.querySelectorAll("[data-depth]");
    const tiltCards = blogPage.querySelectorAll("[data-tilt-card]");

    let pointerX = 0;
    let pointerY = 0;
    let scrollY = window.scrollY;
    let animationFrame = null;

    function updateParallax() {
        parallaxItems.forEach((item) => {
            const depth = Number(item.dataset.depth || 0.1);

            const x = pointerX * depth;
            const y = (pointerY + scrollY * 0.08) * depth;

            if (item.classList.contains("hero-symbol")) {
                item.style.setProperty("--symbol-x", `${x}px`);
                item.style.setProperty("--symbol-y", `${y}px`);
            } else {
                item.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            }
        });

        animationFrame = null;
    }

    function requestParallaxUpdate() {
        if (!animationFrame) {
            animationFrame = requestAnimationFrame(updateParallax);
        }
    }

    window.addEventListener("pointermove", (event) => {
        pointerX = event.clientX - window.innerWidth / 2;
        pointerY = event.clientY - window.innerHeight / 2;

        requestParallaxUpdate();
    }, { passive: true });

    window.addEventListener("scroll", () => {
        scrollY = window.scrollY;
        requestParallaxUpdate();
    }, { passive: true });

    tiltCards.forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const bounds = card.getBoundingClientRect();

            const x = event.clientX - bounds.left;
            const y = event.clientY - bounds.top;

            const rotateY = ((x / bounds.width) - 0.5) * 7;
            const rotateX = ((y / bounds.height) - 0.5) * -7;

            card.style.setProperty(
                "--card-rotate-x",
                `${rotateX.toFixed(2)}deg`
            );

            card.style.setProperty(
                "--card-rotate-y",
                `${rotateY.toFixed(2)}deg`
            );
        });

        card.addEventListener("pointerleave", () => {
            card.style.setProperty("--card-rotate-x", "0deg");
            card.style.setProperty("--card-rotate-y", "0deg");
        });
    });
})();
