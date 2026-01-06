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
        const frp = urlParams.get('frp');
        if (quote) {
            contactMessage.value = decodeURIComponent(quote);
            contactMessage.readOnly = true; // Prevent editing to avoid fraud
            contactMessage.style.opacity = '0.7'; // Visual indication
            contactMessage.style.cursor = 'not-allowed';

            // Optional: Scroll to form
            contactMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (frp) {
            contactMessage.value = "Solicito información acerca del nuevo producto Showcrete FRP para el cálculo de refuerzo con polímeros de fibra.";
            // Do not make it read-only, allow editing

            // Optional: Scroll to form
            contactMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // 6.5 Contact Form Submission (Formspree Integration)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // Get form data
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;

            // Check if Backend is configured
            if (typeof ShowcreteConfig === 'undefined' || ShowcreteConfig.formspree.endpoint.includes('YOUR_FORM_ID') || ShowcreteConfig.formspree.endpoint === '') {
                // Fallback to mailto if not configured yet
                const recipient = "jdelsol.cu@gmail.com";
                const subject = `Consulta Web: ${name}`;
                const body = `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`;
                const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.location.href = mailtoLink;
                alert("Configuración de envío pendiente. Se abrirá su cliente de correo.");
                return;
            }

            // Visual feedback: Loading state
            submitBtn.disabled = true;
            submitBtn.textContent = "Enviando...";
            submitBtn.style.opacity = "0.5";

            // Prepare data for Google Apps Script (URLSearchParams is more reliable for GAS)
            const params = new URLSearchParams();
            params.append('name', name);
            params.append('email', email);
            params.append('message', message);
            params.append('_subject', `Consulta Web: ${name}`);

            // Send via Fetch API
            fetch(ShowcreteConfig.formspree.endpoint, {
                method: 'POST',
                body: params,
                mode: 'no-cors', // Try no-cors to bypass strict CORS if testing locally
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => {
                // Custom Notification
                showNotification("¡Mensaje enviado con éxito!", "Nos pondremos en contacto pronto para atender su consulta técnica.", "success");
                contactForm.reset();
            }).catch(error => {
                // Network error
                console.error("Detailed Error:", error);
                showNotification("Error al enviar", "Por favor, verifique su conexión o intente más tarde.", "error");
            }).finally(() => {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                submitBtn.style.opacity = "1";
            });
        });
    }

    // 7. Module Modal Logic (Informacion Page)
    const moduleCards = document.querySelectorAll('.module-card');
    const modal = document.getElementById('module-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');

    if (moduleCards.length > 0 && modal) {
        moduleCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                const title = card.querySelector('h3').textContent;
                const number = card.querySelector('.feature-number').textContent;
                const description = card.querySelector('p').textContent;
                const imgSrc = card.querySelector('img').src;

                // Circular Animation Effect
                moduleCards.forEach((c, i) => {
                    if (c !== card) {
                        const angle = (i / moduleCards.length) * Math.PI * 2;
                        const radius = 500;
                        const tx = Math.cos(angle) * radius;
                        const ty = Math.sin(angle) * radius;
                        const tr = (i / moduleCards.length) * 360;
                        
                        c.style.setProperty('--tx', `${tx}px`);
                        c.style.setProperty('--ty', `${ty}px`);
                        c.style.setProperty('--tr', `${tr}deg`);
                        c.classList.add('animating-out');
                    }
                });

                // Inject Content into Modal
                let modalContent = '';
                if (number === 'MOD-01') {
                    // Special content for Module 1
                    modalContent = `
                        <div class="modal-grid">
                            <div class="modal-image-gallery">
                                <img src="${imgSrc}" alt="${title}">
                            </div>
                            <div>
                                <span class="feature-number" style="color: var(--accent-gold);">${number}</span>
                                <h2 style="margin: 1rem 0; font-size: 3rem;">${title}</h2>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    En esta sección, el programa calcula el área de acero necesaria para compresión y tracción en una sección específica del elemento analizado. Para ello, debe definirse el momento flector de diseño, las dimensiones de la sección y las características de los materiales utilizados.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    El cálculo se basa en la norma cubana NC 207:2019 y el código ACI 318, con referencias al libro "Hormigón Estructural. Diseño por Estados Límites" de J.A. Hernández Caneiro y J.J. Hernández Santana. La profundidad de la línea neutra y el dominio de trabajo mostrados corresponden a las áreas de acero calculadas.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    En el menú contextual (clic derecho) se pueden modificar las unidades de medida y configurar criterios de cuantía mínima basados en normas específicas. Los resultados incluyen áreas de acero calculadas para zonas comprimidas y traccionadas, áreas reales según diámetro y cantidad de barras, además de datos adicionales del proceso de cálculo.
                                </p>
                                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
                                    <h4 style="color: var(--accent-gold); margin-bottom: 1rem;">Capacidades Detalladas</h4>
                                    <ul style="list-style: none; font-family: var(--font-mono); font-size: 0.9rem; opacity: 0.7;">
                                        <li style="margin-bottom: 0.5rem;">> Cálculo preciso de áreas de acero</li>
                                        <li style="margin-bottom: 0.5rem;">> Análisis de línea neutra y dominios de trabajo</li>
                                        <li style="margin-bottom: 0.5rem;">> Configuración flexible de unidades y criterios</li>
                                        <li style="margin-bottom: 0.5rem;">> Reportes detallados con datos de cálculo</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (number === 'MOD-02') {
                    // Special content for Module 2
                    modalContent = `
                        <div class="modal-grid">
                            <div class="modal-image-gallery">
                                <img src="${imgSrc}" alt="${title}">
                            </div>
                            <div>
                                <span class="feature-number" style="color: var(--accent-gold);">${number}</span>
                                <h2 style="margin: 1rem 0; font-size: 3rem;">${title}</h2>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    En esta sección, la aplicación calcula el área de acero necesaria para compresión y tracción en una sección específica del elemento analizado. Para ello, debe definirse el momento flector y la carga axial de diseño, además de las dimensiones y características de los materiales utilizados.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    Se define si las solicitaciones actuantes (momento flector y fuerza axial) fueron obtenidas de un análisis lineal o no lineal (de segundo orden), considerando el efecto de pérdida de estabilidad. Para análisis lineal, se requiere introducir la longitud de pandeo (lp = k × l). El programa utiliza el método simplificado para esbeltez, permitiendo cálculo cuando la esbeltez geométrica es ≤ 29.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    Se permite analizar hasta 999 combinaciones de cargas simultáneamente. El cálculo sigue la norma cubana NC 207:2019 y el código ACI 318, con referencias al libro "Hormigón Estructural. Diseño por Estados Límites" de J.A. Hernández Caneiro y J.J. Hernández Santana. La profundidad de la línea neutra y dominio de trabajo corresponden al área de acero calculada.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    Los resultados muestran áreas de acero calculadas para zonas comprimidas y traccionadas (diseño simétrico), áreas reales según diámetro y cantidad de barras, además de otros datos relevantes. Este módulo permite generar planos en formato DXF para AutoCAD y exportar dimensionamiento hacia Revit.
                                </p>
                                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
                                    <h4 style="color: var(--accent-gold); margin-bottom: 1rem;">Capacidades Detalladas</h4>
                                    <ul style="list-style: none; font-family: var(--font-mono); font-size: 0.9rem; opacity: 0.7;">
                                        <li style="margin-bottom: 0.5rem;">> Análisis de flexocompresión con efectos de esbeltez</li>
                                        <li style="margin-bottom: 0.5rem;">> Procesamiento de múltiples combinaciones de carga</li>
                                        <li style="margin-bottom: 0.5rem;">> Diseño simétrico de refuerzo</li>
                                        <li style="margin-bottom: 0.5rem;">> Exportación a AutoCAD y Revit</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (number === 'MOD-03') {
                    // Special content for Module 3
                    modalContent = `
                        <div class="modal-grid">
                            <div class="modal-image-gallery">
                                <img src="${imgSrc}" alt="${title}">
                            </div>
                            <div>
                                <span class="feature-number" style="color: var(--accent-gold);">${number}</span>
                                <h2 style="margin: 1rem 0; font-size: 3rem;">${title}</h2>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    En esta sección, el programa calcula el espaciamiento de los estribos para una sección específica del elemento analizado, ya sea para elementos no sometidos a cargas axiales (ej: vigas) como para elementos sometidos a fuerza axial de compresión o tracción (ej: columnas o tensores). Se deberá definir previamente el cortante de diseño, las dimensiones, características de los materiales, diámetro de las barras de estribos y cantidad de patas.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    Los resultados muestran el espaciamiento calculado, el espaciamiento mínimo requerido y otros datos de interés. El espaciamiento calculado corresponde a estribos perpendiculares al eje del elemento.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    El programa se basa en la norma cubana NC 207:2019 y el código ACI 318, con referencias al libro "Hormigón Estructural. Diseño por Estados Límites" de J.A. Hernández Caneiro y J.J. Hernández Santana. El espaciamiento calculado corresponde a estribos perpendiculares al eje del elemento.
                                </p>
                                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
                                    <h4 style="color: var(--accent-gold); margin-bottom: 1rem;">Capacidades Detalladas</h4>
                                    <ul style="list-style: none; font-family: var(--font-mono); font-size: 0.9rem; opacity: 0.7;">
                                        <li style="margin-bottom: 0.5rem;">> Cálculo de espaciamiento de estribos</li>
                                        <li style="margin-bottom: 0.5rem;">> Análisis para vigas, columnas y tensores</li>
                                        <li style="margin-bottom: 0.5rem;">> Configuración de diámetros y patas de estribos</li>
                                        <li style="margin-bottom: 0.5rem;">> Verificación de espaciamientos mínimos</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (number === 'MOD-04') {
                    // Special content for Module 4
                    modalContent = `
                        <div class="modal-grid">
                            <div class="modal-image-gallery" style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <img src="${imgSrc}" alt="${title}">
                                <img src="assets/images/p15.jpg" alt="${title}">
                            </div>
                            <div>
                                <span class="feature-number" style="color: var(--accent-gold);">${number}</span>
                                <h2 style="margin: 1rem 0; font-size: 3rem;">${title}</h2>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    En esta sección, la aplicación calcula las flechas instantáneas y diferidas a lo largo del tiempo para elementos que trabajan a flexión sometidos a cargas uniformemente distribuidas. Se deberán definir previamente los momentos flectores asociados a las cargas de corta y larga duración en la sección crítica según las condiciones de apoyo del elemento, las dimensiones de la sección y las características de los materiales utilizados.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    En el cálculo de la flecha total se tienen en cuenta los efectos de la fluencia del concreto, la relajación del acero en el tiempo, la pérdida de rigidez en la sección transversal producto de la fisuración, el envejecimiento de los materiales y el aporte del acero a la rigidez de la sección transversal.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    El programa se basa en el código ACI 318, con referencias al libro "Hormigón Estructural. Diseño por Estados Límites" de J.A. Hernández Caneiro y J.J. Hernández Santana. Los momentos introducidos deberán estar asociados a cargas uniformemente distribuidas. Este módulo permite exportar hacia Revit el dimensionamiento del elemento analizado.
                                </p>
                                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
                                    <h4 style="color: var(--accent-gold); margin-bottom: 1rem;">Capacidades Detalladas</h4>
                                    <ul style="list-style: none; font-family: var(--font-mono); font-size: 0.9rem; opacity: 0.7;">
                                        <li style="margin-bottom: 0.5rem;">> Cálculo de flechas instantáneas y diferidas</li>
                                        <li style="margin-bottom: 0.5rem;">> Análisis de fluencia y relajación</li>
                                        <li style="margin-bottom: 0.5rem;">> Consideración de fisuración y envejecimiento</li>
                                        <li style="margin-bottom: 0.5rem;">> Exportación a Revit</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (number === 'MOD-05') {
                    // Special content for Module 5
                    modalContent = `
                        <div class="modal-grid">
                            <div class="modal-image-gallery" style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <img src="${imgSrc}" alt="${title}">
                                <img src="assets/images/p16.jpg" alt="${title}">
                            </div>
                            <div>
                                <span class="feature-number" style="color: var(--accent-gold);">${number}</span>
                                <h2 style="margin: 1rem 0; font-size: 3rem;">${title}</h2>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    Se proponen dos modelos para el cálculo de abertura de fisuras: el modelo de Frosch y el modelo de Gergely-Lutz. Los autores recomiendan el uso de la expresión de Frosch para el cálculo de la abertura de fisuras. El método de Gergely-Lutz no es aplicable a losas armadas en dos direcciones.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    El programa se basa en la norma cubana NC 207:2019 y el código ACI 318, con referencias al libro "Hormigón Estructural. Diseño por Estados Límites" de J.A. Hernández Caneiro y J.J. Hernández Santana. Las aberturas de fisuras permisibles se toman de la norma cubana NC 250:2005.
                                </p>
                                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
                                    <h4 style="color: var(--accent-gold); margin-bottom: 1rem;">Capacidades Detalladas</h4>
                                    <ul style="list-style: none; font-family: var(--font-mono); font-size: 0.9rem; opacity: 0.7;">
                                        <li style="margin-bottom: 0.5rem;">> Modelos Frosch y Gergely-Lutz</li>
                                        <li style="margin-bottom: 0.5rem;">> Cálculo de abertura de fisuras</li>
                                        <li style="margin-bottom: 0.5rem;">> Verificación de límites permisibles</li>
                                        <li style="margin-bottom: 0.5rem;">> Aplicación a diferentes tipos de elementos</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (number === 'MOD-06') {
                    // Special content for Module 6
                    modalContent = `
                        <div class="modal-grid">
                            <div class="modal-image-gallery" style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <img src="${imgSrc}" alt="${title}">
                                <img src="assets/images/p17.jpg" alt="${title}">
                                <img src="assets/images/p18.jpg" alt="${title}">
                            </div>
                            <div>
                                <span class="feature-number" style="color: var(--accent-gold);">${number}</span>
                                <h2 style="margin: 1rem 0; font-size: 3rem;">${title}</h2>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    Este módulo calcula el dimensionamiento geotécnico y estructural de cimientos aislados. Permite analizar diferentes tipos de cimentación (centrada, excéntrica o de esquina) considerando parámetros del suelo mediante métodos como Brinch-Hansen o Meyerhof.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    Incluye integración con SAP2000 y ETABS para importar reacciones de apoyo, análisis simultáneo de hasta 9999 combinaciones de carga, y verificación de criterios como capacidad de carga, vuelco, deslizamiento, punzonamiento, cortante y flexión.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    El programa se basa en la norma cubana NC 207:2019 y el código ACI 318, con referencias al libro "Hormigón Estructural. Diseño por Estados Límites" de J.A. Hernández Caneiro y J.J. Hernández Santana. Genera planos en formato DXF para AutoCAD y exporta dimensionamiento hacia Revit.
                                </p>
                                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
                                    <h4 style="color: var(--accent-gold); margin-bottom: 1rem;">Capacidades Detalladas</h4>
                                    <ul style="list-style: none; font-family: var(--font-mono); font-size: 0.9rem; opacity: 0.7;">
                                        <li style="margin-bottom: 0.5rem;">> Análisis geotécnico y estructural</li>
                                        <li style="margin-bottom: 0.5rem;">> Integración con SAP2000 y ETABS</li>
                                        <li style="margin-bottom: 0.5rem;">> Procesamiento masivo de combinaciones</li>
                                        <li style="margin-bottom: 0.5rem;">> Exportación a AutoCAD y Revit</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (number === 'MOD-07') {
                    // Special content for Module 7
                    modalContent = `
                        <div class="modal-grid">
                            <div class="modal-image-gallery" style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <img src="${imgSrc}" alt="${title}">
                                <img src="assets/images/p12.jpg" alt="${title}">
                                <img src="assets/images/p19.jpg" alt="${title}">
                                <img src="assets/images/p20.jpg" alt="${title}">
                                <img src="assets/images/p21.jpg" alt="${title}">
                            </div>
                            <div>
                                <span class="feature-number" style="color: var(--accent-gold);">${number}</span>
                                <h2 style="margin: 1rem 0; font-size: 3rem;">${title}</h2>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    Este módulo verifica la estabilidad de muros de contención mediante análisis de vuelco, deslizamiento y capacidad de carga. Realiza predimensionamiento geométrico basado en criterios de Braja M. Das y José Calavera Ruiz, y diseño estructural según NC 207:2019 y ACI 318.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    Calcula empujes laterales usando teoría de Rankine (activos y pasivos), considera sobrecargas (línea, uniforme, banda) y efectos sísmicos. Incluye análisis de nivel freático y visualización de diagramas de solicitaciones.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    Incorpora plugins para SAP2000 y ETABS permitiendo modelado bidireccial. Genera planos en formato DXF para AutoCAD y exporta dimensionamiento hacia Revit, con verificación automática de requisitos constructivos y de detallado.
                                </p>
                                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
                                    <h4 style="color: var(--accent-gold); margin-bottom: 1rem;">Capacidades Detalladas</h4>
                                    <ul style="list-style: none; font-family: var(--font-mono); font-size: 0.9rem; opacity: 0.7;">
                                        <li style="margin-bottom: 0.5rem;">> Análisis de estabilidad completo</li>
                                        <li style="margin-bottom: 0.5rem;">> Cálculo de empujes sísmicos</li>
                                        <li style="margin-bottom: 0.5rem;">> Integración SAP2000/ETABS</li>
                                        <li style="margin-bottom: 0.5rem;">> Exportación a AutoCAD y Revit</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (number === 'MOD-08') {
                    // Special content for Module 8
                    modalContent = `
                        <div class="modal-grid">
                            <div class="modal-image-gallery" style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <img src="${imgSrc}" alt="${title}">
                                <img src="assets/images/p23.jpg" alt="${title}">
                                <img src="assets/images/p24.jpg" alt="${title}">
                            </div>
                            <div>
                                <span class="feature-number" style="color: var(--accent-gold);">${number}</span>
                                <h2 style="margin: 1rem 0; font-size: 3rem;">${title}</h2>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    El Método de Diseño Directo (MDD) es un método semiempírico para calcular solicitaciones en losas que trabajan en dos direcciones. Distribuye el momento estático entre franjas de columna e intermedias mediante coeficientes basados en ensayos con cargas gravitacionales uniformes.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    Uno de los dos métodos del ACI 318 para análisis de carga gravitacional en sistemas de losas bidireccionales. Aplicable a pórticos ortogonales con cargas gravitacionales únicamente, incluyendo losas con vigas, losas planas y placas planas. El software verifica automáticamente las limitaciones del método.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    El predimensionamiento del peralto se basa en criterios de deformación del ACI 318 y el libro "Hormigón Estructural. Diseño por Estados Límites" de J.A. Hernández Caneiro y J.J. Hernández Santana. Considera efectos de rigidez por agrietamiento y geometría de apoyos.
                                </p>
                                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
                                    <h4 style="color: var(--accent-gold); margin-bottom: 1rem;">Capacidades Detalladas</h4>
                                    <ul style="list-style: none; font-family: var(--font-mono); font-size: 0.9rem; opacity: 0.7;">
                                        <li style="margin-bottom: 0.5rem;">> Método de Diseño Directo (MDD)</li>
                                        <li style="margin-bottom: 0.5rem;">> Distribución de momentos</li>
                                        <li style="margin-bottom: 0.5rem;">> Verificación automática de límites</li>
                                        <li style="margin-bottom: 0.5rem;">> Predimensionamiento por deformación</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (number === 'MOD-09') {
                    // Special content for Module 9
                    modalContent = `
                        <div class="modal-grid">
                            <div class="modal-image-gallery" style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <img src="${imgSrc}" alt="${title}">
                                <img src="assets/images/p28.jpg" alt="${title}">
                                <img src="assets/images/p29.jpg" alt="${title}">
                            </div>
                            <div>
                                <span class="feature-number" style="color: var(--accent-gold);">${number}</span>
                                <h2 style="margin: 1rem 0; font-size: 3rem;">${title}</h2>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    Este módulo calcula el dimensionamiento integral geotécnico y estructural de pilotes aislados para cimentaciones profundas. A diferencia de cimientos superficiales, permite analizar múltiples estratos de suelo considerando variaciones en propiedades geotécnicas a diferentes profundidades.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    Ofrece cálculo mediante múltiples métodos de capacidad portante, permitiendo al usuario seleccionar métodos específicos o dejar que el programa calcule por todos los métodos disponibles. El usuario puede configurar el programa para seleccionar automáticamente el resultado más conservador, menos conservador o el promedio de todos los métodos calculados.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    Incluye integración con SAP2000 y ETABS para importar reacciones de apoyo, análisis simultáneo de hasta 9999 combinaciones de carga, y verificación de criterios como capacidad portante, cortante y flexión. El programa se basa en la norma cubana NC 207:2019 y el código ACI 318. Genera planos en formato DXF para AutoCAD y exporta dimensionamiento hacia Revit.
                                </p>
                                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
                                    <h4 style="color: var(--accent-gold); margin-bottom: 1rem;">Capacidades Detalladas</h4>
                                    <ul style="list-style: none; font-family: var(--font-mono); font-size: 0.9rem; opacity: 0.7;">
                                        <li style="margin-bottom: 0.5rem;">> Análisis de múltiples estratos</li>
                                        <li style="margin-bottom: 0.5rem;">> Múltiples métodos de cálculo</li>
                                        <li style="margin-bottom: 0.5rem;">> Integración con SAP2000 y ETABS</li>
                                        <li style="margin-bottom: 0.5rem;">> Exportación a AutoCAD y Revit</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (number === 'MOD-10') {
                    // Special content for Module 10
                    modalContent = `
                        <div class="modal-grid">
                            <div class="modal-image-gallery" style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <img src="${imgSrc}" alt="${title}">
                                <img src="assets/images/p25.jpg" alt="${title}">
                                <img src="assets/images/p26.jpg" alt="${title}">
                                <img src="assets/images/p27.jpg" alt="${title}">
                            </div>
                            <div>
                                <span class="feature-number" style="color: var(--accent-gold);">${number}</span>
                                <h2 style="margin: 1rem 0; font-size: 3rem;">${title}</h2>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    Este módulo calcula el dimensionamiento geotécnico y estructural de cimientos combinados que soportan dos pedestales. Analiza diferentes configuraciones de cimentación combinada considerando parámetros del suelo mediante métodos como Brinch-Hansen o Meyerhof, optimizando el diseño para cargas excéntricas y momentos.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    Permite análisis simultáneo de hasta 9999 combinaciones de carga y verificación de criterios como capacidad de carga, vuelco, deslizamiento, punzonamiento, cortante y flexión en la placa de cimentación.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    El programa se basa en la norma cubana NC 207:2019 y el código ACI 318, con referencias al libro "Hormigón Estructural. Diseño por Estados Límites" de J.A. Hernández Caneiro y J.J. Hernández Santana. Genera planos en formato DXF para AutoCAD y exporta dimensionamiento hacia Revit.
                                </p>
                                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
                                    <h4 style="color: var(--accent-gold); margin-bottom: 1rem;">Capacidades Detalladas</h4>
                                    <ul style="list-style: none; font-family: var(--font-mono); font-size: 0.9rem; opacity: 0.7;">
                                        <li style="margin-bottom: 0.5rem;">> Diseño de cimientos combinados</li>
                                        <li style="margin-bottom: 0.5rem;">> Análisis de dos pedestales</li>
                                        <li style="margin-bottom: 0.5rem;">> Procesamiento masivo de combinaciones</li>
                                        <li style="margin-bottom: 0.5rem;">> Exportación a AutoCAD y Revit</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (number === 'MOD-11') {
                    // Special content for Module 11
                    modalContent = `
                        <div class="modal-grid">
                            <div class="modal-image-gallery" style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <img src="${imgSrc}" alt="${title}">
                                <img src="assets/images/p30.jpg" alt="${title}">
                                <img src="assets/images/p31.jpg" alt="${title}">
                            </div>
                            <div>
                                <span class="feature-number" style="color: var(--accent-gold);">${number}</span>
                                <h2 style="margin: 1rem 0; font-size: 3rem;">${title}</h2>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    Este módulo calcula el dimensionamiento geotécnico y estructural de depósitos, cisternas, fosas sépticas y registros. Permite agregar paredes o tabiques interiores con pases y aberturas en paredes y tapas, útiles para registros eléctricos o sanitarios.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    En el diseño geotécnico calcula capacidad de carga, asentamientos y verifica flotabilidad en caso de inmersión en agua o suelo saturado por nivel freático. Permite analizar múltiples estratos de suelo considerando variaciones en propiedades geotécnicas a diferentes profundidades.
                                </p>
                                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    El programa se basa en la norma cubana NC 207:2019 y el código ACI 318, con referencias al libro "Hormigón Estructural. Diseño por Estados Límites" de J.A. Hernández Caneiro y J.J. Hernández Santana. Genera planos en formato DXF para AutoCAD.
                                </p>
                                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
                                    <h4 style="color: var(--accent-gold); margin-bottom: 1rem;">Capacidades Detalladas</h4>
                                    <ul style="list-style: none; font-family: var(--font-mono); font-size: 0.9rem; opacity: 0.7;">
                                        <li style="margin-bottom: 0.5rem;">> Diseño de depósitos y registros</li>
                                        <li style="margin-bottom: 0.5rem;">> Análisis de múltiples estratos</li>
                                        <li style="margin-bottom: 0.5rem;">> Verificación de flotabilidad</li>
                                        <li style="margin-bottom: 0.5rem;">> Exportación a AutoCAD</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    // Default content for other modules
                    modalContent = `
                        <div class="modal-grid">
                            <div class="modal-image-gallery">
                                <img src="${imgSrc}" alt="${title}">
                                <img src="${imgSrc}" alt="${title}">
                            </div>
                            <div>
                                <span class="feature-number" style="color: var(--accent-gold);">${number}</span>
                                <h2 style="margin: 1rem 0; font-size: 3rem;">${title}</h2>
                                <p style="font-size: 1.2rem; line-height: 1.6; opacity: 0.8; margin-bottom: 2rem;">
                                    ${description}
                                </p>
                                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
                                    <h4 style="color: var(--accent-gold); margin-bottom: 1rem;">Capacidades Detalladas</h4>
                                    <ul style="list-style: none; font-family: var(--font-mono); font-size: 0.9rem; opacity: 0.7;">
                                        <li style="margin-bottom: 0.5rem;">> Verificación de estados límite de servicio</li>
                                        <li style="margin-bottom: 0.5rem;">> Optimización automática de cuantías</li>
                                        <li style="margin-bottom: 0.5rem;">> Generación de reportes detallados</li>
                                        <li style="margin-bottom: 0.5rem;">> Exportación directa a DXF</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `;
                }
                modalBody.innerHTML = modalContent;

                // Show Modal
                modal.style.display = 'flex';
                // Force reflow
                modal.offsetHeight;
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scroll
            });
        });

        const closeFunc = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Show background cards immediately when closing starts
            moduleCards.forEach(c => {
                c.classList.remove('animating-out');
            });

            // Wait for animation to finish before hiding display
            setTimeout(() => {
                if (!modal.classList.contains('active')) {
                    modal.style.display = 'none';
                }
            }, 600);
        };

        closeModal.addEventListener('click', closeFunc);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeFunc();
        });

        // Close with ESC key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeFunc();
            }
        });
    }

    // 8. Geolocation Download Link (On Click)
    const downloadBtn = document.getElementById('btn-download');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const btn = this;

            // Links (Swapped as requested: NAC for Cuba, INT for International)
            const cubaHref = "https://dl.dropboxusercontent.com/scl/fi/l2em4gn4hfq1kainbvvdq/ShowCrete_v11.0.4_NAC_AICROS.rar?rlkey=2utul7l9uaiofz4cfsoio7hcu&st=b03yqf13";
            const internationalHref = "https://dl.dropboxusercontent.com/scl/fi/npjmvl0p216ep6pi5g9lv/ShowCrete_v11.0.4_INT_CSI.rar?rlkey=ly91a8nlmvy34okg2hf644gb2&st=d6vvgixc";

            // Visual feedback
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 10px;"></i> Verificando...';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';

            fetch('https://ipapi.co/json/')
                .then(response => {
                    if (!response.ok) throw new Error('Network error');
                    return response.json();
                })
                .then(data => {
                    if (data.country_code === 'CU') {
                        window.open(cubaHref, '_blank');
                    } else {
                        window.open(internationalHref, '_blank');
                    }
                })
                .catch(error => {
                    console.warn("Error de geolocalización, usando link internacional por defecto:", error);
                    window.open(internationalHref, '_blank');
                })
                .finally(() => {
                    // Restore button state
                    btn.innerHTML = originalContent;
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                });
        });
    }

});

/**
 * Custom Notification System
 */
function showNotification(title, message, type = 'success') {
    // Remove existing notification if any
    const existing = document.querySelector('.custom-notification');
    if (existing) existing.remove();

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icon}"></i>
            <div class="notification-text">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">&times;</button>
        </div>
        <div class="notification-progress"></div>
    `;

    document.body.appendChild(notification);

    // Close button logic
    notification.querySelector('.notification-close').onclick = () => {
        notification.classList.add('hiding');
        setTimeout(() => notification.remove(), 500);
    };

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('hiding');
            setTimeout(() => notification.remove(), 500);
        }
    }, 5000);
}