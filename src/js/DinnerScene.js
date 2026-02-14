
export default class DinnerScene {
    constructor() {
        this.container = document.querySelector('#scene-1 .scene-content');
        this.canvas = document.getElementById('canvas-scene-1');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
    }

    init() {
        console.log("Initializing Scene 1: Jazz Dinner");
        this.renderHTML();
        this.initThreeJS();
        this.initAnimations();
        this.initInteractions();
        this.initDrag();
    }


    renderHTML() {
        if (!this.container) return;

        this.container.innerHTML = `
            <!-- Background Placeholder -->
            <div class="scene-background-placeholder" style="background-image: url('src/assets/images/dinner-background-placeholder.jpg'); position: absolute; top:0; left:0; width:100%; height:100%; background-size: cover; opacity: 0.2; z-index: -1;"></div>

            <!-- Dimming Overlay for Focus Mode -->
            <div id="scene-dimmer" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0); pointer-events:none; transition:background 1s ease; z-index: 15;"></div>

            <div class="dinner-container">
                <div class="dinner-text">
                    <h1 class="dinner-title">A Symphony<br>of Light</h1>
                    <p class="dinner-desc">
                        Tonight, shadows dance with the candlelight.
                        Every silence is a note in our jazz.
                    </p>
                
                </div>
            </div>

            <!-- Table Surface Container (Absolute positioning context) -->
            <div class="table-surface">
                
                <!-- The Book Container -->
                <div id="dinner-book" class="dinner-book">
                    <div class="book-cover">
                        <div class="book-front">
                            <div class="book-skin">
                                <h2 class="book-title">Menu<br>du Soir</h2>
                                <span class="book-subtitle">Click to Open</span>
                            </div>
                        </div>
                        <div class="book-back"></div>
                    </div>
                    
                    <div class="book-page left-page">
                        <div class="page-content">
                            <h3>Les Desserts</h3>
                            <p>Selection of the day</p>
                        </div>
                    </div>

                    <div class="book-page right-page">
                        <div class="page-content dessert-grid">
                            <div class="dessert-item" data-id="1">
                                <img src="src/assets/images/dessert1.png" alt="Dessert 1" class="dessert-img">
                                <span class="dessert-label">First Taste</span>
                            </div>
                             <div class="dessert-item" data-id="2">
                                <img src="src/assets/images/dessert2.png" alt="Dessert 2" class="dessert-img">
                                <span class="dessert-label">Warmth</span>
                            </div>
                             <div class="dessert-item" data-id="3">
                                <img src="src/assets/images/dessert3.png" alt="Dessert 3" class="dessert-img">
                                <span class="dessert-label">Cravings</span>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>

            <!-- Poetry Panel (Hidden by default) -->
            <div id="dessert-poetry-panel" class="poetry-panel">
                <h2 class="poetry-title">Sweetness</h2>
                <div class="poetry-lines">
                    <!-- Lines injected via JS -->
                </div>
            </div>
        `;
    }

    initThreeJS() {
        if (!this.canvas) return;

        // Scene Setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Particles (Dust/Atmosphere)
        const geometry = new THREE.BufferGeometry();
        const count = 500;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 10; // Spread
            colors[i] = Math.random();
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Programmatic Texture for soft particle
        const canvas = document.createElement('canvas');
        canvas.width = 32; canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(16, 16, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        const texture = new THREE.CanvasTexture(canvas);

        const material = new THREE.PointsMaterial({
            size: 0.05,
            map: texture,
            transparent: true,
            opacity: 0.6,
            vertexColors: false,
            color: 0xd4af37, // Gold
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);

        this.camera.position.z = 2;

        // Animation Loop
        const bgAnimate = () => {
            requestAnimationFrame(bgAnimate);

            if (this.particles) {
                this.particles.rotation.y += 0.0005;
                this.particles.rotation.x -= 0.0002;
                this.particles.position.y = Math.sin(Date.now() * 0.0005) * 0.1;
            }

            this.renderer.render(this.scene, this.camera);
        };

        bgAnimate();

        // Resize
        window.addEventListener('resize', () => {
            if (this.camera && this.renderer) {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });
    }

    initAnimations() {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to('.dinner-text', { opacity: 1, y: 0, duration: 1.5 })
            .to('.dessert-btn-container', { opacity: 1, duration: 1 }, "-=0.5");


    }

    initInteractions() {
        // --- Book Logic ---
        const book = document.getElementById('dinner-book');
        const desserts = document.querySelectorAll('.dessert-item');

        // Poetry UI Elements
        const dimmer = document.getElementById('scene-dimmer');
        const panel = document.getElementById('dessert-poetry-panel');
        const title = panel.querySelector('.poetry-title');
        const linesContainer = panel.querySelector('.poetry-lines');

        const poems = {
            1: {
                title: "First Taste",
                lines: [
                    "A sugar spun memory,",
                    "Dissolving on the tongue like a secret,",
                    "Sweet, sudden, and gone too soon."
                ]
            },
            2: {
                title: "Warmth",
                lines: [
                    "Amber light trapped in glaze,",
                    "History baked into the crust,",
                    "A comfort that whispers of home."
                ]
            },
            3: {
                title: "Night Cravings",
                lines: [
                    "Dark cocoa meets the moonlight,",
                    "A bitterness that makes the sweet true,",
                    "We share the last bite in silence."
                ]
            },
        };

        let isBookOpen = false;

        // 1. Open Book Interaction
        book.addEventListener('click', (e) => {
            if (isBookOpen) return;
            e.stopPropagation(); // Prevent document click from closing it immediately
            // Only open if clicking cover (or book in general when closed)
            isBookOpen = true;
            book.classList.add('open');
        });

        // Close Book Interaction (Click Outside)
        document.addEventListener('click', (e) => {
            if (isBookOpen && !book.contains(e.target)) {
                // Check if we are interacting with poetry?
                // If poetry is open, clicking outside (on dimmer) closes poetry.
                // We should only close book if poetry is NOT open or if we are clicking "background".
                // But poetry dimmer catches clicks.
                // So this document click only fires if we click outside book AND outside poetry dimmer (if it were smaller).
                // Actually dimmer overs everything.

                // If poetry panel is visible, don't close book yet (let dimmer handle poetry close).
                if (panel.style.display === 'block' && panel.style.opacity !== '0') return;

                isBookOpen = false;
                book.classList.remove('open');
            }
        });

        // 2. Dessert Selection (Inside Book)
        let activeDessertId = null;

        desserts.forEach(dessert => {
            dessert.addEventListener('click', (e) => {
                e.stopPropagation(); // Don't trigger book click
                if (!isBookOpen) return;

                const id = dessert.dataset.id;
                const poem = poems[id];

                // Show Poetry Panel
                showPoetry(poem);
            });
        });

        // 3. UI Helpers
        function showPoetry(poem) {
            // Dim Background (Higher z-index than book)
            dimmer.style.zIndex = "100";
            dimmer.style.background = "rgba(0,0,0,0.8)";
            dimmer.style.pointerEvents = "auto";

            // Set Content
            title.textContent = poem.title;
            linesContainer.innerHTML = poem.lines.map(line => `<p>${line}</p>`).join('');

            // Animate In
            gsap.set(panel, { display: 'block', opacity: 0, x: 50 });
            gsap.to(panel, { opacity: 1, x: 0, duration: 1, delay: 0.2 });

            // Animate Lines
            gsap.fromTo(panel.querySelectorAll('p'),
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.3, delay: 0.5 }
            );
        }

        // Close Interaction (Clicking Dimmer)
        dimmer.addEventListener('click', () => {
            // Close Poetry Panel
            gsap.to(panel, {
                opacity: 0, duration: 0.5, onComplete: () => {
                    panel.style.display = 'none';
                    // Restore Dimmer Z-Index to allow interacting with book again if needed
                    // Or keep it low.
                    dimmer.style.zIndex = "15";
                }
            });

            // Restore Dimmer
            dimmer.style.background = "rgba(0,0,0,0)";
            dimmer.style.pointerEvents = "none";
        });
    }

    initDrag() {
        // --- Existing Drag logic (Simplified for coexistence) ---
        const plate = document.getElementById('dinner-plate');
        const zone = document.getElementById('plate-zone');
        let isDragging = false;

        if (plate && zone) {
            plate.addEventListener('mousedown', (e) => {
                isDragging = true;
                plate.style.cursor = 'grabbing';
            });
            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                plate.style.position = 'fixed';
                plate.style.left = `${e.clientX}px`;
                plate.style.top = `${e.clientY}px`;
                plate.style.transform = 'translate(-50%, -50%)';
            });
            window.addEventListener('mouseup', () => {
                isDragging = false;
                plate.style.cursor = 'grab';
            });
        }
    }
}