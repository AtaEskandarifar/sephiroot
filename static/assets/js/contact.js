/**
 * Sephiroot Contact Matrix Dynamic Controller
 */
(function () {
    const SephirootContact = {
        init: function () {
            this.initTypewriter();
            this.initPingSimulator();
            this.initFormSubmit();
        },

        initTypewriter: function () {
            const cmds = [
                { selector: '.typewriter-cmd', text: 'cat developer_nodes.conf' },
                { selector: '.typewriter-cmd-sec', text: './send_payload.sh' }
            ];

            cmds.forEach(item => {
                const el = document.querySelector(item.selector);
                if (!el) return;

                el.textContent = '';
                let index = 0;

                function type() {
                    if (index < item.text.length) {
                        el.textContent += item.text.charAt(index);
                        index++;
                        setTimeout(type, 80 + Math.random() * 50);
                    }
                }
                // شروع تایپ پس از ۵۰۰ میلی‌ثانیه لود اولیه
                setTimeout(type, 500);
            });
        },

        initPingSimulator: function () {
            const pingEl = document.getElementById('ping-stat');
            if (!pingEl) return;

            setInterval(() => {
                const randPing = Math.floor(Math.random() * 25) + 8; // بین ۸ تا ۳۲ میلی‌ثانیه
                pingEl.textContent = `${randPing}ms`;
            }, 3000);
        },

        initFormSubmit: function () {
            const form = document.getElementById("cyber-message-form");
            const feedback = document.getElementById("form-feedback");

            if (!form || !feedback) return;

            form.addEventListener("submit", async (event) => {
                event.preventDefault();

                const submitButton = form.querySelector('button[type="submit"]');
                const buttonText = submitButton?.querySelector(".btn-text");

                setFeedback(
                    feedback,
                    "[i] Encrypting payload and establishing secure channel...",
                    "pending"
                );

                submitButton.disabled = true;

                if (buttonText) {
                    buttonText.textContent = "در حال ارسال...";
                }

                try {
                    const response = await fetch(form.action, {
                        method: "POST",
                        body: new FormData(form),
                        credentials: "same-origin",
                        headers: {
                            "X-Requested-With": "XMLHttpRequest",
                            "Accept": "application/json",
                        },
                    });

                    const data = await response.json();

                    if (!response.ok || !data.success) {
                        const errorMessages = data.errors
                            ? Object.values(data.errors)
                                .flat()
                                .map((item) => item.message)
                                .join(" ")
                            : "ارسال پیام با خطا مواجه شد.";

                        throw new Error(errorMessages);
                    }

                    setFeedback(
                        feedback,
                        "[✓] TRANSMISSION_ACCEPTED — پیام با موفقیت ثبت شد.",
                        "success"
                    );

                    form.reset();
                } catch (error) {
                    // textContent در setFeedback مانع اجرای HTML احتمالی در error.message می‌شود.
                    setFeedback(
                        feedback,
                        `[!] TRANSMISSION_FAILED — ${error.message}`,
                        "error"
                    );
                } finally {
                    submitButton.disabled = false;

                    if (buttonText) {
                        buttonText.textContent = "ارسال سیگنال ارتباطی";
                    }
                }
            });
        }

    };

    // اجرای اسکریپت پس از بارگذاری DOM
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        SephirootContact.init();
    } else {
        document.addEventListener('DOMContentLoaded', () => SephirootContact.init());
    }

    // اکسپورت سراسری جهت کارکرد بدون نقص با Barba.js یا معماری‌های SPA
    window.SephirootContact = SephirootContact;
})();
