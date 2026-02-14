export default class AudioController {
    constructor() {
        this.createDebugUI();
        this.muted = true;
        this.isUnlocked = false;
        this.trackPath = 'src/assets/audio/Autum-Leaves.mp3';
        this.audio = null;

        this.init();
        this.setupUnlock();
    }

    createDebugUI() {
        window._audioDebug = (msg) => {
            console.log(`%c[Audio Debug] ${msg}`, "color: #ffcc00; font-weight: bold;");
        };
    }

    init() {
        window._audioDebug("Initializing single-track mode...");
        this.audio = new Audio(this.trackPath);
        this.audio.loop = true;
        this.audio.volume = 0;

        this.audio.addEventListener('error', () => {
            window._audioDebug(`❌ Error loading audio: ${this.trackPath}`);
        });

        this.audio.addEventListener('canplaythrough', () => {
            window._audioDebug(`✅ Audio ready: ${this.trackPath}`);
        });
    }

    setupUnlock() {
        const unlock = () => {
            if (this.isUnlocked) return;
            this.isUnlocked = true;
            window._audioDebug("🔓 Interaction detected - Audio unlocked");

            if (!this.muted) {
                this.startPlayback();
            }

            ['click', 'touchstart', 'keydown'].forEach(evt =>
                window.removeEventListener(evt, unlock)
            );
        };

        ['click', 'touchstart', 'keydown'].forEach(evt =>
            window.addEventListener(evt, unlock)
        );
    }

    toggleMute() {
        this.muted = !this.muted;
        window._audioDebug(`🔊 System ${this.muted ? 'MUTED' : 'UNMUTED'}`);

        if (this.muted) {
            this.stopPlayback();
        } else {
            this.startPlayback();
        }
        return this.muted;
    }

    startPlayback() {
        if (!this.audio || this.muted) return;

        window._audioDebug(`🎵 Starting playback...`);
        this.audio.play().then(() => {
            window._audioDebug(`▶️ Playing Autumn Leaves`);
            gsap.to(this.audio, {
                volume: 0.5,
                duration: 3,
                ease: "linear"
            });
        }).catch(e => {
            window._audioDebug(`⚠️ Play blocked. Waiting for interaction.`);
        });
    }

    stopPlayback() {
        if (!this.audio) return;
        window._audioDebug(`🔇 Stopping playback...`);
        gsap.to(this.audio, {
            volume: 0,
            duration: 2,
            ease: "linear",
            onComplete: () => this.audio.pause()
        });
    }
}
