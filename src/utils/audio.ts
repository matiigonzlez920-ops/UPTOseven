// Web Audio API pure synthesizer for realistic can opening sound and tactile UI sound effects
// Does not depend on external MP3 files or network connections

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialization on first user gesture
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Plays the iconic pressurized can opening: pop/crack + CO2 hiss + bubbling fizz
  public playCanOpen(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Initial metallic crack / tab pop (sharp bandpass impulse)
    const crackOsc = ctx.createOscillator();
    const crackGain = ctx.createGain();
    const crackFilter = ctx.createBiquadFilter();

    crackOsc.type = 'triangle';
    crackOsc.frequency.setValueAtTime(450, now);
    crackOsc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

    crackFilter.type = 'bandpass';
    crackFilter.frequency.setValueAtTime(1200, now);
    crackFilter.Q.setValueAtTime(3.5, now);

    crackGain.gain.setValueAtTime(0.7, now);
    crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    crackOsc.connect(crackFilter);
    crackFilter.connect(crackGain);
    crackGain.connect(ctx.destination);

    crackOsc.start(now);
    crackOsc.stop(now + 0.1);

    // 2. High-frequency metallic ping resonance
    const pingOsc = ctx.createOscillator();
    const pingGain = ctx.createGain();
    pingOsc.type = 'sine';
    pingOsc.frequency.setValueAtTime(2400, now);
    pingOsc.frequency.exponentialRampToValueAtTime(1100, now + 0.12);

    pingGain.gain.setValueAtTime(0.35, now);
    pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    pingOsc.connect(pingGain);
    pingGain.connect(ctx.destination);

    pingOsc.start(now);
    pingOsc.stop(now + 0.15);

    // 3. Pressurized gas hiss ("pssssshhh") using shaped white noise
    const bufferSize = ctx.sampleRate * 0.45;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(2800, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(1400, now + 0.4);

    const noiseGain = ctx.createGain();
    // Sudden burst followed by rapid decay
    noiseGain.gain.setValueAtTime(0.0, now);
    noiseGain.gain.setValueAtTime(0.65, now + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    whiteNoise.start(now + 0.01);
    whiteNoise.stop(now + 0.45);

    // 4. Fizzy bubbling tail
    for (let i = 0; i < 5; i++) {
      const bubbleTime = now + 0.1 + i * 0.05 + Math.random() * 0.03;
      const bOsc = ctx.createOscillator();
      const bGain = ctx.createGain();

      bOsc.type = 'sine';
      const startFreq = 600 + Math.random() * 500;
      bOsc.frequency.setValueAtTime(startFreq, bubbleTime);
      bOsc.frequency.exponentialRampToValueAtTime(startFreq + 350, bubbleTime + 0.04);

      bGain.gain.setValueAtTime(0.08, bubbleTime);
      bGain.gain.exponentialRampToValueAtTime(0.001, bubbleTime + 0.04);

      bOsc.connect(bGain);
      bGain.connect(ctx.destination);

      bOsc.start(bubbleTime);
      bOsc.stop(bubbleTime + 0.05);
    }
  }

  // Subtle sensory click when toggling varieties or clicking buttons
  public playClick(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Game sound: Item caught (citrus ping)
  public playPoint(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Game sound: Special bonus caught (Cool Spot / Ice)
  public playBonus(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.04;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    });
  }

  // Game sound: Obstacle hit (warm buzz)
  public playOuch(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.15);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Game sound: Game Over
  public playGameOver(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [440, 392, 349.23, 293.66];
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    });
  }

  // Game sound: Level up / Combo
  public playLevelUp(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    });
  }

  // Soda Vending Machine Dispenser Sound: mechanical release + metallic drop + soda hiss
  public playDispenserVend(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Coin / button mechanical push
    const coinOsc = ctx.createOscillator();
    const coinGain = ctx.createGain();
    coinOsc.type = 'square';
    coinOsc.frequency.setValueAtTime(980, now);
    coinOsc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
    coinGain.gain.setValueAtTime(0.2, now);
    coinGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    coinOsc.connect(coinGain);
    coinGain.connect(ctx.destination);
    coinOsc.start(now);
    coinOsc.stop(now + 0.06);

    // 2. Heavy mechanical solenoid clack
    const clackOsc = ctx.createOscillator();
    const clackGain = ctx.createGain();
    clackOsc.type = 'triangle';
    clackOsc.frequency.setValueAtTime(220, now + 0.1);
    clackOsc.frequency.exponentialRampToValueAtTime(60, now + 0.22);
    clackGain.gain.setValueAtTime(0.5, now + 0.1);
    clackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    clackOsc.connect(clackGain);
    clackGain.connect(ctx.destination);
    clackOsc.start(now + 0.1);
    clackOsc.stop(now + 0.26);

    // 3. Capsule rolling down the metal chute (low rumbling friction)
    const rumbleOsc = ctx.createOscillator();
    const rumbleGain = ctx.createGain();
    rumbleOsc.type = 'sawtooth';
    rumbleOsc.frequency.setValueAtTime(120, now + 0.25);
    rumbleOsc.frequency.exponentialRampToValueAtTime(80, now + 0.45);
    rumbleGain.gain.setValueAtTime(0.25, now + 0.25);
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    rumbleOsc.connect(rumbleGain);
    rumbleGain.connect(ctx.destination);
    rumbleOsc.start(now + 0.25);
    rumbleOsc.stop(now + 0.52);

    // 4. Capsule landing thud in the collection bay
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.type = 'sine';
    thudOsc.frequency.setValueAtTime(140, now + 0.52);
    thudOsc.frequency.exponentialRampToValueAtTime(45, now + 0.7);
    thudGain.gain.setValueAtTime(0.8, now + 0.52);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.72);
    thudOsc.connect(thudGain);
    thudGain.connect(ctx.destination);
    thudOsc.start(now + 0.52);
    thudOsc.stop(now + 0.75);

    // 5. Pneumatic soda hiss release ("pssshh")
    const bufferSize = ctx.sampleRate * 0.3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(2200, now + 0.55);
    noiseFilter.Q.setValueAtTime(2.0, now + 0.55);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now + 0.55);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    whiteNoise.start(now + 0.55);
    whiteNoise.stop(now + 0.85);

    // 6. Cheerful victory jingle
    const notes = [659.25, 880, 1174.66];
    notes.forEach((freq, idx) => {
      const noteTime = now + 0.8 + idx * 0.08;
      const nOsc = ctx.createOscillator();
      const nGain = ctx.createGain();
      nOsc.type = 'sine';
      nOsc.frequency.setValueAtTime(freq, noteTime);
      nGain.gain.setValueAtTime(0.2, noteTime);
      nGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.18);
      nOsc.connect(nGain);
      nGain.connect(ctx.destination);
      nOsc.start(noteTime);
      nOsc.stop(noteTime + 0.2);
    });
  }
}

export const sound = new SoundEngine();
