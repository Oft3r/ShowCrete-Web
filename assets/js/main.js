document.addEventListener('DOMContentLoaded', () => {

    // 1. Initial Reveal
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('visible');

    // 2. Scroll Observer for Slabs (Sections)
    const observerOptions = {
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(sec => {
        sectionObserver.observe(sec);
    });

    // 3. Construction "Star Wars" Grid Animation
    const constructionLayer = document.getElementById('construction-layer');
    if (constructionLayer) {
        // Clear old beams
        constructionLayer.innerHTML = '';

        // Create the 3D Grids
        const grid1 = document.createElement('div');
        grid1.className = 'infinite-grid';

        const grid2 = document.createElement('div');
        grid2.className = 'infinite-grid-2';

        constructionLayer.appendChild(grid1);
        constructionLayer.appendChild(grid2);
    }

    // Scroll Interaction: Speed up the grid or tilt it based on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        if (constructionLayer) {
            // Move grid pattern based on scroll position
            const grid1 = document.querySelector('.infinite-grid');
            const grid2 = document.querySelector('.infinite-grid-2');

            if (grid1) {
                // Move in Y direction to simulate forward/backward travel
                // The grid is rotated, so moving Y texture looks like moving forward
                grid1.style.backgroundPosition = `0 ${scrolled * 0.5}px`;
                // Keep the tilt
                grid1.style.transform = `rotateX(60deg) translateZ(-100px) translateY(${scrolled * 0.1}px)`;
            }

            if (grid2) {
                // Move slower/faster for parallax
                grid2.style.backgroundPosition = `0 ${scrolled * 0.25}px`;
                grid2.style.transform = `rotateX(60deg) translateZ(-200px) translateY(${scrolled * 0.05}px)`;
            }
        }
    });

    // 4. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle icon
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

});