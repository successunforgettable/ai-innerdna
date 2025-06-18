// Notification sound effects
class NotificationSounds {
  constructor() {
    this.audioContext = null;
    this.soundEnabled = true;
    this.initAudio();
  }

  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context not supported');
    }
  }

  // Generate notification sound using Web Audio API
  playNotificationSound(type = 'default') {
    if (!this.soundEnabled || !this.audioContext) return;

    const sounds = {
      default: { frequency: 800, duration: 0.2 },
      high: { frequency: 1000, duration: 0.3 },
      low: { frequency: 400, duration: 0.2 },
      success: { frequency: 600, duration: 0.15 }
    };

    const sound = sounds[type] || sounds.default;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(sound.frequency, this.audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + sound.duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + sound.duration);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('notificationSounds', this.soundEnabled);
    return this.soundEnabled;
  }

  getSoundEnabled() {
    return this.soundEnabled;
  }
}

export default new NotificationSounds();