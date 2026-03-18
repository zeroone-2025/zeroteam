export class AudioEngine {
  private static instance: AudioEngine | null = null;
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private currentOscillators: OscillatorNode[] = [];
  private timeouts: ReturnType<typeof setTimeout>[] = [];
  private _volume = 0.5;

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  private ensureContext() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = this._volume;
      this.gainNode.connect(this.audioContext.destination);
    }
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  play(frequency: number, pattern: number[], speed: number = 1.0) {
    this.stop();
    this.ensureContext();
    if (!this.audioContext || !this.gainNode) return;

    let offset = 0;
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = this.audioContext!.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(this.gainNode!);
      this.currentOscillators.push(osc);

      const adjustedDuration = duration / speed;
      const startAt = this.audioContext!.currentTime + startTime / 1000;
      osc.start(startAt);
      osc.stop(startAt + adjustedDuration / 1000);
    };

    const scaleNotes = [1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 15 / 8, 2];
    let noteIdx = 0;

    for (const duration of pattern) {
      const freq = frequency * scaleNotes[noteIdx % scaleNotes.length];
      playNote(freq, offset / speed, duration);
      offset += duration + 50;
      noteIdx++;
    }

    // Loop the pattern
    const totalDuration = offset / speed;
    const loopTimeout = setTimeout(() => {
      this.play(frequency, pattern, speed);
    }, totalDuration);
    this.timeouts.push(loopTimeout);
  }

  playFake(frequency: number, pattern: number[]) {
    // Create oscillators but don't connect to speakers
    this.stop();
    this.ensureContext();
    if (!this.audioContext) return;

    // Create a gain node with 0 volume, not connected to destination
    const silentGain = this.audioContext.createGain();
    silentGain.gain.value = 0;
    silentGain.connect(this.audioContext.destination);

    let offset = 0;
    const scaleNotes = [1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 15 / 8, 2];
    let noteIdx = 0;

    for (const duration of pattern) {
      const osc = this.audioContext.createOscillator();
      osc.type = "sine";
      osc.frequency.value = frequency * scaleNotes[noteIdx % scaleNotes.length];
      osc.connect(silentGain);
      this.currentOscillators.push(osc);

      const startAt = this.audioContext.currentTime + offset / 1000;
      osc.start(startAt);
      osc.stop(startAt + duration / 1000);
      offset += duration + 50;
      noteIdx++;
    }

    const loopTimeout = setTimeout(() => {
      this.playFake(frequency, pattern);
    }, offset);
    this.timeouts.push(loopTimeout);
  }

  setVolume(value: number) {
    this._volume = value;
    if (this.gainNode) {
      this.gainNode.gain.value = value;
    }
  }

  stop() {
    for (const osc of this.currentOscillators) {
      try {
        osc.stop();
      } catch {
        // already stopped
      }
    }
    this.currentOscillators = [];
    for (const t of this.timeouts) {
      clearTimeout(t);
    }
    this.timeouts = [];
  }
}
