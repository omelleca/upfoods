/* =============================================
   UPFOODS — GSAP + Lenis Animation Engine
   Awwwards-level interactions & motion design
   ============================================= */

// ==========================================
// 1. SMOOTH SCROLL (Lenis)
// ==========================================
const lenis = new Lenis({
    duration: 1.2,
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

// Integrate Lenis with GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);


// ==========================================
// 2. CUSTOM CURSOR
// ==========================================
const cursorEl = document.getElementById('cursor');
const cursorDot = cursorEl.querySelector('.cursor-dot');
const cursorRing = cursorEl.querySelector('.cursor-ring');
const cursorText = cursorEl.querySelector('.cursor-text');

let cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let cursorTarget = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

document.addEventListener('mousemove', (e) => {
    cursorTarget.x = e.clientX;
    cursorTarget.y = e.clientY;
});

gsap.ticker.add(() => {
    const dt = 1.0 - Math.pow(0.82, gsap.ticker.deltaRatio());
    cursorPos.x += (cursorTarget.x - cursorPos.x) * dt;
    cursorPos.y += (cursorTarget.y - cursorPos.y) * dt;
    gsap.set(cursorEl, { x: cursorPos.x, y: cursorPos.y });
});

// Hover states
document.querySelectorAll('a, button, .showcase-card, .expertise-item, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorEl.classList.add('cursor-hover');
        
        if (el.dataset.cursorText) {
            cursorEl.classList.add('cursor-text-visible');
            cursorText.textContent = el.dataset.cursorText;
        }
    });
    el.addEventListener('mouseleave', () => {
        cursorEl.classList.remove('cursor-hover', 'cursor-text-visible');
    });
});


// ==========================================
// 3. MAGNETIC BUTTONS
// ==========================================
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    const strength = parseInt(btn.dataset.strength) || 25;
    
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(btn, {
            x: x * (strength / 100),
            y: y * (strength / 100),
            duration: 0.4,
            ease: 'power2.out'
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.5)'
        });
    });
});


// ==========================================
// 4. PRELOADER
// ==========================================
function initPreloader() {
    const preloaderTl = gsap.timeline({
        onComplete: () => {
            revealPage();
        }
    });

    const counter = { val: 0 };
    const countEl = document.getElementById('preloader-count');
    const barFill = document.getElementById('preloader-bar-fill');
    const brandSpans = document.querySelectorAll('.preloader-brand-text span');

    // Animate brand text in
    preloaderTl.to(brandSpans, {
        y: 0,
        opacity: 1,
        stagger: 0.06,
        duration: 0.6,
        ease: 'power3.out',
    }, 0);

    // Count up
    preloaderTl.to(counter, {
        val: 100,
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: () => {
            const v = Math.round(counter.val);
            countEl.textContent = v;
            barFill.style.width = v + '%';
        }
    }, 0.3);

    // Fade out inner
    preloaderTl.to('.preloader-inner', {
        opacity: 0,
        y: -40,
        duration: 0.6,
        ease: 'power3.in'
    }, '+=0.3');

    // Slide overlays
    preloaderTl.to('.preloader-overlay-1', {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut'
    }, '-=0.3');

    preloaderTl.to('.preloader-overlay-2', {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut',
    }, '-=0.7');

    // Kill preloader
    preloaderTl.set('.preloader', { display: 'none' });
}


// ==========================================
// 5. PAGE REVEAL + HERO ANIMATIONS
// ==========================================
function revealPage() {
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Title words slide up
    heroTl.to('.hero-title-word', {
        y: 0,
        duration: 1.4,
        stagger: 0.12,
    });

    // Eyebrow
    heroTl.to('.hero-eyebrow', {
        opacity: 1,
        y: 0,
        duration: 0.8,
    }, '-=1');

    // Description
    heroTl.to('.hero-description', {
        opacity: 1,
        y: 0,
        duration: 0.8,
    }, '-=0.6');

    // CTA button
    heroTl.to('.hero-cta', {
        opacity: 1,
        y: 0,
        duration: 0.8,
    }, '-=0.5');

    // Scroll indicator
    heroTl.to('.hero-scroll-indicator', {
        opacity: 1,
        duration: 0.8,
    }, '-=0.4');

    // Badge
    heroTl.to('.hero-badge', {
        opacity: 1,
        duration: 0.8,
        scale: 1,
    }, '-=0.6');

    // Start scroll-driven animations AFTER reveal
    initScrollAnimations();
}


// ==========================================
// 6. SCROLL-DRIVEN ANIMATIONS
// ==========================================
function initScrollAnimations() {

    // --- Nav scroll behavior ---
    const nav = document.getElementById('nav');
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        onUpdate: (self) => {
            if (self.direction === 1) {
                nav.classList.add('scrolled');
            }
            if (self.scroll() < 80) {
                nav.classList.remove('scrolled');
            }
        }
    });

    // --- Parallax hero gradients ---
    gsap.to('.hero-gradient-1', {
        y: 300,
        x: -100,
        scale: 1.3,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
        }
    });

    gsap.to('.hero-gradient-2', {
        y: -200,
        x: 150,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
        }
    });

    gsap.to('.hero-gradient-3', {
        y: 100,
        scale: 0.5,
        opacity: 0,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
        }
    });

    // --- Hero title parallax on scroll ---
    gsap.to('.hero-title', {
        yPercent: -30,
        opacity: 0.3,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
        }
    });


    // --- Reveal text animations ---
    document.querySelectorAll('.reveal-text').forEach(el => {
        gsap.from(el, {
            y: 80,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        });
    });


    // --- Reveal fade animations ---
    document.querySelectorAll('.reveal-fade').forEach(el => {
        gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        });
    });


    // --- Reveal up animations ---
    document.querySelectorAll('.reveal-up').forEach((el, i) => {
        gsap.from(el, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none',
            }
        });
    });


    // --- Section labels ---
    document.querySelectorAll('.section-label').forEach(label => {
        const children = label.children;
        gsap.from(children, {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: label,
                start: 'top 85%',
            }
        });
    });


    // --- Stat counters ---
    document.querySelectorAll('.stat-value').forEach(el => {
        const target = parseInt(el.dataset.count);
        const obj = { val: 0 };

        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
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


    // --- Stat cards stagger ---
    gsap.from('.stat-card', {
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.about-stats',
            start: 'top 80%',
        }
    });


    // --- Expertise items ---
    document.querySelectorAll('.expertise-item').forEach((item, i) => {
        gsap.from(item, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 88%',
            }
        });
    });


    // --- Horizontal Scroll Showcase ---
    const showcaseTrack = document.querySelector('.showcase-track');
    if (showcaseTrack) {
        const cards = gsap.utils.toArray('.showcase-card');
        const totalScroll = showcaseTrack.scrollWidth - window.innerWidth + 
                           parseInt(getComputedStyle(document.documentElement).getPropertyValue('--container-padding')) * 2;

        gsap.to(showcaseTrack, {
            x: -totalScroll,
            ease: 'none',
            scrollTrigger: {
                trigger: '.showcase',
                start: 'top top',
                end: () => '+=' + totalScroll,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        });

        // Cards parallax
        cards.forEach((card, i) => {
            gsap.from(card, {
                y: 60 + (i * 20),
                opacity: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: '.showcase',
                    start: 'top 70%',
                }
            });
        });
    }


    // --- Philosophy text word-by-word reveal ---
    const philosophyText = document.getElementById('philosophy-text');
    if (philosophyText) {
        const text = philosophyText.textContent.trim();
        const words = text.split(/\s+/);
        philosophyText.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');

        const wordEls = philosophyText.querySelectorAll('.word');
        
        gsap.to(wordEls, {
            opacity: 1,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
                trigger: '.philosophy-content',
                start: 'top 70%',
                end: 'bottom 50%',
                scrub: 1,
            }
        });
    }


    // --- Value cards ---
    gsap.from('.value-card', {
        y: 80,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.philosophy-values',
            start: 'top 80%',
        }
    });


    // --- Testimonial ---
    gsap.from('.testimonial-wrapper', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.testimonials',
            start: 'top 70%',
        }
    });


    // --- CTA section ---
    gsap.from('.cta-title', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 70%',
        }
    });

    gsap.from('.cta-desc', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.cta-bottom',
            start: 'top 85%',
        }
    });

    gsap.from('.btn-large', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.cta-bottom',
            start: 'top 85%',
        }
    });


    // --- Footer reveal ---
    gsap.from('.footer-top > *', {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 85%',
        }
    });


    // --- Marquee speed on scroll ---
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        gsap.to('.marquee-content', {
            skewX: -2,
            scrollTrigger: {
                trigger: '.marquee-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
            }
        });
    }
}


// ==========================================
// 7. SMOOTH SCROLL ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target, {
                offset: -80,
                duration: 1.5,
            });

            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });
});


// ==========================================
// 8. MOBILE MENU
// ==========================================
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
    if (!menuOpen) {
        openMobileMenu();
    } else {
        closeMobileMenu();
    }
});

function openMobileMenu() {
    menuOpen = true;
    hamburger.classList.add('active');
    mobileMenu.classList.add('active');
    lenis.stop();

    const tl = gsap.timeline();
    tl.to('.mobile-menu-bg', {
        y: 0,
        duration: 0.8,
        ease: 'power4.inOut',
    });
    tl.to('.mobile-menu-content', {
        opacity: 1,
        duration: 0.4,
    }, '-=0.3');
    tl.to('.mobile-menu-link span', {
        y: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power3.out',
    }, '-=0.2');
    tl.from('.mobile-menu-social a', {
        y: 20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: 'power3.out',
    }, '-=0.3');
}

function closeMobileMenu() {
    menuOpen = false;
    hamburger.classList.remove('active');
    lenis.start();

    const tl = gsap.timeline({
        onComplete: () => {
            mobileMenu.classList.remove('active');
            gsap.set('.mobile-menu-link span', { y: '120%' });
            gsap.set('.mobile-menu-content', { opacity: 0 });
        }
    });

    tl.to('.mobile-menu-content', {
        opacity: 0,
        duration: 0.3,
    });
    tl.to('.mobile-menu-bg', {
        y: '-100%',
        duration: 0.7,
        ease: 'power4.inOut',
    }, '-=0.1');
}


// ==========================================
// 9. INITIALIZE
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    // Set initial states for elements
    gsap.set('.hero-title-word', { y: '110%' });
    gsap.set('.hero-eyebrow', { opacity: 0, y: 20 });
    gsap.set('.hero-description', { opacity: 0, y: 30 });
    gsap.set('.hero-cta', { opacity: 0, y: 30 });
    gsap.set('.hero-scroll-indicator', { opacity: 0 });
    gsap.set('.hero-badge', { opacity: 0, scale: 0.8 });
    gsap.set('.mobile-menu-link span', { y: '120%' });
    gsap.set('.mobile-menu-bg', { y: '-100%' });

    // Start the preloader
    initPreloader();
});


// ==========================================
// 10. RESIZE HANDLER
// ==========================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});
