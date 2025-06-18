// Enhanced notification sounds with Web Audio API
class NotificationSounds {
  constructor() {
    this.soundEnabled = true;
    this.audioContext = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.log('Web Audio API not supported');
    }
  }

  // Generate notification sound using Web Audio API
  generateTone(frequency = 800, duration = 200, type = 'sine') {
    if (!this.audioContext || !this.soundEnabled) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.log('Error playing notification sound:', error);
    }
  }

  playNotificationSound(type = 'default') {
    if (!this.soundEnabled) return;

    switch (type) {
      case 'high':
        this.generateTone(1000, 300, 'sine');
        setTimeout(() => this.generateTone(1200, 200, 'sine'), 150);
        break;
      case 'medium':
        this.generateTone(800, 250, 'sine');
        break;
      case 'low':
        this.generateTone(600, 300, 'triangle');
        break;
      case 'success':
        this.generateTone(523, 150, 'sine'); // C
        setTimeout(() => this.generateTone(659, 150, 'sine'), 100); // E
        setTimeout(() => this.generateTone(784, 200, 'sine'), 200); // G
        break;
      case 'warning':
        this.generateTone(400, 200, 'sawtooth');
        setTimeout(() => this.generateTone(500, 200, 'sawtooth'), 150);
        break;
      default:
        this.generateTone(800, 200, 'sine');
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('notificationSoundEnabled', this.soundEnabled.toString());
    return this.soundEnabled;
  }

  getSoundEnabled() {
    const stored = localStorage.getItem('notificationSoundEnabled');
    if (stored !== null) {
      this.soundEnabled = stored === 'true';
    }
    return this.soundEnabled;
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    localStorage.setItem('notificationSoundEnabled', enabled.toString());
  }
}

export default new NotificationSounds();