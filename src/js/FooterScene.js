
export default class FooterScene {
    constructor() {
        this.container = document.querySelector('#footer-poetry');
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = null;
        this.particles = [];
        this.poem = `In candlelight, our shadows dance,
Each moment feels like sweet romance.
Through art and jazz, our story grows,
A symphony that only love knows.

With every smile, with every glance,
We write our tale of pure romance.`;
        this.currentChar = 0;
        this.isTyping = false;
    }

    init() {
        console.log("Initializing Footer Poetry Scene");

        // Immediate visual test - show elements to verify they exist
        const poemElement = document.querySelector('.typewriter-poem');
        const slide1 = document.querySelector('.slide-1');
        const slide2 = document.querySelector('.slide-2');
        const slide3 = document.querySelector('.slide-3');
        const profileCards = document.querySelectorAll('.profile-card');

        console.log("Footer elements check:", {
            poemElement: !!poemElement,
            slide1: !!slide1,
            slide2: !!slide2,
            slide3: !!slide3,
            profileCardsCount: profileCards.length,
            container: !!this.container,
            canvas: !!this.canvas
        });

        // Temporary: Show a test message to verify the element works
        if (poemElement) {
            poemElement.textContent = "Loading...";
            poemElement.style.color = "#d4af37"; // Make it gold to stand out
        }

        // Make slideshow images visible immediately for testing
        if (slide1) slide1.style.opacity = "0.3";
        if (slide2) slide2.style.opacity = "0.3";
        if (slide3) slide3.style.opacity = "0.3";

        this.initParticles();
        this.initScrollTrigger();
    }

    initScrollTrigger() {
        console.log("Setting up ScrollTrigger for footer");

        ScrollTrigger.create({
            trigger: "#footer-poetry",
            start: "top bottom",  // Trigger as soon as footer enters viewport
            onEnter: () => {
                console.log("Footer entered viewport!");
                this.startAnimations();
            },
            once: true,
            markers: false  // Set to true for debugging
        });

        // Also check if already in view on load
        setTimeout(() => {
            const footer = document.querySelector('#footer-poetry');
            if (footer) {
                const rect = footer.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    console.log("Footer already in view, starting animations");
                    this.startAnimations();
                }
            }
        }, 1000);
    }

    startAnimations() {
        console.log("Footer animations starting!");

        // Check if slideshow elements exist
        const slide1 = document.querySelector('.slide-1');
        const slide2 = document.querySelector('.slide-2');
        const slide3 = document.querySelector('.slide-3');

        console.log("Slideshow elements found:", {
            slide1: !!slide1,
            slide2: !!slide2,
            slide3: !!slide3
        });

        // Slideshow images appear one by one from off-screen
        const tl = gsap.timeline();

        if (slide1 && slide2 && slide3) {
            // Set initial positions off-screen
            gsap.set('.slide-1', { x: -100, opacity: 0 });
            gsap.set('.slide-2', { x: 100, opacity: 0 });
            gsap.set('.slide-3', { x: -100, opacity: 0 });

            tl.to('.slide-1', {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "power2.out"
            })
                .to('.slide-2', {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: "power2.out"
                }, "-=0.5")
                .to('.slide-3', {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: "power2.out"
                }, "-=0.5");
        } else {
            console.warn("Slideshow elements not found!");
        }

        tl.add(() => {
            console.log("Starting typewriter!");
            this.startTypewriter();
        }, "+=0.5");
    }

    startTypewriter() {
        if (this.isTyping) return;
        this.isTyping = true;

        const poemElement = document.querySelector('.typewriter-poem');
        const cursor = document.querySelector('.typewriter-cursor');

        console.log("Typewriter elements:", {
            poemElement: !!poemElement,
            cursor: !!cursor,
            poemLength: this.poem.length
        });

        if (!poemElement) {
            console.error("Poem element not found!");
            return;
        }

        const type = () => {
            if (this.currentChar < this.poem.length) {
                poemElement.textContent = this.poem.substring(0, this.currentChar + 1);
                this.currentChar++;

                // Variable typing speed for more natural feel
                const delay = this.poem[this.currentChar - 1] === '\n' ? 500 :
                    Math.random() * 50 + 30;

                setTimeout(type, delay);
            } else {
                // Typing complete, show profile cards
                setTimeout(() => {
                    this.showProfiles();
                    if (cursor) cursor.style.display = 'none';
                }, 500);
            }
        };

        type();
    }

    showProfiles() {
        const profileCards = document.querySelectorAll('.profile-card');
        console.log("Profile cards found:", profileCards.length);

        if (profileCards.length > 0) {
            gsap.to('.profile-card', {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.3,
                ease: "back.out(1.2)",
                onComplete: () => {
                    // Start particle effects
                    this.startParticleAnimation();
                }
            });
        } else {
            console.warn("No profile cards found!");
            // Still start particle animation
            this.startParticleAnimation();
        }
    }

    initParticles() {
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: -20,
            size: Math.random() * 8 + 4,
            speedY: Math.random() * 2 + 1,
            speedX: Math.random() * 2 - 1,
            opacity: Math.random() * 0.5 + 0.3,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 4 - 2,
            // Petal colors (pink/rose)
            color: `rgba(${Math.floor(Math.random() * 50 + 200)}, ${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 150)}, ${Math.random() * 0.5 + 0.3})`
        };
    }

    startParticleAnimation() {
        const animate = () => {
            if (!this.ctx) return;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Add new particles
            if (this.particles.length < 50 && Math.random() < 0.3) {
                this.particles.push(this.createParticle());
            }

            // Update and draw particles
            this.particles = this.particles.filter(particle => {
                particle.y += particle.speedY;
                particle.x += particle.speedX;
                particle.rotation += particle.rotationSpeed;

                // Draw petal (simple ellipse)
                this.ctx.save();
                this.ctx.translate(particle.x, particle.y);
                this.ctx.rotate(particle.rotation * Math.PI / 180);
                this.ctx.globalAlpha = particle.opacity;
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.ellipse(0, 0, particle.size, particle.size * 1.5, 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();

                // Remove if off screen
                return particle.y < this.canvas.height + 20;
            });

            requestAnimationFrame(animate);
        };

        animate();
    }
}
