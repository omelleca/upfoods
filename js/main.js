/* =============================================
   MIGUEL MELLE — PORTFOLIO
   GSAP + Lenis Animation Engine
   Brutalist × Retro × Contemporary
   ============================================= */

// ==========================================
// 1. LENIS SMOOTH SCROLL
// ==========================================
const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);


// ==========================================
// 2. CUSTOM CURSOR (brutalist square)
// ==========================================
const cursorEl = document.getElementById('cursor');
if (cursorEl) {
    const cursorLabel = cursorEl.querySelector('.cursor-label');
    let cX = window.innerWidth / 2, cY = window.innerHeight / 2;
    let tX = cX, tY = cY;

    document.addEventListener('mousemove', (e) => {
        tX = e.clientX;
        tY = e.clientY;
    });

    gsap.ticker.add(() => {
        const dt = 1 - Math.pow(0.78, gsap.ticker.deltaRatio());
        cX += (tX - cX) * dt;
        cY += (tY - cY) * dt;
        gsap.set(cursorEl, { x: cX, y: cY });
    });

    // Hover effects
    document.querySelectorAll('a, button, .work-card, .service-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorEl.classList.add('hovering');
            if (el.dataset.cursorLabel) {
                cursorEl.classList.add('show-label');
                cursorLabel.textContent = el.dataset.cursorLabel;
            }
        });
        el.addEventListener('mouseleave', () => {
            cursorEl.classList.remove('hovering', 'show-label');
        });
    });
}


// ==========================================
// 3. MAGNETIC BUTTONS
// ==========================================
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    const strength = parseInt(btn.dataset.strength) || 20;

    btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(btn, {
            x: x * (strength / 100),
            y: y * (strength / 100),
            duration: 0.4,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    });
});


// ==========================================
// 4. LIVE CLOCK
// ==========================================
function updateClock() {
    const el = document.getElementById('nav-clock');
    if (!el) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();


// ==========================================
// 5. PRELOADER
// ==========================================
function initLoader() {
    const tl = gsap.timeline({
        onComplete: () => revealPage()
    });

    const counterEl = document.getElementById('loader-counter');
    const barFill = document.getElementById('loader-bar-fill');
    const counter = { val: 0 };

    // Show tag
    tl.to('.loader-tag', {
        opacity: 1,
        duration: 0.4,
    }, 0);

    // Show counter
    tl.to('.loader-counter', {
        opacity: 1,
        duration: 0.3,
    }, 0.1);

    // Animate name lines
    tl.to('.loader-name-line', {
        y: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power4.out',
    }, 0.2);

    // Count up
    tl.to(counter, {
        val: 100,
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate: () => {
            const v = Math.round(counter.val);
            counterEl.textContent = String(v).padStart(3, '0');
            barFill.style.width = v + '%';
        }
    }, 0.3);

    // Pause
    tl.to({}, { duration: 0.4 });

    // Fade inner
    tl.to('.loader-inner', {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: 'power3.in'
    });

    // Wipe 1
    tl.to('.loader-wipe-1', {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut'
    }, '-=0.2');

    // Wipe 2 (red flash)
    tl.to('.loader-wipe-2', {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut'
    }, '-=0.6');

    // Kill
    tl.set('.loader', { display: 'none' });
}


// ==========================================
// 6. PAGE REVEAL
// ==========================================
function revealPage() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Hero name
    tl.to('.hero-name-word', {
        y: 0,
        duration: 1.4,
        stagger: 0.15,
    });

    // Tags
    tl.to('.hero-top', {
        opacity: 1,
        y: 0,
        duration: 0.7,
    }, '-=1');

    // Stripe
    tl.to('.hero-stripe', {
        opacity: 1,
        duration: 0.6,
    }, '-=0.6');

    // Bio
    tl.to('.hero-bio', {
        opacity: 1,
        y: 0,
        duration: 0.7,
    }, '-=0.4');

    // CTA
    tl.to('.hero-cta-wrap', {
        opacity: 1,
        y: 0,
        duration: 0.7,
    }, '-=0.5');

    // Scroll indicator
    tl.to('.hero-scroll', {
        opacity: 1,
        duration: 0.6,
    }, '-=0.4');

    // Corners
    tl.to('.hero-corner', {
        opacity: 0.5,
        duration: 0.6,
        stagger: 0.1,
    }, '-=0.5');

    // Grid overlay
    tl.to('.hero-grid-overlay', {
        opacity: 1,
        duration: 1,
    }, '-=0.8');

    // Go
    initScrollAnimations();
}


// ==========================================
// 7. SCROLL-DRIVEN ANIMATIONS
// ==========================================
function initScrollAnimations() {

    // --- Nav scroll ---
    const nav = document.getElementById('nav');
    ScrollTrigger.create({
        start: 'top -60',
        end: 99999,
        onUpdate: (self) => {
            if (self.direction === 1 && self.scroll() > 60) {
                nav.classList.add('scrolled');
            }
            if (self.scroll() < 60) {
                nav.classList.remove('scrolled');
            }
        }
    });

    // --- Hero parallax on scroll ---
    gsap.to('.hero-name', {
        yPercent: -25,
        opacity: 0.2,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
        }
    });

    gsap.to('.hero-stripe', {
        xPercent: -8,
        rotation: 0,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
        }
    });

    gsap.to('.hero-grid-overlay', {
        opacity: 0,
        scrollTrigger: {
            trigger: '.hero',
            start: '30% top',
            end: 'bottom top',
            scrub: 1,
        }
    });


    // --- Marquee skew on scroll ---
    gsap.to('.marquee-content', {
        skewX: -3,
        scrollTrigger: {
            trigger: '.marquee',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
        }
    });


    // --- Section labels ---
    document.querySelectorAll('.section-label').forEach(label => {
        gsap.from(label.children, {
            y: 20,
            opacity: 0,
            stagger: 0.08,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: label, start: 'top 88%' }
        });
    });

    // --- Section titles ---
    document.querySelectorAll('.section-title').forEach(title => {
        gsap.from(title, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: title, start: 'top 85%' }
        });
    });


    // --- reveal-text ---
    document.querySelectorAll('.reveal-text').forEach(el => {
        gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' }
        });
    });

    // --- reveal-fade ---
    document.querySelectorAll('.reveal-fade').forEach(el => {
        gsap.from(el, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' }
        });
    });

    // --- reveal-up ---
    document.querySelectorAll('.reveal-up').forEach((el, i) => {
        gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 0.7,
            delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' }
        });
    });


    // --- Work cards stagger ---
    const workCards = gsap.utils.toArray('.work-card');
    workCards.forEach((card, i) => {
        gsap.from(card, {
            y: 80,
            opacity: 0,
            duration: 0.9,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 88%'
            }
        });

        // Parallax on card image
        gsap.to(card.querySelector('.work-card-placeholder'), {
            yPercent: -8,
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
            }
        });
    });


    // --- About photo ---
    gsap.from('.about-photo', {
        x: -60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-grid', start: 'top 75%' }
    });

    gsap.from('.about-col-right', {
        x: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-grid', start: 'top 75%' }
    });


    // --- Stat counters ---
    document.querySelectorAll('.stat-val').forEach(el => {
        const target = parseInt(el.dataset.count);
        const obj = { val: 0 };

        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            onEnter: () => {
                gsap.to(obj, {
                    val: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: () => {
                        el.textContent = Math.round(obj.val);
                    }
                });
            },
            once: true
        });
    });

    // --- Stat blocks stagger ---
    gsap.from('.stat-block', {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-stats', start: 'top 82%' }
    });


    // --- Service items ---
    document.querySelectorAll('.service-item').forEach((item) => {
        gsap.from(item, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 88%' }
        });
    });


    // --- Manifesto text word reveal ---
    const manifestoEl = document.getElementById('manifesto-text');
    if (manifestoEl) {
        const raw = manifestoEl.textContent.trim();
        const words = raw.split(/\s+/);
        manifestoEl.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');

        const wordEls = manifestoEl.querySelectorAll('.word');

        gsap.to(wordEls, {
            opacity: 1,
            stagger: 0.04,
            ease: 'none',
            scrollTrigger: {
                trigger: '.manifesto',
                start: 'top 65%',
                end: 'bottom 45%',
                scrub: 1,
            }
        });
    }


    // --- Contact ---
    gsap.from('.contact-title', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact', start: 'top 70%' }
    });

    gsap.from('.contact-sub', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-sub', start: 'top 88%' }
    });

    gsap.from('.contact-link', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-links', start: 'top 85%' }
    });


    // --- Footer ---
    gsap.from('.footer-top > *', {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.footer', start: 'top 90%' }
    });
}


// ==========================================
// 8. SMOOTH ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target, { offset: -60, duration: 1.4 });
            // Close mobile menu
            if (document.getElementById('mob-menu').classList.contains('active')) {
                closeMobMenu();
            }
        }
    });
});


// ==========================================
// 9. MOBILE MENU
// ==========================================
const hamburger = document.getElementById('nav-hamburger');
const mobMenu = document.getElementById('mob-menu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
    menuOpen ? closeMobMenu() : openMobMenu();
});

function openMobMenu() {
    menuOpen = true;
    hamburger.classList.add('active');
    mobMenu.classList.add('active');
    lenis.stop();

    const tl = gsap.timeline();
    tl.to('.mob-menu-bg', { y: 0, duration: 0.7, ease: 'power4.inOut' });
    tl.to('.mob-menu-inner', { opacity: 1, duration: 0.3 }, '-=0.3');
    tl.to('.mob-link span', {
        y: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out'
    }, '-=0.2');
    tl.from('.mob-menu-footer a', {
        y: 15, opacity: 0, stagger: 0.05, duration: 0.4, ease: 'power3.out'
    }, '-=0.3');
}

function closeMobMenu() {
    menuOpen = false;
    hamburger.classList.remove('active');
    lenis.start();

    const tl = gsap.timeline({
        onComplete: () => {
            mobMenu.classList.remove('active');
            gsap.set('.mob-link span', { y: '120%' });
            gsap.set('.mob-menu-inner', { opacity: 0 });
        }
    });
    tl.to('.mob-menu-inner', { opacity: 0, duration: 0.25 });
    tl.to('.mob-menu-bg', { y: '-100%', duration: 0.6, ease: 'power4.inOut' }, '-=0.1');
}


// ==========================================
// 10. INIT
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    // Set initial states
    gsap.set('.hero-name-word', { y: '110%' });
    gsap.set('.hero-top', { opacity: 0, y: 15 });
    gsap.set('.hero-stripe', { opacity: 0 });
    gsap.set('.hero-bio', { opacity: 0, y: 20 });
    gsap.set('.hero-cta-wrap', { opacity: 0, y: 20 });
    gsap.set('.hero-scroll', { opacity: 0 });
    gsap.set('.hero-corner', { opacity: 0 });
    gsap.set('.hero-grid-overlay', { opacity: 0 });
    gsap.set('.mob-link span', { y: '120%' });
    gsap.set('.mob-menu-bg', { y: '-100%' });

    initLoader();
});


// ==========================================
// 11. RESIZE
// ==========================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 250);
});
