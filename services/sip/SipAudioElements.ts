import { Audio } from 'expo-av';
import { MediaStream } from 'react-native-webrtc';

export default class SipAudioElements {
  #ringing: Audio.Sound;
  #failed: Audio.Sound;
  #answer: Audio.Sound;
  #remote: any;  // Replace with a react-native-webrtc compatible element if needed
  
  constructor() {
    this.#ringing = new Audio.Sound();
    this.#failed = new Audio.Sound();
    this.#answer = new Audio.Sound();
    this.#remote = null;
  }

  async loadSounds() {
    await this.#ringing.loadAsync(require('../../assets/sounds/ringing.mp3'));
    await this.#failed.loadAsync(require('../../assets/sounds/failed.mp3'));
    await this.#answer.loadAsync(require('../../assets/sounds/answer.mp3'));
  }

  async playRinging(volume: number | undefined) {
    if (volume !== undefined) {
      await this.#ringing.setVolumeAsync(volume);
    }
    await this.#ringing.replayAsync();
  }

  async pauseRinging() {
    const status = await this.#ringing.getStatusAsync();
    if (status.isLoaded && status.isPlaying) {
      await this.#ringing.pauseAsync();
    }
  }

  async playFailed(volume: number | undefined) {
    await this.pauseRinging();
    if (volume !== undefined) {
      await this.#failed.setVolumeAsync(volume);
    }
    await this.#failed.replayAsync();
  }

  async playAnswer(volume: number | undefined) {
    await this.pauseRinging();
    if (volume !== undefined) {
      await this.#answer.setVolumeAsync(volume);
    }
    await this.#answer.replayAsync();
  }

  isRemoteAudioPaused(): boolean {
    return !this.#remote || this.#remote.paused;
  }

  playRemote(stream: MediaStream) {
    if (this.#remote) {
      this.#remote.srcObject = stream;
      this.#remote.play();
    }
  }

  isPlaying(audio: Audio.Sound): Promise<boolean> {
    return audio.getStatusAsync().then(status => status.isLoaded && status.isPlaying);
  }
}
