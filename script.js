/* ============================================
   VERFRUT'S Y R&M - JAVASCRIPT GLOBAL
   ============================================
   Este archivo contiene toda la logica JavaScript
   para el sitio web completo.
   ============================================ */


        /* ============================================
           1. LOADER
           ============================================ */
        function initLoader() {
            const loader = document.getElementById('pageLoader');
            if (!loader) return;
            window.addEventListener('load', function () {
                setTimeout(function () { loader.classList.add('hidden'); }, 400);
            });
            if (document.readyState === 'complete') {
                setTimeout(function () { loader.classList.add('hidden'); }, 400);
            }
        }

        /* ============================================
           2. SLIDER INFINITO
           ============================================ */
        function initSlider() {
            const track = document.querySelector('.slider-track');
            const dots = document.querySelectorAll('.dot');
            const prevBtn = document.querySelector('.slider-arrow.prev');
            const nextBtn = document.querySelector('.slider-arrow.next');
            if (!track || dots.length === 0) return;
            const totalReal = dots.length;
            const totalSlides = track.children.length;
            const TRANSITION_TIME = 700;
            let current = 1;
            let timer = null;
            let isTransitioning = false;

            function moveTo(index, animate) {
                if (!animate) { track.classList.add('no-transition'); }
                else { track.classList.remove('no-transition'); }
                track.style.transform = 'translateX(-' + (index * 100) + '%)';
                if (!animate) { void track.offsetWidth; track.classList.remove('no-transition'); }
                let dotIndex = index - 1;
                if (dotIndex < 0) dotIndex = totalReal - 1;
                if (dotIndex >= totalReal) dotIndex = 0;
                dots.forEach(function (d, idx) { d.classList.toggle('active', idx === dotIndex); });
            }

            function next() {
                if (isTransitioning) return;
                isTransitioning = true;
                current++;
                moveTo(current, true);
                if (current === totalSlides - 1) {
                    setTimeout(function () { current = 1; moveTo(current, false); isTransitioning = false; }, TRANSITION_TIME);
                } else {
                    setTimeout(function () { isTransitioning = false; }, TRANSITION_TIME);
                }
            }

            function prev() {
                if (isTransitioning) return;
                isTransitioning = true;
                current--;
                moveTo(current, true);
                if (current === 0) {
                    setTimeout(function () { current = totalReal; moveTo(current, false); isTransitioning = false; }, TRANSITION_TIME);
                } else {
                    setTimeout(function () { isTransitioning = false; }, TRANSITION_TIME);
                }
            }

            function start() { if (timer) clearInterval(timer); timer = setInterval(next, 5000); }
            function stop() { if (timer) { clearInterval(timer); timer = null; } }

            moveTo(current, false);
            if (nextBtn) { nextBtn.addEventListener('click', function () { stop(); next(); start(); }); }
            if (prevBtn) { prevBtn.addEventListener('click', function () { stop(); prev(); start(); }); }
            dots.forEach(function (dot) {
                dot.addEventListener('click', function () {
                    if (isTransitioning) return;
                    stop();
                    let target = parseInt(this.dataset.index) + 1;
                    current = target;
                    moveTo(current, true);
                    setTimeout(function () { isTransitioning = false; }, TRANSITION_TIME);
                    start();
                });
            });
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.addEventListener('mouseenter', stop);
                hero.addEventListener('mouseleave', start);
            }
            start();
        }

        /* ============================================
           3. MENU MOBILE
           ============================================ */
        function initMobileMenu() {
            const toggle = document.getElementById('menuToggle');
            const nav = document.getElementById('navLinks');
            if (!toggle || !nav) return;
            const overlay = document.getElementById('navOverlay');
            function closeMenu() {
                nav.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
            }
            function toggleMenu() {
                nav.classList.toggle('active');
                if (overlay) overlay.classList.toggle('active', nav.classList.contains('active'));
            }
            toggle.addEventListener('click', toggleMenu);
            if (overlay) overlay.addEventListener('click', closeMenu);

            nav.querySelectorAll('a').forEach(function (a) {
                a.addEventListener('click', function (e) {
                    var parentLi = a.closest('li');

                    if (parentLi && parentLi.classList.contains('dropdown')) {
                        return;
                    }

                    if (a.closest('.dropdown-menu')) {
                        closeMenu();
                        return;
                    }

                    closeMenu();
                });
            });
        }

        /* ============================================
           4. DROPDOWN EN MOBILE
           ============================================ */
        function initDropdown() {
            document.querySelectorAll('.dropdown > a').forEach(function (parentLink) {
                parentLink.addEventListener('click', function (e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        e.stopPropagation();
                        // Cerrar otros dropdowns abiertos
                        document.querySelectorAll('.dropdown.active').forEach(function(d) {
                            if (d !== parentLink.parentElement) d.classList.remove('active');
                        });
                        parentLink.parentElement.classList.toggle('active');
                    }
                });
            });
        }

        /* ============================================
           5. BOTON SCROLL TOP
           ============================================ */
        function initScrollTop() {
            const btn = document.getElementById('scrollTop');
            if (!btn) return;
            window.addEventListener('scroll', function () {
                if (window.scrollY > 400) btn.classList.add('visible');
                else btn.classList.remove('visible');
            });
            btn.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        

        /* ============================================
           7. SCROLL SUAVE PARA ANCLAS INTERNAS
           ============================================ */
        function initSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
                anchor.addEventListener('click', function (e) {
                    const href = this.getAttribute('href');
                    if (href !== '#') {
                        const target = document.querySelector(href);
                        if (target) {
                            e.preventDefault();
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                });
            });
        }

        /* ============================================
           8. LIGHTBOX - PRODUCTOS
           ============================================ */
        function initLightbox() {
            const overlay = document.createElement('div');
            overlay.className = 'lightbox-overlay';
            overlay.setAttribute('aria-hidden', 'true');
            overlay.innerHTML = '\
                <button class="lightbox-close" type="button" aria-label="Cerrar visor">\
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.7 5.3 12 10.6l5.3-5.3 1.4 1.4-5.3 5.3 5.3 5.3-1.4 1.4-5.3-5.3-5.3 5.3-1.4-1.4 5.3-5.3-5.3-5.3 1.4-1.4Z"/></svg>\
                </button>\
                <figure class="lightbox-frame">\
                    <img class="lightbox-img" src="" alt="Vista ampliada">\
                    <figcaption class="lightbox-caption"></figcaption>\
                </figure>';
            document.body.appendChild(overlay);

            const img = overlay.querySelector('.lightbox-img');
            const closeBtn = overlay.querySelector('.lightbox-close');
            const caption = overlay.querySelector('.lightbox-caption');

            function getProductImage(target) {
                const imageHost = target.closest('.product-image');
                if (!imageHost) return null;
                if (imageHost.matches('img')) return imageHost;
                return imageHost.querySelector('img');
            }

            function open(imageEl) {
                if (!imageEl) return;
                const src = imageEl.currentSrc || imageEl.getAttribute('src') || imageEl.src;
                if (!src || src === '#') return;
                img.src = src;
                img.alt = imageEl.alt || 'Vista ampliada del producto';
                caption.textContent = imageEl.alt || '';
                overlay.classList.add('active');
                overlay.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }

            function close() {
                overlay.classList.remove('active');
                overlay.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                setTimeout(function() {
                    if (!overlay.classList.contains('active')) img.removeAttribute('src');
                }, 180);
            }

            document.addEventListener('click', function(e) {
                const imageEl = getProductImage(e.target);
                if (!imageEl) return;
                e.preventDefault();
                e.stopPropagation();
                open(imageEl);
            });

            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) close();
            });
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                close();
            });

            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && overlay.classList.contains('active')) {
                    close();
                }
            });
        }

        /* ============================================
           9. CAROUSEL PRODUCTOS CIRCULAR - CORREGIDO
           ============================================ */
        function initProductCarousel() {
            const track = document.getElementById('prodTrack');
            const prevBtn = document.getElementById('carouselPrev');
            const nextBtn = document.getElementById('carouselNext');
            const dots = document.querySelectorAll('.carousel-dot');
            if (!track || !prevBtn || !nextBtn) return;

            const cards = Array.from(track.children);
            const totalCards = cards.length;

            function getCardWidth() {
                return cards[0].offsetWidth + 30;
            }

            function getVisibleCount() {
                return Math.max(1, Math.floor(track.clientWidth / getCardWidth()));
            }

            function getMaxScrollIndex() {
                const visible = getVisibleCount();
                return Math.max(0, totalCards - visible);
            }

            function getCurrentIndex() {
                const cardWidth = getCardWidth();
                const scrollPos = track.scrollLeft;
                return Math.round(scrollPos / cardWidth);
            }

            function updateDots(activeIndex) {
                if (!dots.length) return;
                const visible = getVisibleCount();
                const maxIndex = getMaxScrollIndex();

                let pageIndex = 0;
                if (maxIndex > 0) {
                    pageIndex = Math.round((activeIndex / maxIndex) * (dots.length - 1));
                }
                pageIndex = Math.max(0, Math.min(pageIndex, dots.length - 1));

                dots.forEach(function(d, i) {
                    d.classList.toggle('active', i === pageIndex);
                });
            }

            function scrollToIndex(index, smooth) {
                const maxIndex = getMaxScrollIndex();

                if (index > maxIndex) {
                    index = 0;
                    smooth = false;
                }
                if (index < 0) {
                    index = maxIndex;
                    smooth = false;
                }

                const cardWidth = getCardWidth();
                const targetScroll = index * cardWidth;

                if (smooth) {
                    track.scrollTo({ left: targetScroll, behavior: 'smooth' });
                } else {
                    track.style.scrollBehavior = 'auto';
                    track.scrollLeft = targetScroll;
                    requestAnimationFrame(function() {
                        track.style.scrollBehavior = 'smooth';
                    });
                }

                updateDots(index);
            }

            nextBtn.addEventListener('click', function () {
                const currentIndex = getCurrentIndex();
                const visible = getVisibleCount();
                const maxIndex = getMaxScrollIndex();
                let nextIndex = currentIndex + visible;

                if (nextIndex > maxIndex) {
                    nextIndex = 0;
                    scrollToIndex(nextIndex, false);
                } else {
                    scrollToIndex(nextIndex, true);
                }
            });

            prevBtn.addEventListener('click', function () {
                const currentIndex = getCurrentIndex();
                const visible = getVisibleCount();
                let prevIndex = currentIndex - visible;

                if (prevIndex < 0) {
                    const maxIndex = getMaxScrollIndex();
                    scrollToIndex(maxIndex, false);
                } else {
                    scrollToIndex(prevIndex, true);
                }
            });

            dots.forEach(function(dot) {
                dot.addEventListener('click', function() {
                    const dotIndex = parseInt(this.dataset.index);
                    const maxIndex = getMaxScrollIndex();
                    const targetIndex = Math.round((dotIndex / (dots.length - 1)) * maxIndex);
                    scrollToIndex(targetIndex, true);
                });
            });

            let scrollTimeout;
            track.addEventListener('scroll', function() {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function() {
                    updateDots(getCurrentIndex());
                }, 150);
            }, { passive: true });

            updateDots(0);

            let resizeTimeout;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function() {
                    updateDots(getCurrentIndex());
                }, 200);
            });
        }

        /* ============================================
           10. LIGHTBOX GALERIA CON NAVEGACION
           ============================================ */
        function initLightboxGallery() {
            const overlay = document.getElementById('lightboxOverlay');
            const img = document.getElementById('lightboxImg');
            const closeBtn = document.getElementById('lightboxClose');
            const prevBtn = document.getElementById('lightboxPrev');
            const nextBtn = document.getElementById('lightboxNext');
            const galleryItems = document.querySelectorAll('.gallery-item');
            if (!overlay || !img || galleryItems.length === 0) return;

            let currentIndex = 0;
            const galleryData = Array.from(galleryItems).map(function(item) {
                return item.querySelector('img').src;
            });

            function open(index) {
                currentIndex = index;
                img.src = galleryData[currentIndex];
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            function close() {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }

            function next() {
                currentIndex = (currentIndex + 1) % galleryData.length;
                img.style.opacity = '0';
                setTimeout(function() {
                    img.src = galleryData[currentIndex];
                    img.style.opacity = '1';
                }, 150);
            }

            function prev() {
                currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
                img.style.opacity = '0';
                setTimeout(function() {
                    img.src = galleryData[currentIndex];
                    img.style.opacity = '1';
                }, 150);
            }

            galleryItems.forEach(function(item, index) {
                item.addEventListener('click', function() { open(index); });
            });

            closeBtn.addEventListener('click', close);
            nextBtn.addEventListener('click', function(e) { e.stopPropagation(); next(); });
            prevBtn.addEventListener('click', function(e) { e.stopPropagation(); prev(); });
            overlay.addEventListener('click', function(e) { if (e.target === overlay) close(); });
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') close();
                if (e.key === 'ArrowRight') next();
                if (e.key === 'ArrowLeft') prev();
            });
        }

        /* ============================================
           11. INTERSECTION OBSERVER (REVEAL ANIMATIONS)
           ============================================ */
        function initRevealAnimations() {
            const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, observerOptions);
            document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
        }

        /* ============================================
           12. HERO LOADED EFFECT
           ============================================ */
        function initHeroLoaded() {
            setTimeout(function() {
                const hero = document.getElementById('hero');
                if (hero) hero.classList.add('loaded');
            }, 100);
        }

        /* ============================================
           13. NAVBAR SCROLL EFFECT
           ============================================ */
        function initNavbarScroll() {
            const navbar = document.getElementById('navbar');
            if (!navbar) return;

            window.addEventListener('scroll', function () {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }

        /* ============================================
           INICIALIZACION GLOBAL
           ============================================ */
        document.addEventListener('DOMContentLoaded', function () {
            initLoader();
            initSlider();
            initMobileMenu();
            initDropdown();
            initScrollTop();

            initSmoothScroll();
            initLightbox();
            initLightboxGallery();
            initProductCarousel();
            initNavbarScroll();
            initRevealAnimations();
            initHeroLoaded();
        });


/* ============================================
   JS EXTRACTED FROM INJU.HTML script BLOCK
   ============================================
   All JavaScript previously inside script in inju.html
   has been moved here. No logic changes made.
   ============================================ */

// SCROLL REVEAL for inju.html
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// TIMELINE AUTOMÁTICO SUAVE for inju.html
const timelineScroll = document.getElementById('timelineScroll');
const timelineNodes = document.querySelectorAll('.timeline-node');
const timelineDots = document.querySelectorAll('.timeline-dot-btn');
const prevBtn = document.getElementById('timelinePrev');
const nextBtn = document.getElementById('timelineNext');
let currentIndex = 0;
let autoInterval;
let isUserInteracting = false;
const AUTO_DELAY = 8000;

function goToTimeline(index, smooth) {
    if (typeof smooth === 'undefined') smooth = true;
    if (!timelineScroll || timelineNodes.length === 0) return;
    if (index < 0) index = timelineNodes.length - 1;
    if (index >= timelineNodes.length) index = 0;
    currentIndex = index;

    var node = timelineNodes[index];
    var scrollPos = node.offsetLeft - (timelineScroll.offsetWidth / 2) + (node.offsetWidth / 2);
    timelineScroll.scrollTo({ left: scrollPos, behavior: smooth ? 'smooth' : 'auto' });

    timelineDots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === index);
    });
}

function startAuto() {
    clearInterval(autoInterval);
    autoInterval = setInterval(function() {
        if (!isUserInteracting) {
            goToTimeline(currentIndex + 1);
        }
    }, AUTO_DELAY);
}

function stopAuto() {
    isUserInteracting = true;
    clearInterval(autoInterval);
    setTimeout(function() {
        isUserInteracting = false;
        startAuto();
    }, 8000);
}

if (prevBtn) prevBtn.addEventListener('click', function() { stopAuto(); goToTimeline(currentIndex - 1); });
if (nextBtn) nextBtn.addEventListener('click', function() { stopAuto(); goToTimeline(currentIndex + 1); });

if (timelineDots.length > 0) {
    timelineDots.forEach(function(dot, i) {
        dot.addEventListener('click', function() { stopAuto(); goToTimeline(i); });
    });
}

// Drag support
var isDown = false;
var startX;
var scrollLeft;

if (timelineScroll) {
    timelineScroll.addEventListener('mousedown', function(e) {
        isDown = true;
        isUserInteracting = true;

        startX = e.pageX - timelineScroll.offsetLeft;
        scrollLeft = timelineScroll.scrollLeft;
    });
    timelineScroll.addEventListener('mouseleave', function() {
        isDown = false;

    });
    timelineScroll.addEventListener('mouseup', function() {
        isDown = false;

        var closest = 0;
        var minDiff = Infinity;
        timelineNodes.forEach(function(node, i) {
            var nodeCenter = node.offsetLeft + node.offsetWidth / 2;
            var containerCenter = timelineScroll.scrollLeft + timelineScroll.offsetWidth / 2;
            var diff = Math.abs(nodeCenter - containerCenter);
            if (diff < minDiff) { minDiff = diff; closest = i; }
        });
        goToTimeline(closest);
        setTimeout(function() { isUserInteracting = false; startAuto(); }, 8000);
    });
    timelineScroll.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        var x = e.pageX - timelineScroll.offsetLeft;
        var walk = (x - startX) * 1.5;
        timelineScroll.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    var touchStartX = 0;
    timelineScroll.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        isUserInteracting = true;
    }, { passive: true });
    timelineScroll.addEventListener('touchend', function(e) {
        var touchEndX = e.changedTouches[0].clientX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToTimeline(currentIndex + 1);
            else goToTimeline(currentIndex - 1);
        }
        setTimeout(function() { isUserInteracting = false; startAuto(); }, 8000);
    });

    // Hover pausa
    timelineScroll.addEventListener('mouseenter', function() { isUserInteracting = true; });
    timelineScroll.addEventListener('mouseleave', function() { isUserInteracting = false; });

    goToTimeline(0, false);
    startAuto();
}

/* ============================================
   INICIO JS: NAVEGACION Y CARRITO COMPARTIDO
   ============================================ */
function initActiveNav() {
    /* Obtiene el nombre del archivo actual para marcar el enlace activo en el navbar */
    var page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a[href]').forEach(function(link) {
        var href = (link.getAttribute('href') || '').split('#')[0].toLowerCase();
        link.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
    });
}

function initScrollTargets() {
    document.querySelectorAll('[data-scroll-target]').forEach(function(trigger) {
        function go() {
            const target = document.querySelector(trigger.getAttribute('data-scroll-target'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        trigger.addEventListener('click', go);
        trigger.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                go();
            }
        });
    });
}

function initSharedCart() {
    const page = (window.location.pathname.split('/').pop() || '').toLowerCase();

    const CART_KEY = 'verfruts_cart';
    const WHATSAPP_NUMBER = '50360649103';
    let cart = [];

    const openCartBtn = document.getElementById('openCartBtn');
    const openCartMobileBtn = document.getElementById('openCartMobileBtn');
    const openCartPageBtn = document.getElementById('openCartPageBtn');
    const openCartButtons = [openCartBtn, openCartMobileBtn, openCartPageBtn].filter(Boolean);
    const navbarCartCounts = [document.getElementById('navbarCartCount'), document.getElementById('navbarCartCountMobile')].filter(Boolean);
    const modal = document.getElementById('checkoutModal');
    const modalItemsContainer = document.getElementById('modalItemsList');
    const modalTotalSpan = document.getElementById('modalTotal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeModalXBtn = document.getElementById('closeModalXBtn');
    const sendWhatsappBtn = document.getElementById('sendWhatsappBtn');
    const modalBuyerName = document.getElementById('modalBuyerName');
    const modalBuyerLast = document.getElementById('modalBuyerLast');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const cartToast = document.getElementById('cartToast');
    const cartToastText = document.getElementById('cartToastText');
    const cartToastAction = document.getElementById('cartToastAction');
    let toastTimeout = null;
    let lastNavbarCount = 0;

    if (navbarCartCounts.length === 0 && !modal) return;

    function formatMoney(value) {
        return '$' + Number(value || 0).toFixed(2);
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>]/g, function(mark) {
            if (mark === '&') return '&amp;';
            if (mark === '<') return '&lt;';
            if (mark === '>') return '&gt;';
            return mark;
        });
    }

    function normalizeItem(item) {
        if (!item || !item.id) return null;
        const name = item.name || item.nombre || 'Producto';
        const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        if (quantity <= 0) return null;
        return { id: String(item.id), name: String(name), price: price, unit: item.unit || '', quantity: quantity };
    }

    function saveCart(shouldRender) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart.map(function(item) {
            return {
                id: item.id,
                name: item.name,
                price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
                unit: item.unit || '',
                quantity: Number(item.quantity) || 0
            };
        }).filter(function(item) {
            return item.id && item.quantity > 0;
        })));
        if (shouldRender !== false) renderCart();
    }

    function loadCart() {
        try {
            const stored = localStorage.getItem(CART_KEY);
            const parsed = stored ? JSON.parse(stored) : [];
            cart = Array.isArray(parsed) ? parsed.map(normalizeItem).filter(Boolean) : [];
        } catch (error) {
            cart = [];
        }
        saveCart(false);
        renderCart();
    }

    function getCartQuantity() {
        return cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
    }

    function animateNavbarCount(newCount) {
        navbarCartCounts.forEach(function(countEl) {
            countEl.textContent = String(newCount);
            if (lastNavbarCount !== newCount) {
                countEl.classList.add('pulse');
                setTimeout(function() { countEl.classList.remove('pulse'); }, 320);
            }
        });
        lastNavbarCount = newCount;
    }

    function renderCart() {
        animateNavbarCount(getCartQuantity());
        if (modal && modal.classList.contains('active')) renderModal();
    }

    function initProductCards() {
        const cards = document.querySelectorAll('.carousel-track .product-card, #ofertas .product-card, .products-grid .product-card, .compras-carousel-track .product-card');
        cards.forEach(function(card, index) {
            const nameEl = card.querySelector('.product-name');
            const priceEl = card.querySelector('.price');
            const unitEl = card.querySelector('.price-unit');
            const descEl = card.querySelector('.product-desc');
            const catEl = card.querySelector('.product-category');
            if (!nameEl || !priceEl) return;
            const name = nameEl.textContent.trim();
            const priceMatch = priceEl.textContent.trim().match(/\$([0-9]+\.?[0-9]*)/);
            const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
            const id = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '-' + index;
            card.setAttribute('data-id', card.dataset.id || id);
            card.setAttribute('data-name', card.dataset.name || name);
            card.setAttribute('data-price', card.dataset.price || price);
            card.setAttribute('data-unit', card.dataset.unit || (unitEl ? unitEl.textContent.trim() : ''));
            card.setAttribute('data-desc', card.dataset.desc || (descEl ? descEl.textContent.trim() : ''));
            card.setAttribute('data-category', card.dataset.category || (catEl ? catEl.textContent.trim() : ''));
        });
    }

    function showCartToast(productName) {
        if (!cartToast || !cartToastText) return;
        cartToastText.textContent = '"' + productName + '" al carrito';
        cartToast.classList.add('show');
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(function() { cartToast.classList.remove('show'); }, 3000);
    }

    function addProduct(id, name, price, unit) {
        const existing = cart.find(function(item) { return item.id === id; });
        if (existing) existing.quantity += 1;
        else cart.push({ id: id, name: name, price: parseFloat(price) || 0, unit: unit || '', quantity: 1 });
        saveCart();
        showCartToast(name);
        openCartButtons.forEach(function(button) {
            button.classList.add('bump');
            setTimeout(function() { button.classList.remove('bump'); }, 240);
        });
    }

    function changeQuantity(id, delta) {
        const index = cart.findIndex(function(item) { return item.id === id; });
        if (index === -1) return;
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
        saveCart();
    }

    function removeItem(id) {
        cart = cart.filter(function(item) { return item.id !== id; });
        saveCart();
    }

    function clearCart() {
        if (cart.length === 0) return;
        cart = [];
        saveCart();
    }

    function updateModalSendState() {
        if (!sendWhatsappBtn) return;
        const hasName = modalBuyerName && modalBuyerName.value.trim().length > 0;
        sendWhatsappBtn.disabled = !(cart.length > 0 && hasName);
    }

    function renderModal() {
        if (!modalItemsContainer || !modalTotalSpan) return;
        let total = 0;
        if (cart.length === 0) {
            modalItemsContainer.innerHTML = '<div class="empty-cart">Tu carrito está vacío. Agrega productos para hacer un pedido.</div>';
        } else {
            modalItemsContainer.innerHTML = cart.map(function(item) {
                const subtotal = item.price * item.quantity;
                total += subtotal;
                return '<div class="modal-item" data-modal-id="' + escapeHtml(item.id) + '">' +
                    '<div class="modal-item-info">' +
                    '<div class="modal-item-name">' + escapeHtml(item.name || 'Producto') + '</div>' +
                    '<div class="modal-item-price">' + formatMoney(item.price) + ' c/u · ' + escapeHtml(item.unit || '') + '</div>' +
                    '</div>' +
                    '<div class="modal-item-controls">' +
                    '<button type="button" class="cart-qty-btn" data-id="' + escapeHtml(item.id) + '" data-action="decrease" aria-label="Disminuir cantidad">−</button>' +
                    '<span class="modal-item-qty">' + item.quantity + '</span>' +
                    '<button type="button" class="cart-qty-btn" data-id="' + escapeHtml(item.id) + '" data-action="increase" aria-label="Aumentar cantidad">+</button>' +
                    '<span class="modal-item-subtotal">' + formatMoney(subtotal) + '</span>' +
                    '<button type="button" class="modal-item-remove" data-id="' + escapeHtml(item.id) + '" aria-label="Eliminar producto">×</button>' +
                    '</div>' +
                    '</div>';
            }).join('');
        }
        modalTotalSpan.textContent = formatMoney(total);
        updateModalSendState();
    }

    function openModal() {
        if (!modal) return;
        renderModal();
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function generateWhatsAppMessage() {
        if (cart.length === 0) return '';
        const buyerName = modalBuyerName ? (modalBuyerName.value || '').trim() : '';
        const buyerLast = modalBuyerLast ? (modalBuyerLast.value || '').trim() : '';
        if (!buyerName) return '';
        const buyerFullName = buyerName + (buyerLast ? ' ' + buyerLast : '');
        const lines = [
            "*Nuevo Pedido - Verfrut's y R&M*",
            '',
            '*Comprador:* ' + buyerFullName,
            '',
            '*Resumen de productos:*'
        ];
        let total = 0;
        cart.forEach(function(item) {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            lines.push('- ' + item.name + ' x' + item.quantity + ' (' + item.unit + ') -> ' + formatMoney(subtotal));
        });
        lines.push('', '*Total estimado:* ' + formatMoney(total));
        return encodeURIComponent(lines.join('\n'));
    }

    function sendOrder() {
        if (cart.length === 0) {
            alert('No hay productos para enviar.');
            return;
        }
        const text = generateWhatsAppMessage();
        if (!text) {
            alert('Por favor ingresa tu nombre antes de enviar el pedido.');
            return;
        }
        window.location.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text;
        cart = [];
        saveCart();
        closeModal();
    }

    openCartButtons.forEach(function(button) {
        button.addEventListener('click', openModal);
    });
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (closeModalXBtn) closeModalXBtn.addEventListener('click', closeModal);
    if (sendWhatsappBtn) sendWhatsappBtn.addEventListener('click', sendOrder);
    if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);
    if (modalBuyerName) modalBuyerName.addEventListener('input', updateModalSendState);
    if (modalBuyerLast) modalBuyerLast.addEventListener('input', updateModalSendState);
    if (cartToastAction) cartToastAction.addEventListener('click', function() {
        if (cartToast) cartToast.classList.remove('show');
        openModal();
    });
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) closeModal();
            const qtyBtn = event.target.closest('.cart-qty-btn');
            const removeBtn = event.target.closest('.modal-item-remove');
            if (qtyBtn) changeQuantity(qtyBtn.dataset.id, qtyBtn.dataset.action === 'increase' ? 1 : -1);
            if (removeBtn) removeItem(removeBtn.dataset.id);
        });
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });
    }

    document.addEventListener('click', function(event) {
        const btn = event.target.closest('.add-to-cart');
        if (!btn) return;
        const card = btn.closest('.product-card, .slider-card');
        if (!card) return;
        event.preventDefault();
        let id = card.dataset.id;
        let name = card.dataset.name;
        let price = card.dataset.price;
        let unit = card.dataset.unit;
        if (!id || !name || price === undefined) {
            const nameEl = card.querySelector('.product-name');
            const priceEl = card.querySelector('.price');
            const unitEl = card.querySelector('.price-unit');
            name = name || (nameEl ? nameEl.textContent.trim() : '');
            if (price === undefined && priceEl) {
                const match = priceEl.textContent.trim().match(/\$([0-9]+\.?[0-9]*)/);
                price = match ? parseFloat(match[1]) : 0;
            }
            unit = unit || (unitEl ? unitEl.textContent.trim() : '');
            id = id || name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        }
        if (id && name && price !== undefined) addProduct(id, name, price, unit);
    });

    window.addEventListener('storage', function(event) {
        if (event.key === CART_KEY) loadCart();
    });

    initProductCards();
    loadCart();
    if (document.body && document.body.dataset.cartPage === 'true') setTimeout(openModal, 500);
}

document.addEventListener('DOMContentLoaded', function() {
    initActiveNav();
    initScrollTargets();
    initSharedCart();
});
/* FIN JS: NAVEGACION Y CARRITO COMPARTIDO */
/* ============================================
   INICIO JS: compras.html — Auto-sliders por categoria
   ============================================ */

function initComprasAutoSliders() {
    var tracks = document.querySelectorAll('.compras-carousel-track');
    if (!tracks.length) return;

    tracks.forEach(function (track) {
        var autoTimer = null;
        var AUTO_DELAY = 8000;

        function getCardWidth() {
            var card = track.querySelector('.product-card');
            if (!card) return 240;
            var style = window.getComputedStyle(track);
            var gap = parseFloat(style.gap || style.columnGap || '0') || 22;
            return card.offsetWidth + gap;
        }

        function scrollNext() {
            var maxScroll = track.scrollWidth - track.clientWidth;
            if (track.scrollLeft >= maxScroll - 8) {
                /* Llegó al final: vuelve al inicio suavemente */
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                var cardW = getCardWidth();
                var visible = Math.max(1, Math.floor(track.clientWidth / cardW));
                track.scrollBy({ left: cardW * visible, behavior: 'smooth' });
            }
        }

        function startAuto() {
            if (autoTimer) clearInterval(autoTimer);
            autoTimer = setInterval(scrollNext, AUTO_DELAY);
        }

        function stopAuto() {
            clearInterval(autoTimer);
            autoTimer = null;
        }

        /* Pausa al hacer hover o touch */
        track.addEventListener('mouseenter', stopAuto);
        track.addEventListener('mouseleave', startAuto);
        track.addEventListener('touchstart', stopAuto, { passive: true });
        track.addEventListener('touchend', function () {
            setTimeout(startAuto, 3000);
        }, { passive: true });

        /* Botones prev/next del wrapper */
        var wrapper = track.closest('.compras-slider-wrapper');
        if (wrapper) {
            var prevBtn = wrapper.querySelector('.carousel-btn.prev');
            var nextBtn = wrapper.querySelector('.carousel-btn.next');
            if (prevBtn) {
                prevBtn.addEventListener('click', function () {
                    stopAuto();
                    var cardW = getCardWidth();
                    var visible = Math.max(1, Math.floor(track.clientWidth / cardW));
                    track.scrollBy({ left: -(cardW * visible), behavior: 'smooth' });
                    setTimeout(startAuto, 3000);
                });
            }
            if (nextBtn) {
                nextBtn.addEventListener('click', function () {
                    stopAuto();
                    scrollNext();
                    setTimeout(startAuto, 3000);
                });
            }
        }

        startAuto();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initComprasAutoSliders();
});

/* ============================================
   FIN JS: compras.html — Auto-sliders por categoria
   ============================================ */


/* ============================================
   INICIO JS: index.html — Slider hero 7 slides (trasladado de inline)
   ============================================ */

(function () {
    /* Solo ejecuta en index.html donde existe el slider con 7 dots reales */
    var dotContainer = document.querySelector('.slider-dots');
    var sliderTrack = document.getElementById('sliderTrack');
    if (!dotContainer || !sliderTrack) return;

    var TOTAL_REAL = dotContainer.querySelectorAll('.dot').length;
    if (TOTAL_REAL === 0) return;

    var dots = dotContainer.querySelectorAll('.dot');
    var current = 1;
    var isAnimating = false;
    var autoTimer;

    function goTo(index, animate) {
        if (typeof animate === 'undefined') animate = true;
        sliderTrack.style.transition = animate ? 'transform 0.55s cubic-bezier(.4,0,.2,1)' : 'none';
        sliderTrack.style.transform = 'translateX(-' + (index * 100) + '%)';
        var dotIndex = index - 1;
        if (dotIndex < 0) dotIndex = TOTAL_REAL - 1;
        if (dotIndex >= TOTAL_REAL) dotIndex = 0;
        dots.forEach(function (d, i) { d.classList.toggle('active', i === dotIndex); });
        current = index;
    }

    function next() {
        if (isAnimating) return;
        isAnimating = true;
        goTo(current + 1);
        sliderTrack.addEventListener('transitionend', function onEnd() {
            sliderTrack.removeEventListener('transitionend', onEnd);
            if (current >= TOTAL_REAL + 1) { goTo(1, false); }
            isAnimating = false;
        });
    }

    function prev() {
        if (isAnimating) return;
        isAnimating = true;
        goTo(current - 1);
        sliderTrack.addEventListener('transitionend', function onEnd() {
            sliderTrack.removeEventListener('transitionend', onEnd);
            if (current <= 0) { goTo(TOTAL_REAL, false); }
            isAnimating = false;
        });
    }

    function resetAuto() { clearInterval(autoTimer); autoTimer = setInterval(next, 5000); }

    var btnNext = document.querySelector('.slider-arrow.next');
    var btnPrev = document.querySelector('.slider-arrow.prev');
    if (btnNext) btnNext.addEventListener('click', function () { next(); resetAuto(); });
    if (btnPrev) btnPrev.addEventListener('click', function () { prev(); resetAuto(); });

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () { goTo(i + 1); resetAuto(); });
    });

    goTo(1, false);
    resetAuto();
}());

/* ============================================
   FIN JS: index.html — Slider hero 7 slides
   ============================================ */