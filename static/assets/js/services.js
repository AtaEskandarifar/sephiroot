/**
 * Sephiroot Portfolio Services Engine
 * (NO GSAP - NO BARBA.JS - 100% NATIVE PERFORMANCE)
 */
(function () {
  let activeTimers = [];
  let activeObservers = [];

  const init = (container = document) => {
    // پاکسازی اتصالات قبلی برای پیشگیری از نشت حافظه در SPAها
    destroy();

    const root = container.querySelector('.sephi-services-page');
    if (!root) return;

    // ۱. افکت ماشین‌نویسی سایبرپانک (Typing Terminal)
    const typeEl = root.querySelector('.svc-typing-text');
    if (typeEl) {
      try {
        const phrases = JSON.parse(typeEl.getAttribute('data-typing'));
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typeEffect = () => {
          const currentPhrase = phrases[phraseIndex];
          if (isDeleting) {
            typeEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
          } else {
            typeEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
          }

          let delay = isDeleting ? 30 : 60;

          if (!isDeleting && charIndex === currentPhrase.length) {
            delay = 2000; // مکس در انتهای تایپ هر لاین
            isDeleting = true;
          } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 500; // مکث کوتاه قبل از لاین بعدی
          }

          const timer = setTimeout(typeEffect, delay);
          activeTimers.push(timer);
        };

        typeEffect();
      } catch (err) {
        console.error("Failed to parse typing logs", err);
      }
    }

    // ۲. پیاده‌سازی IntersectionObserver برای نمایش نرم المان‌ها (Reveal Blocks)
    const revealBlocks = root.querySelectorAll('.reveal-block, .reveal-card');
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealBlocks.forEach(block => {
      block.setAttribute('data-reveal', '');
      revealObserver.observe(block);
    });
    activeObservers.push(revealObserver);

    // ۳. سیستم جابجایی افکت نوری ماوس روی کارت‌ها (Card Spotlight Effect)
    const cards = root.querySelectorAll('.svc-card');
    const handleMouseMove = (e, card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // تعیین موقعیت اورب پس‌زمینه کارت
      const orb = card.querySelector('.svc-card-orb');
      if (orb) {
        orb.style.transform = `translate(${x - rect.width / 2}px, ${y - rect.height / 2}px)`;
        orb.style.opacity = '0.25';
      }
    };

    const handleMouseLeave = (card) => {
      const orb = card.querySelector('.svc-card-orb');
      if (orb) {
        orb.style.transform = '';
        orb.style.opacity = '';
      }
    };

    cards.forEach(card => {
      const onMouseMove = (e) => handleMouseMove(e, card);
      const onMouseLeave = () => handleMouseLeave(card);

      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);

      // ذخیره رفرنس برای متد destroy
      card._onMouseMove = onMouseMove;
      card._onMouseLeave = onMouseLeave;
    });
  };

  const destroy = () => {
    // حذف تمام تایمرهای فعال ماشین‌نویسی
    activeTimers.forEach(timer => clearTimeout(timer));
    activeTimers = [];

    // غیرفعال کردن تمامی آبزرورها
    activeObservers.forEach(obs => obs.disconnect());
    activeObservers = [];

    // بازنشانی رخدادهای ماوس روی کارت‌ها
    const cards = document.querySelectorAll('.svc-card');
    cards.forEach(card => {
      if (card._onMouseMove) card.removeEventListener('mousemove', card._onMouseMove);
      if (card._onMouseLeave) card.removeEventListener('mouseleave', card._onMouseLeave);
    });
  };

  window.SephirootServices = {
    init,
    destroy
  };
})();
