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

    // 5. Pricing Simulator Logic
    const moduleItems = document.querySelectorAll('.module-item');
    const finalPriceEl = document.getElementById('final-price');
    const savingsBadge = document.getElementById('savings-badge');
    const savingsAmountEl = document.getElementById('savings-amount');
    const btnSelectAll = document.getElementById('btn-select-all');
    const btnRequestQuote = document.getElementById('btn-request-quote');

    if (moduleItems.length > 0 && finalPriceEl) {

        let selectedModules = new Set();
        const BUNDLE_PRICE = 200.00;

        function updatePricing() {
            let currentTotal = 0;

            // Calculate sum of selected
            moduleItems.forEach(item => {
                if (item.classList.contains('selected')) {
                    currentTotal += parseFloat(item.dataset.price);
                }
            });

            let displayPrice = currentTotal;
            let savings = 0;
            let isBundleApplied = false;

            // Check if all are selected manually
            const allSelected = document.querySelectorAll('.module-item.selected').length === moduleItems.length;

            if (currentTotal > BUNDLE_PRICE || allSelected) {
                displayPrice = BUNDLE_PRICE;
                savings = currentTotal - BUNDLE_PRICE;
                isBundleApplied = true;
            }

            // Update UI
            finalPriceEl.textContent = `$${displayPrice.toFixed(2)}`;

            // Savings Badge
            if (isBundleApplied && savings > 0) {
                savingsBadge.classList.remove('hidden');
                savingsBadge.style.display = 'inline-block';
                savingsAmountEl.textContent = `$${savings.toFixed(2)}`;
            } else if (allSelected && savings === 0 && currentTotal === BUNDLE_PRICE) {
                // Case where sum matches bundle exactly
                savingsBadge.classList.add('hidden');
            } else {
                savingsBadge.classList.add('hidden');
                setTimeout(() => {
                    if (savingsBadge.classList.contains('hidden')) savingsBadge.style.display = 'none';
                }, 300);
            }
        }

        // Click Handlers
        moduleItems.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('selected');
                updatePricing();

                // Update "Select All" button text logic could go here
                if (btnSelectAll) {
                    const allSelected = document.querySelectorAll('.module-item.selected').length === moduleItems.length;
                    btnSelectAll.textContent = allSelected ? "Deseleccionar Todo" : "Seleccionar Todo";
                }
            });
        });

        // Select All Button
        if (btnSelectAll) {
            btnSelectAll.addEventListener('click', () => {
                const allSelected = document.querySelectorAll('.module-item.selected').length === moduleItems.length;

                if (allSelected) {
                    // Deselect all
                    moduleItems.forEach(item => item.classList.remove('selected'));
                    btnSelectAll.textContent = "Seleccionar Todo";
                } else {
                    // Select all
                    moduleItems.forEach(item => item.classList.add('selected'));
                    btnSelectAll.textContent = "Deseleccionar Todo";
                }
                updatePricing();
            });
        }

        // Request Quote Button Logic
        if (btnRequestQuote) {
            btnRequestQuote.addEventListener('click', (e) => {
                e.preventDefault(); // Stop default link behavior

                const selectedItems = document.querySelectorAll('.module-item.selected');

                if (selectedItems.length === 0) {
                    alert("Por favor seleccione al menos un módulo para cotizar.");
                    return;
                }

                // Check Bundle Status
                const currentTotal = Array.from(selectedItems).reduce((sum, item) => sum + parseFloat(item.dataset.price), 0);
                const allSelected = selectedItems.length === moduleItems.length;
                const isBundle = currentTotal > BUNDLE_PRICE || allSelected;

                let message = "Hola, equipo Showcrete.\n\nEstoy interesado en adquirir una licencia comercial.\n";

                if (isBundle) {
                    message += "He seleccionado la SUITE COMPLETA (Bundle) con todos los módulos incluidos.\n\n";
                    message += `Inversión estimada: $${BUNDLE_PRICE.toFixed(2)} USD/año\n`;
                } else {
                    message += "Módulos seleccionados:\n";
                    selectedItems.forEach(item => {
                        const name = item.querySelector('.mod-name').textContent;
                        const id = item.querySelector('.mod-id').textContent;
                        const price = item.querySelector('.mod-price').textContent;
                        message += `- [${id}] ${name} (${price})\n`;
                    });
                    message += `\nInversión estimada: $${currentTotal.toFixed(2)} USD/año\n`;
                }

                message += "\nSolicito información sobre métodos de pago y proceso de activación.";

                // Redirect to contact page with message in URL
                const encodedMessage = encodeURIComponent(message);
                window.location.href = `contacto.html?quote=${encodedMessage}`;
            });
        }
    }

    // 6. Contact Page Auto-Fill
    const contactMessage = document.getElementById('contact-message');
    if (contactMessage) {
        const urlParams = new URLSearchParams(window.location.search);
        const quote = urlParams.get('quote');
        if (quote) {
            contactMessage.value = decodeURIComponent(quote);
            contactMessage.readOnly = true; // Prevent editing to avoid fraud
            contactMessage.style.opacity = '0.7'; // Visual indication
            contactMessage.style.cursor = 'not-allowed';

            // Optional: Scroll to form
            contactMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // 7. Interactive Module Grid Animation
    const modulesGrid = document.getElementById('modules-grid');
    if (modulesGrid) {
        const moduleCards = modulesGrid.querySelectorAll('.module-card');

        moduleCards.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                // Prevent triggering if clicking close button
                if (e.target.closest('.close-module-btn')) return;

                // If already expanded, do nothing (close button handles reset)
                if (card.classList.contains('expanded')) return;

                // Expand this card
                // Prevent grid collapse by setting fixed height
                modulesGrid.style.height = `${modulesGrid.offsetHeight}px`;
                modulesGrid.style.minHeight = '600px'; // Ensure enough space for expanded card

                card.classList.add('expanded');

                // Animate other cards into a spiral stack behind
                let spiralIndex = 0;
                moduleCards.forEach((otherCard) => {
                    if (otherCard !== card) {
                        otherCard.classList.add('hidden-stack');
                        // Assign spiral class based on index to create stepped effect
                        // Remove old spiral classes first
                        otherCard.classList.remove('spiral-0', 'spiral-1', 'spiral-2', 'spiral-3', 'spiral-4', 'spiral-5', 'spiral-6', 'spiral-7');
                        otherCard.classList.add(`spiral-${spiralIndex % 8}`);
                        spiralIndex++;
                    }
                });
            });

            // Close Button Logic
            const closeBtn = card.querySelector('.close-module-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent card click event
                    
                    // Reset this card
                    card.classList.remove('expanded');
                    
                    // Reset grid height
                    modulesGrid.style.height = '';
                    modulesGrid.style.minHeight = '';

                    // Reset all other cards
                    moduleCards.forEach(otherCard => {
                        otherCard.classList.remove('hidden-stack');
                        otherCard.classList.remove('spiral-0', 'spiral-1', 'spiral-2', 'spiral-3', 'spiral-4', 'spiral-5', 'spiral-6', 'spiral-7');
                    });
                });
            }
        });
    }

});