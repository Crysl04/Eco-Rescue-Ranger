
let pickupAudio, plantAudio, completeAudio, backgroundMusic;
let musicEnabled = true;
let musicVolume = 0.3; // Background music volume (30% by default)
let sfxVolume = 0.6; // Sound effects volume

export function initAudio() {
  // Sound effects
  pickupAudio = new Audio('/assets/audio/pickup.wav');
  plantAudio = new Audio('/assets/audio/plant.wav');
  completeAudio = new Audio('/assets/audio/complete.wav');
  
  // Background music
  backgroundMusic = new Audio('/assets/audio/ambient.wav');
  backgroundMusic.loop = true;
  backgroundMusic.volume = musicVolume;

  // Set volumes
  pickupAudio.volume = sfxVolume;
  plantAudio.volume = sfxVolume;
  completeAudio.volume = 0.7;

  // Browser unlock
  const unlock = () => {
    // Unlock audio context for all sounds
    const promises = [
      pickupAudio.play().then(() => {
        pickupAudio.pause();
        pickupAudio.currentTime = 0;
      }),
      backgroundMusic.play().then(() => {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        if (musicEnabled) {
          // Start playing background music after unlock
          setTimeout(() => playBackgroundMusic(), 100);
        }
      }).catch(() => {})
    ];
    
    Promise.allSettled(promises).then(() => {
      console.log('Audio system unlocked');
    });
    
    window.removeEventListener('click', unlock);
    window.removeEventListener('keydown', unlock);
  };
  
  // Add multiple ways to unlock audio
  window.addEventListener('click', unlock, { once: true });
  window.addEventListener('keydown', unlock, { once: true });
}

function play(audio) {
  if (!audio) return;
  try {
    audio.currentTime = 0;
    audio.play().catch(e => console.log('Audio play failed:', e.message));
  } catch {}
}

// Background music controls
export function playBackgroundMusic() {
  if (!backgroundMusic || !musicEnabled) return;
  try {
    backgroundMusic.currentTime = 0;
    backgroundMusic.play().catch(e => {
      console.log('Background music play failed, will retry on user interaction');
    });
  } catch {}
}

export function pauseBackgroundMusic() {
  if (backgroundMusic) {
    backgroundMusic.pause();
  }
}

export function setMusicEnabled(enabled) {
  musicEnabled = enabled;
  if (enabled) {
    playBackgroundMusic();
  } else {
    pauseBackgroundMusic();
  }
}

export function toggleMusic() {
  musicEnabled = !musicEnabled;
  setMusicEnabled(musicEnabled);
  return musicEnabled;
}

export function setMusicVolume(volume) {
  musicVolume = Math.max(0, Math.min(1, volume));
  if (backgroundMusic) {
    backgroundMusic.volume = musicVolume;
  }
}

export function setSfxVolume(volume) {
  sfxVolume = Math.max(0, Math.min(1, volume));
  if (pickupAudio) pickupAudio.volume = sfxVolume;
  if (plantAudio) plantAudio.volume = sfxVolume;
  if (completeAudio) completeAudio.volume = Math.min(0.7, sfxVolume + 0.1);
}

export function getMusicEnabled() {
  return musicEnabled;
}

export function getMusicVolume() {
  return musicVolume;
}

export function getSfxVolume() {
  return sfxVolume;
}

// Sound effect functions
export function playPickup() { 
  if (sfxVolume > 0) play(pickupAudio); 
}

export function playPlant() { 
  if (sfxVolume > 0) play(plantAudio); 
}

export function playComplete() { 
  if (sfxVolume > 0) play(completeAudio); 
}