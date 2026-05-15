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
            toggle.addEventListener('click', function () { nav.classList.toggle('active'); });
            
            nav.querySelectorAll('a').forEach(function (a) {
                a.addEventListener('click', function (e) {
                    var parentLi = a.closest('li');
                    
                    if (parentLi && parentLi.classList.contains('dropdown')) {
                        return;
                    }
                    
                    if (a.closest('.dropdown-menu')) {
                        nav.classList.remove('active');
                        return;
                    }
                    
                    nav.classList.remove('active');
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
           6. CURSOR PERSONALIZADO MINIMALISTA
           ============================================ */
        function initCursor() {
            if (window.matchMedia('(pointer: coarse)').matches) return;

            const dot = document.createElement('div');
            dot.className = 'cursor-dot';
            const ring = document.createElement('div');
            ring.className = 'cursor-ring';
            document.body.appendChild(dot);
            document.body.appendChild(ring);

            let mouseX = 0, mouseY = 0;
            let ringX = 0, ringY = 0;

            document.addEventListener('mousemove', function (e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
                dot.style.left = mouseX + 'px';
                dot.style.top = mouseY + 'px';
            });

            function animateRing() {
                ringX += (mouseX - ringX) * 0.18;
                ringY += (mouseY - ringY) * 0.18;
                ring.style.left = ringX + 'px';
                ring.style.top = ringY + 'px';
                requestAnimationFrame(animateRing);
            }
            animateRing();

            const interactives = 'a, button, .slider-arrow, .product-card, .category-card, .add-to-cart, .scroll-top, .menu-toggle, .dot, .lightbox-close, .product-image';
            document.querySelectorAll(interactives).forEach(function (el) {
                el.addEventListener('mouseenter', function () { document.body.classList.add('hover-link'); });
                el.addEventListener('mouseleave', function () { document.body.classList.remove('hover-link'); });
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
           8. LIGHTBOX - SOLO PRODUCTOS DESTACADOS
           ============================================ */
        function initLightbox() {
            const overlay = document.createElement('div');
            overlay.className = 'lightbox-overlay';
            overlay.innerHTML = '<span class="lightbox-close">&times;</span><img class="lightbox-img" src="" alt="Vista ampliada">';
            document.body.appendChild(overlay);

            const img = overlay.querySelector('.lightbox-img');
            const closeBtn = overlay.querySelector('.lightbox-close');

            function open(src) {
                img.src = src;
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            function close() {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }

            document.querySelectorAll('.product-image').forEach(function (el) {
                el.addEventListener('click', function (e) {
                    e.stopPropagation();
                    open(el.src);
                });
            });

            overlay.addEventListener('click', close);
            closeBtn.addEventListener('click', close);
            
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
           10. NAVBAR SCROLL EFFECT
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
            initCursor();
            initSmoothScroll();
            initLightbox();
            initProductCarousel();
            initNavbarScroll();
        });
    