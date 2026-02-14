
export default class Scene2 {
    constructor() {
        this.container = document.querySelector('#scene-2');
        this.viewport = this.container ? this.container.querySelector('.gallery-viewport') : null;
        this.corridor = null;
        this.artworks = [];
        this.currentArtIndex = 0;
    }

    init() {
        console.log("Initializing Scene 2: Art Gallery");
        this.renderHTML();
        this.initScrollSync();
        this.initInteractions();
    }

    renderHTML() {
        if (!this.viewport) return;

        // Corridor Container
        this.corridor = document.createElement('div');
        this.corridor.className = 'gallery-corridor';
        this.viewport.appendChild(this.corridor);

        // Floor
        const floor = document.createElement('div');
        floor.className = 'gallery-floor';
        this.corridor.appendChild(floor);

        // Title
        const titleEl = document.createElement('div');
        titleEl.className = 'gallery-title';
        titleEl.innerHTML = `<span>Art Gallery Date</span><br><span class="subtitle">with you</span>`;
        this.viewport.appendChild(titleEl);

        // Artwork Data
        this.artworks = [
            {
                id: 1,
                title: "Interchange",
                artist: "Willem de Kooning",
                color: "#eec0c0",
                pos: { x: -600, y: 0, z: -1000 },
                src: "src/assets/images/art/interchange.png"
            },
            {
                id: 2,
                title: "Lenin on the Tribune",
                artist: "Aleksandr Deyneka",
                color: "#a43f3f",
                pos: { x: 600, y: 0, z: -2500 },
                src: "src/assets/images/art/lenin-on-the-tribune.png"
            },
            {
                id: 3,
                title: "Salvator Mundi",
                artist: "Leonardo da Vinci",
                color: "#2c3e50",
                pos: { x: -600, y: 0, z: -4000 },
                src: "src/assets/images/art/salvator-mundi.png"
            },
            {
                id: 4,
                title: "The Scream",
                artist: "Edvard Munch",
                color: "#e67e22",
                pos: { x: 0, y: 0, z: -5500 },
                src: "src/assets/images/art/the-scream.png"
            },
            {
                id: 5,
                title: "Woman With a Parasol",
                artist: "Claude Monet",
                color: "#5ae622ff",
                pos: { x: 0, y: 0, z: -7000 },
                src: "src/assets/images/art/woman-with-a-parasol.png"
            },
            {
                id: 6,
                title: "Gogh",
                artist: "Vincent van Gogh",
                color: "#22c9e6ff",
                pos: { x: 0, y: 0, z: -8500 },
                src: "src/assets/images/art/gogh.png"
            }
        ];

        // Store references for updates
        this.artworkElements = [];

        this.artworks.forEach((art, index) => {
            const el = document.createElement('div');
            el.className = 'artwork';
            // Initial transform will be set by updateLayout
            // el.style.transform = `translate3d(${art.pos.x}px, ${art.pos.y}px, ${art.pos.z}px)`;

            el.innerHTML = `
                <div class="artwork-inner" style="background-image: url('${art.src}');">
                </div>
                <div class="artwork-caption">
                    <div class="artwork-title">${art.title}</div>
                    <div class="artwork-artist">${art.artist}</div>
                </div>
            `;

            el.addEventListener('click', () => {
                this.openModal(index);
            });

            this.corridor.appendChild(el);
            this.artworkElements.push({ el, data: art });
        });

        // Initial Layout Update
        this.updateLayout();

        // Window Resize Listener
        window.addEventListener('resize', () => this.updateLayout());

        // Modal Construction
        const modal = document.createElement('div');
        modal.id = 'gallery-modal';
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <!-- Nav Controls -->
            <button class="nav-btn prev" id="gallery-prev">&#8592;</button>
            <button class="nav-btn next" id="gallery-next">&#8594;</button>

            <div class="modal-content-wrapper">
                <div id="modal-img-placeholder">
                    <!-- Dynamic Content -->
                </div>
                
                <button class="close-view-btn">Close View</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Modal Events
        modal.querySelector('.close-view-btn').addEventListener('click', () => this.closeModal());
        modal.querySelector('#gallery-prev').addEventListener('click', (e) => { e.stopPropagation(); this.navModal(-1); });
        modal.querySelector('#gallery-next').addEventListener('click', (e) => { e.stopPropagation(); this.navModal(1); });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });
    }

    updateLayout() {
        if (!this.artworkElements) return;

        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

        this.artworkElements.forEach((item, index) => {
            let x = item.data.pos.x;
            let y = item.data.pos.y;
            let z = item.data.pos.z;

            // Explicit Zig-Zag Pattern requested:
            // Art 1 (idx 0): Right (+)
            // Art 2 (idx 1): Left (-)
            // Art 3 (idx 2): Right (+)
            // Art 4 (idx 3): Left (-)

            const isEven = index % 2 === 0; // 0, 2 -> Right. 1, 3 -> Left.

            if (isMobile) {
                // Mobile: Small spread
                x = isEven ? 80 : -80;
            } else if (isTablet) {
                // Tablet: Medium spread
                x = isEven ? 250 : -250;
            } else {
                // Desktop: Wide spread
                x = isEven ? 500 : -500;
            }

            item.el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) translate(-50%, -50%)`;
        });
    }

    initScrollSync() {
        ScrollTrigger.create({
            trigger: "#scene-2",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: (self) => {
                const zMove = self.progress * 6500;
                if (this.corridor) {
                    gsap.to(this.corridor, {
                        z: zMove,
                        duration: 0.5,
                        ease: "power1.out"
                    });
                }
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.corridor) return;
            const xPct = (e.clientX / window.innerWidth) - 0.5;
            const yPct = (e.clientY / window.innerHeight) - 0.5;

            gsap.to(this.corridor, {
                rotationY: xPct * 10,
                rotationX: -yPct * 5,
                duration: 1,
                ease: "power2.out"
            });
        });
    }

    openModal(index) {
        this.currentArtIndex = index;
        this.updateModalContent();
        const modal = document.getElementById('gallery-modal');
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    closeModal() {
        document.getElementById('gallery-modal').classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    navModal(direction) {
        let newIndex = this.currentArtIndex + direction;
        if (newIndex < 0) newIndex = this.artworks.length - 1;
        if (newIndex >= this.artworks.length) newIndex = 0;

        this.currentArtIndex = newIndex;

        // Simple fade transition for content
        const placeholder = document.getElementById('modal-img-placeholder');
        gsap.to(placeholder, { opacity: 0.5, duration: 0.2, yoyo: true, repeat: 1 });

        setTimeout(() => {
            this.updateModalContent();
        }, 200);
    }

    updateModalContent() {
        const art = this.artworks[this.currentArtIndex];
        const placeholder = document.getElementById('modal-img-placeholder');

        placeholder.innerHTML = `
            <img src="${art.src}" class="modal-img" alt="${art.title}">
            <div class="modal-info">
                <h3 style="color:${art.color}">${art.title}</h3>
                <p>${art.artist}</p>
            </div>
        `;
    }
}
