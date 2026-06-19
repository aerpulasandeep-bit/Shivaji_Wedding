/* ========================================
   WEDDING WEBSITE - JAVASCRIPT
   Shivaji & Sanjana
   ======================================== */

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
    initEnvelopeParticles();
    initEnvelopeInteraction();
    initPetalsCanvas();
    initCountdown();
    initScrollAnimations();
    init3DCardEffects();
});

// ============ ENVELOPE PARTICLES ============
function initEnvelopeParticles() {
    const container = document.getElementById('envelopeParticles');
    const petals = ['🌸', '🌺', '✿', '❀', '🌷', '💮', '🏵️'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        particle.textContent = petals[Math.floor(Math.random() * petals.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.fontSize = (10 + Math.random() * 16) + 'px';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';
        container.appendChild(particle);
    }
}

// ============ ENVELOPE INTERACTION ============
function initEnvelopeInteraction() {
    const openBtn = document.getElementById('openBtn');
    const waxSeal = document.getElementById('waxSeal');
    const envelopeFlap = document.getElementById('envelopeFlap');
    const envelopeCard = document.getElementById('envelopeCard');
    const envelopeLanding = document.getElementById('envelopeLanding');
    const mainSite = document.getElementById('mainSite');

    function openEnvelope() {
        // Step 1: Break wax seal
        waxSeal.classList.add('breaking');
        openBtn.style.pointerEvents = 'none';
        openBtn.style.opacity = '0.5';
        envelopeLanding.classList.add('opening');

        // Step 2: Open flap
        setTimeout(() => {
            envelopeFlap.classList.add('open');
        }, 500);

        // Step 3: Slide card out
        setTimeout(() => {
            envelopeCard.style.transform = 'translateY(-120px)';
            envelopeCard.style.boxShadow = '0 10px 40px rgba(0,0,0,0.2)';
        }, 1200);

        // Step 4: Fade out envelope and show main site
        setTimeout(() => {
            envelopeLanding.classList.add('hidden');
        }, 2200);

        setTimeout(() => {
            envelopeLanding.style.display = 'none';
            mainSite.classList.remove('hidden');
            mainSite.style.animation = 'fadeIn 1s ease forwards';
            
            // Trigger initial scroll animations
            setTimeout(() => {
                triggerVisibleAnimations();
            }, 200);
        }, 3000);
    }

    openBtn.addEventListener('click', openEnvelope);
    waxSeal.addEventListener('click', openEnvelope);
}

// ============ FLOATING PETALS CANVAS ============
function initPetalsCanvas() {
    const canvas = document.getElementById('petalsCanvas');
    const ctx = canvas.getContext('2d');
    let petals = [];
    let animationFrame;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Petal {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20 - Math.random() * 100;
            this.size = 6 + Math.random() * 10;
            this.speedY = 0.5 + Math.random() * 1.2;
            this.speedX = -0.5 + Math.random() * 1;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = -0.02 + Math.random() * 0.04;
            this.opacity = 0.3 + Math.random() * 0.5;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = 0.01 + Math.random() * 0.02;
            
            // Color variations - blush to pink
            const colors = [
                { r: 244, g: 194, b: 194 },  // blush
                { r: 252, g: 228, b: 236 },  // light pink
                { r: 232, g: 160, b: 160 },  // deeper blush
                { r: 255, g: 218, b: 210 },  // peach
                { r: 200, g: 164, b: 92 },   // gold
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y += this.speedY;
            this.wobble += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobble) * 0.5;
            this.rotation += this.rotationSpeed;

            if (this.y > canvas.height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;

            // Draw petal shape
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(
                this.size / 2, -this.size / 2,
                this.size, 0,
                0, this.size
            );
            ctx.bezierCurveTo(
                -this.size, 0,
                -this.size / 2, -this.size / 2,
                0, 0
            );

            const { r, g, b } = this.color;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
            ctx.fill();

            // Subtle highlight
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(
                this.size / 4, -this.size / 4,
                this.size / 2, 0,
                0, this.size / 2
            );
            ctx.fillStyle = `rgba(255, 255, 255, 0.3)`;
            ctx.fill();

            ctx.restore();
        }
    }

    // Create petals
    const petalCount = window.innerWidth < 480 ? 15 : 25;
    for (let i = 0; i < petalCount; i++) {
        const petal = new Petal();
        petal.y = Math.random() * canvas.height; // Distribute initially
        petals.push(petal);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });

        animationFrame = requestAnimationFrame(animate);
    }

    animate();
}

// ============ COUNTDOWN TIMER ============
function initCountdown() {
    const weddingDate = new Date('2026-06-24T07:51:00+05:30').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = weddingDate - now;

        if (diff <= 0) {
            document.getElementById('cdDays').textContent = '🎉';
            document.getElementById('cdHours').textContent = '🎊';
            document.getElementById('cdMinutes').textContent = '💍';
            document.getElementById('cdSeconds').textContent = '❤️';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('cdDays');
        const hoursEl = document.getElementById('cdHours');
        const minutesEl = document.getElementById('cdMinutes');
        const secondsEl = document.getElementById('cdSeconds');

        // Animate number change
        animateNumber(daysEl, days);
        animateNumber(hoursEl, hours);
        animateNumber(minutesEl, minutes);
        animateNumber(secondsEl, seconds);
    }

    function animateNumber(el, value) {
        const formatted = String(value).padStart(2, '0');
        if (el.textContent !== formatted) {
            el.style.transform = 'scale(1.1)';
            el.textContent = formatted;
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 200);
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ============ SCROLL ANIMATIONS ============
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add stagger delay for grid items
                const parent = entry.target.closest('.details-grid, .gallery-grid, .countdown-grid');
                if (parent) {
                    const items = parent.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
                    items.forEach((item, index) => {
                        item.style.transitionDelay = (index * 0.1) + 's';
                        item.classList.add('visible');
                    });
                }
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
        observer.observe(el);
    });
}

function triggerVisibleAnimations() {
    const elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
        }
    });
}

// ============ 3D CARD TILT EFFECTS ============
function init3DCardEffects() {
    const cards = document.querySelectorAll('.detail-card, .family-card-border');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
    });

    // Touch-based 3D effect for mobile
    cards.forEach(card => {
        card.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const rect = card.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }, { passive: true });

        card.addEventListener('touchend', () => {
            card.style.transform = 'perspective(600px) rotateX(0) rotateY(0)';
            card.style.transition = 'transform 0.5s ease';
        });
    });
}

// ============ LIGHTBOX GALLERY ============
const galleryImages = [
    { src: 'images/groom.jpg', alt: 'Shivaji' },
    { src: 'images/bride.jpg', alt: 'Sanjana' },
    { src: 'images/invitation.jpg', alt: 'Wedding Invitation' }
];
let currentLightboxIndex = 0;

function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    
    img.src = galleryImages[index].src;
    img.alt = galleryImages[index].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentLightboxIndex = (currentLightboxIndex + direction + galleryImages.length) % galleryImages.length;
    const img = document.getElementById('lightboxImg');
    
    img.style.opacity = '0';
    img.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        img.src = galleryImages[currentLightboxIndex].src;
        img.alt = galleryImages[currentLightboxIndex].alt;
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
    }, 200);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            navigateLightbox(-1);
            break;
        case 'ArrowRight':
            navigateLightbox(1);
            break;
    }
});

// Swipe support for lightbox
let touchStartX = 0;
let touchEndX = 0;

document.getElementById('lightbox')?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.getElementById('lightbox')?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            navigateLightbox(1);
        } else {
            navigateLightbox(-1);
        }
    }
});

// ============ SMOOTH PARALLAX ON SCROLL ============
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            
            // Parallax for hero section
            const hero = document.querySelector('.hero-section');
            if (hero) {
                const heroRect = hero.getBoundingClientRect();
                if (heroRect.bottom > 0) {
                    hero.style.backgroundPositionY = (scrolled * 0.3) + 'px';
                }
            }

            // Gold shimmer effect on section titles as they come into view
            document.querySelectorAll('.section-title').forEach(title => {
                const rect = title.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const progress = 1 - (rect.top / window.innerHeight);
                    title.style.backgroundPosition = `${progress * 400 - 200}% center`;
                }
            });

            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// ============ PREVENT CONTEXT MENU ON IMAGES ============
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// ============ SERVICE WORKER REGISTRATION (for offline support) ============
// Uncomment below if you want offline capability
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/sw.js');
// }
