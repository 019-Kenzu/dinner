
import DinnerScene from './DinnerScene.js';
import Scene2 from './Scene2.js';
import Scene3 from './Scene3.js';
import FooterScene from './FooterScene.js';
import AudioController from './AudioController.js';

class Main {
    constructor() {
        this.scenes = {
            scene1: new DinnerScene(),
            scene2: new Scene2(),
            scene3: new Scene3(),
            footer: new FooterScene()
        };
        this.audioController = new AudioController();
        this.currentScene = null;

        this.init();
    }

    init() {
        console.log("Initializing Dinner With You...");

        // Setup Audio Toggle
        const audioBtn = document.getElementById('audio-toggle');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => this.toggleAudio());
        }

        // Simulate assets loading
        this.loadAssets().then(() => {
            this.hideLoader();
            this.startExperience();
        });
    }

    async loadAssets() {
        // In a real app, we'd wait for images/textures here.
        // For now, simulate a delay for the "film" loading feel.
        return new Promise(resolve => setTimeout(resolve, 2000));
    }

    hideLoader() {
        const loader = document.getElementById('loader');
        const progress = document.querySelector('.loader-progress');

        if (progress) {
            gsap.to(progress, {
                width: '100%', duration: 0.5, onComplete: () => {
                    gsap.to(loader, {
                        opacity: 0,
                        duration: 1,
                        onComplete: () => loader.classList.add('hidden')
                    });
                }
            });
        }
    }

    startExperience() {
        // Initialize GSAP ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Init scenes
        this.scenes.scene1.init();
        this.scenes.scene2.init();
        this.scenes.scene3.init();
        this.scenes.footer.init();
    }

    toggleAudio() {
        const btn = document.getElementById('audio-toggle');
        const isMuted = this.audioController.toggleMute();

        if (btn) {
            const textSpan = btn.querySelector('.audio-text');
            if (textSpan) textSpan.textContent = isMuted ? "Sound Off" : "Sound On";
            btn.classList.toggle('muted', isMuted);
        }
    }
}

// Start
window.addEventListener('DOMContentLoaded', () => {
    window.app = new Main();
});
