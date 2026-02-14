
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

        // Artwork Data (using placeholders)
        this.artworks = [
            {
                id: 1,
                title: "Velvet Silence",
                artist: "Unknown",
                color: "#2d3436",
                pos: { x: -600, y: 0, z: -1000 },
                src: "assets/images/gallery-art-01.jpg" // Placeholder path
            },
            {
                id: 2,
                title: "Golden Echo",
                artist: "Mida",
                color: "#635325",
                pos: { x: 600, y: 0, z: -2500 },
                src: "assets/images/gallery-art-02.jpg"
            },
            {
                id: 3,
                title: "Midnight Rain",
                artist: "Pluvi",
                color: "#091d36",
                pos: { x: -600, y: 0, z: -4000 },
                src: "assets/images/gallery-art-03.jpg"
            },
            {
                id: 4,
                title: "Fading Memory",
                artist: "Mnemosyne",
                color: "#4a0404",
                pos: { x: 0, y: 0, z: -5500 },
                src: "assets/images/gallery-art-04.jpg"
            }
        ];

        this.artworks.forEach((art, index) => {
            const el = document.createElement('div');
            el.className = 'artwork';
            el.style.transform = `translate3d(${art.pos.x}px, ${art.pos.y}px, ${art.pos.z}px)`;

            el.innerHTML = `
                <div class="artwork-inner" style="background-color: ${art.color}; display:flex; justify-content:center; align-items:center; color:rgba(255,255,255,0.2);">
                    <span>[ART ${index + 1}]</span>
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
        });

        // Modal Construction
        const modal = document.createElement('div');
        modal.id = 'gallery-modal';
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="modal-content-wrapper" style="position:relative;">
                <div id="modal-img-placeholder" class="modal-img" style="width:600px; height:800px; background:#111; display:flex; justify-content:center; align-items:center; color:#555;">
                    [High Res Check]
                </div>
                
                <!-- Nav Controls -->
                <button class="nav-btn prev" id="gallery-prev" style="position:absolute; left:-60px; top:50%; transform:translateY(-50%); background:none; border:none; color:white; font-size:2rem; cursor:pointer;">&#8592;</button>
                <button class="nav-btn next" id="gallery-next" style="position:absolute; right:-60px; top:50%; transform:translateY(-50%); background:none; border:none; color:white; font-size:2rem; cursor:pointer;">&#8594;</button>
            </div>
            
            <button class="audio-control close-btn" style="position:absolute; top:40px; right:40px;">Close View</button>
        `;
        this.container.appendChild(modal);

        // Modal Events
        modal.querySelector('.close-btn').addEventListener('click', () => this.closeModal());
        modal.querySelector('#gallery-prev').addEventListener('click', (e) => { e.stopPropagation(); this.navModal(-1); });
        modal.querySelector('#gallery-next').addEventListener('click', (e) => { e.stopPropagation(); this.navModal(1); });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
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
    }

    closeModal() {
        document.getElementById('gallery-modal').classList.remove('active');
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

        // Update styling to match art
        placeholder.style.backgroundColor = art.color;
        placeholder.innerHTML = `
            <div style="text-align:center;">
                <p>[Full Res - ${art.title}]</p>
                <p style="font-size:0.8rem; margin-top:10px;">${art.src}</p>
            </div>
        `;
    }
}
