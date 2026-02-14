
export default class Scene3 {
    constructor() {
        this.container = document.querySelector('#scene-3 .scene-content');
        this.weatherContainer = document.getElementById('weather-container');
        this.canvas = null;
        this.ctx = null;
        this.weatherState = 'clear'; // clear, rain, fog, breeze
        this.particles = [];
        this.leaves = []; // For breeze
        this.animationId = null;
    }

    init() {
        console.log("Initializing Scene 3: Poetry");
        this.renderHTML();
        this.initWeatherSystem();
        this.initAnimations();
    }

    renderHTML() {
        if (!this.container) return;

        this.container.innerHTML = `
            <!-- Background Placeholder -->
            <div class="sky-background-placeholder" style="background: linear-gradient(to bottom, #020205, #111); position:absolute; top:0; left:0; width:100%; height:100%; z-index:-2;"></div>

            <div class="poetry-content">
                <div class="poem-lines">
                    <p class="poem-line" data-audio="assets/audio/narration-line-1.mp3">"In the silence of the galaxy,"</p>
                    <p class="poem-line" data-audio="assets/audio/narration-line-2.mp3">"I found the echo of your name."</p>
                    <p class="poem-line" data-audio="assets/audio/narration-line-3.mp3">"Not a star, but a heartbeat,"</p>
                    <p class="poem-line" data-audio="assets/audio/narration-line-4.mp3">"Burning softly in the dark."</p>
                </div>
            </div>
            
            <div class="couple-silhouette">
                <!-- Silhouette Placeholder -->
                 <div style="width:100%; height:100%; background:url('assets/images/couple-silhouette-placeholder.png') center bottom no-repeat; background-size:contain; opacity:0.8;"></div>
            </div>
            
            <div class="weather-controls">
                <button class="weather-btn active" data-weather="clear">Clear Night</button>
                <button class="weather-btn" data-weather="rain">Rain</button>
                <button class="weather-btn" data-weather="fog">Fog</button>
                <button class="weather-btn" data-weather="breeze">Night Breeze</button>
            </div>
        `;

        // Bind controls
        const btns = this.container.querySelectorAll('.weather-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                btns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.setWeather(e.target.dataset.weather);
            });
        });

        // Bind Narration Replay
        const lines = this.container.querySelectorAll('.poem-line');
        lines.forEach(line => {
            line.addEventListener('click', () => {
                const audioSrc = line.dataset.audio;
                console.log(`Playing narration placeholder: ${audioSrc}`);
                // In real app: new Audio(audioSrc).play();
            });
        });
    }

    initWeatherSystem() {
        if (!this.weatherContainer) return;

        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.weatherContainer.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.initParticles();
        });

        this.initParticles();
        this.animateWeather();
    }

    setWeather(type) {
        this.weatherState = type;
        this.initParticles();
    }

    initParticles() {
        this.particles = [];
        this.leaves = [];

        const w = this.canvas.width;
        const h = this.canvas.height;

        if (this.weatherState === 'rain') {
            for (let i = 0; i < 500; i++) {
                this.particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    speed: Math.random() * 5 + 5,
                    length: Math.random() * 20 + 10,
                    opacity: Math.random() * 0.5 + 0.1
                });
            }
        } else if (this.weatherState === 'clear') {
            for (let i = 0; i < 200; i++) {
                this.particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    size: Math.random() * 2,
                    opacity: Math.random(),
                    twinkleSpeed: Math.random() * 0.05
                });
            }
        } else if (this.weatherState === 'fog') {
            for (let i = 0; i < 50; i++) {
                this.particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    size: Math.random() * 100 + 50,
                    speed: Math.random() * 0.5,
                    opacity: Math.random() * 0.05
                });
            }
        } else if (this.weatherState === 'breeze') {
            // Stars background
            for (let i = 0; i < 100; i++) {
                this.particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    size: Math.random() * 1.5,
                    opacity: Math.random()
                });
            }
            // Falling Leaves / Petals
            for (let i = 0; i < 30; i++) {
                this.leaves.push({
                    x: Math.random() * w,
                    y: Math.random() * h - h, // Start above
                    speedY: Math.random() * 1 + 0.5,
                    speedX: Math.random() * 2 - 1,
                    rotation: Math.random() * 360,
                    rotationSpeed: (Math.random() - 0.5) * 2,
                    size: Math.random() * 5 + 3
                });
            }
        }
    }

    animateWeather() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.weatherState === 'rain') {
            this.ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();

            this.particles.forEach(p => {
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(p.x, p.y + p.length);
                p.y += p.speed;
                if (p.y > this.canvas.height) { p.y = -20; p.x = Math.random() * this.canvas.width; }
            });
            this.ctx.stroke();

        } else if (this.weatherState === 'clear') {
            this.particles.forEach(p => {
                const alpha = p.opacity * (0.5 + 0.5 * Math.sin(Date.now() * 0.003 + p.x));
                this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            });

        } else if (this.weatherState === 'fog') {
            this.particles.forEach(p => {
                this.ctx.fillStyle = `rgba(200, 200, 200, ${p.opacity})`;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
                p.x += p.speed;
                if (p.x > this.canvas.width + p.size) p.x = -p.size;
            });

        } else if (this.weatherState === 'breeze') {
            // Draw stars static first
            this.particles.forEach(p => {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            });

            // Draw leaves
            this.ctx.fillStyle = 'rgba(212, 175, 55, 0.6)'; // Gold leaves
            this.leaves.forEach(l => {
                this.ctx.save();
                this.ctx.translate(l.x, l.y);
                this.ctx.rotate(l.rotation * Math.PI / 180);
                this.ctx.fillRect(-l.size / 2, -l.size / 2, l.size, l.size); // Simple square 'leaf'
                this.ctx.restore();

                l.y += l.speedY;
                l.x += Math.sin(l.y * 0.01) + l.speedX * 0.2; // Sway
                l.rotation += l.rotationSpeed;

                if (l.y > this.canvas.height) {
                    l.y = -10;
                    l.x = Math.random() * this.canvas.width;
                }
            });
        }

        this.animationId = requestAnimationFrame(() => this.animateWeather());
    }

    initAnimations() {
        gsap.from('.poem-line', {
            scrollTrigger: {
                trigger: '#scene-3',
                start: "top center"
            },
            y: 50,
            opacity: 0,
            duration: 1.5,
            stagger: 0.8,
            ease: "power2.out"
        });
    }
}
