// Simple Scrollytelling Logic
        const steps = document.querySelectorAll('.step');
        const screens = document.querySelectorAll('.app-screen');
        const phone = document.querySelector('.iphone-bezel');

        // The mock's tab bar used to sit permanently on the first tab while the
        // screen above it changed, so the phone showed the Map with Dashboard
        // lit. Each nav item carries the screen it belongs to and follows along.
        const navItems = document.querySelectorAll('.app-bottom-nav .nav-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove active from all screens
                    screens.forEach(s => s.classList.remove('active'));
                    // Add active to target screen
                    const target = entry.target.dataset.screen;
                    const targetScreen = document.querySelector(`.${target}`);
                    if (targetScreen) targetScreen.classList.add('active');

                    // A step may show a screen that has no tab of its own
                    // (Scrape lives behind the Dashboard quick action);
                    // data-nav names the tab to keep lit in that case.
                    const navTarget = entry.target.dataset.nav || target;
                    navItems.forEach(n =>
                        n.classList.toggle('active', n.dataset.screen === navTarget));
                }
            });
        }, {
            threshold: 0.6 // Trigger when 60% of step is visible
        });

        steps.forEach(step => observer.observe(step));
