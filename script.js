/* ================================================
   SCRIPT DE INTERACTIVIDAD - VERFRUT'S Y R&M
   ================================================ */

/* -----------------------------------------------
   SECCION 1: PANTALLA DE CARGA
   ----------------------------------------------- */
function initLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;

    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 400);
    });

    if (document.readyState === 'complete') {
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 400);
    }
}

/* -----------------------------------------------
   SECCION 2: SLIDER INFINITO
   ----------------------------------------------- */
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
        if (!animate) {
            track.classList.add('no-transition');
        } else {
            track.classList.remove('no-transition');
        }

        track.style.transform = 'translateX(-' + (index * 100) + '%)';

        if (!animate) {
            void track.offsetWidth;
            track.classList.remove('no-transition');
        }

        let dotIndex = index - 1;
        if (dotIndex < 0) dotIndex = totalReal - 1;
        if (dotIndex >= totalReal) dotIndex = 0;

        dots.forEach(function(d, idx) {
            d.classList.toggle('active', idx === dotIndex);
        });
    }

    function next() {
        if (isTransitioning) return;
        isTransitioning = true;

        current++;
        moveTo(current, true);

        if (current === totalSlides - 1) {
            setTimeout(function() {
                current = 1;
                moveTo(current, false);
                isTransitioning = false;
            }, TRANSITION_TIME);
        } else {
            setTimeout(function() {
                isTransitioning = false;
            }, TRANSITION_TIME);
        }
    }

    function prev() {
        if (isTransitioning) return;
        isTransitioning = true;

        current--;
        moveTo(current, true);

        if (current === 0) {
            setTimeout(function() {
                current = totalReal;
                moveTo(current, false);
                isTransitioning = false;
            }, TRANSITION_TIME);
        } else {
            setTimeout(function() {
                isTransitioning = false;
            }, TRANSITION_TIME);
        }
    }

    function start() {
        if (timer) clearInterval(timer);
        timer = setInterval(next, 5000);
    }

    function stop() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    moveTo(current, false);

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stop();
            next();
            start();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stop();
            prev();
            start();
        });
    }

    dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            if (isTransitioning) return;
            stop();

            let target = parseInt(this.dataset.index) + 1;
            current = target;
            moveTo(current, true);

            setTimeout(function() {
                isTransitioning = false;
            }, TRANSITION_TIME);

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

/* -----------------------------------------------
   SECCION 3: MODAL DE IMAGENES
   ----------------------------------------------- */
function initModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;

    const modalImg = document.getElementById('modalImg');
    const modalClose = document.getElementById('modalClose');

    function open(src) {
        modalImg.src = src;
        modal.classList.add('active');
    }

    function close() {
        modal.classList.remove('active');
    }

    document.querySelectorAll('img').forEach(function(img) {
        if (!img.closest('nav') && !img.closest('footer') && !img.closest('.modal') && !img.classList.contains('author-photo')) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() { open(img.src); });
        }
    });

    if (modalClose) {
        modalClose.addEventListener('click', close);
    }
    
    modal.addEventListener('click', function(e) { 
        if (e.target === modal) close(); 
    });
    
    document.addEventListener('keydown', function(e) { 
        if (e.key === 'Escape') close(); 
    });
}

/* -----------------------------------------------
   SECCION 4: MENU MOVIL
   ----------------------------------------------- */
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('navLinks');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function() { 
        nav.classList.toggle('active'); 
    });

    nav.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function() { 
            nav.classList.remove('active'); 
        });
    });
}

/* -----------------------------------------------
   SECCION 5: DROPDOWN EN MOVIL
   ----------------------------------------------- */
function initDropdown() {
    document.querySelectorAll('.dropdown').forEach(function(drop) {
        drop.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                drop.classList.toggle('active');
            }
        });
    });
}

/* -----------------------------------------------
   SECCION 6: BOTON IR ARRIBA
   ----------------------------------------------- */
function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* -----------------------------------------------
   SECCION 7: CURSOR INTERACTIVO CON ROTACION
   ----------------------------------------------- */
function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const outline = document.createElement('div');
    outline.className = 'cursor-outline';
    document.body.appendChild(dot);
    document.body.appendChild(outline);

    let x = 0;
    let y = 0;
    let ox = 0;
    let oy = 0;

    const cursorStates = [
        { type: 'default' },
        { type: 'image', src: 'Apio.png' },
        { type: 'image', src: 'Zanahoria.png' },
        { type: 'image', src: 'Mango.png' }
    ];
    
    let currentCursorState = 0;

    function applyCursorState() {
        const state = cursorStates[currentCursorState];
        
        if (state.type === 'default') {
            outline.style.backgroundImage = 'none';
            outline.style.borderColor = 'rgba(46, 125, 50, 0.5)';
            outline.style.backgroundColor = 'transparent';
        } else {
            outline.style.backgroundImage = 'url(' + state.src + ')';
            outline.style.backgroundSize = 'cover';
            outline.style.backgroundPosition = 'center';
            outline.style.borderColor = 'transparent';
            outline.style.backgroundColor = 'transparent';
        }
    }

    setInterval(function() {
        currentCursorState = (currentCursorState + 1) % cursorStates.length;
        applyCursorState();
    }, 7000);

    document.addEventListener('mousemove', function(e) {
        x = e.clientX;
        y = e.clientY;
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
    });

    function animate() {
        ox += (x - ox) * 0.15;
        oy += (y - oy) * 0.15;
        outline.style.left = ox + 'px';
        outline.style.top = oy + 'px';
        requestAnimationFrame(animate);
    }
    animate();

    const interactives = 'a, button, .slider-arrow, .gallery-item, .product-card, .category-card, .add-to-cart, .scroll-top, .menu-toggle, .testimonial-card, .show-more-btn, .page-hero-btn';
    
    document.querySelectorAll(interactives).forEach(function(el) {
        el.addEventListener('mouseenter', function() { 
            document.body.classList.add('hover-link'); 
        });
        el.addEventListener('mouseleave', function() { 
            document.body.classList.remove('hover-link'); 
        });
    });
}

/* -----------------------------------------------
   SECCION 8: SCROLL SUAVE PARA ANCLAS
   ----------------------------------------------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
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

/* -----------------------------------------------
   SECCION 9: VER MAS / VER MENOS EN PRODUCTOS
   ----------------------------------------------- */
function initShowMore() {
    document.querySelectorAll('.show-more-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const grid = document.getElementById(targetId);
            if (!grid) return;

            const hiddenItems = grid.querySelectorAll('.product-hidden');
            const originalText = this.dataset.originalText;

            if (hiddenItems.length > 0) {
                hiddenItems.forEach(function(item) {
                    item.classList.remove('product-hidden');
                });
                this.textContent = 'Ver menos';
            } else {
                const allItems = grid.querySelectorAll('.product-card');
                allItems.forEach(function(item, index) {
                    if (index >= 6) {
                        item.classList.add('product-hidden');
                    }
                });
                this.textContent = originalText;
            }
        });
    });
}

/* -----------------------------------------------
   SECCION 10: INICIALIZACION GLOBAL
   ----------------------------------------------- */
document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    initSlider();
    initModal();
    initMobileMenu();
    initDropdown();
    initScrollTop();
    initCursor();
    initSmoothScroll();
    initShowMore();
});