/*
Sección: Servicio de sonido.
Qué hace: produce tonos breves originales sin descargar archivos de audio.
Qué recibe: enabled indica si el usuario permite sonido; play recibe el nombre del efecto.
Qué procesa: crea osciladores con frecuencias y duraciones asociadas a cada evento.
Qué devuelve: controles para efectos, música chiptune y preferencia de sonido.
APIs: usa Web Audio API local del navegador; no envía datos ni realiza solicitudes de red.
Dónde se usa: controlador al colocar símbolos y terminar rondas.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
export function createSoundService(enabled = true) {
  let isEnabled = enabled;
  let audioContext = null;
  let musicTimer = null;
  let musicStep = 0;
  const musicNotes = [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 349.23, 440, 349.23, 293.66, 220];
  const soundMap = {
    human: { frequency: 330, duration: 0.08, type: 'triangle' },
    ai: { frequency: 150, duration: 0.12, type: 'sawtooth' },
    win: { frequency: 660, duration: 0.3, type: 'sine' },
    lose: { frequency: 90, duration: 0.4, type: 'sawtooth' },
    draw: { frequency: 240, duration: 0.25, type: 'square' },
  };

  /*
  Sección: Síntesis de tono.
  Qué hace: crea una nota corta con envolvente descendente para obtener sonido de 8 bits.
  Qué recibe: frequency, duration, type y volume.
  Qué procesa: conecta OscillatorNode con GainNode y después con la salida de audio.
  Qué devuelve: no devuelve datos; programa la nota dentro del AudioContext.
  APIs: Web Audio API del navegador; todo se genera localmente sin archivos ni red.
  Dónde se usa: efectos de juego y secuencia musical.
  Fecha de modificación: 10/10/2026.
  Nombre: MCardenas.
  */
  function playTone(frequency, duration, type, volume) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext || !isEnabled) return;

    audioContext ??= new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const startedAt = audioContext.currentTime;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startedAt);
    gain.gain.setValueAtTime(volume, startedAt);
    gain.gain.exponentialRampToValueAtTime(0.001, startedAt + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(startedAt);
    oscillator.stop(startedAt + duration);
  }

  /*
  Sección: Música chiptune.
  Qué hace: repite una melodía original de ocho notas con onda cuadrada.
  Qué recibe: no recibe parámetros.
  Qué procesa: avanza lentamente por una melodía original y sintetiza cada pulso a bajo volumen.
  Qué devuelve: no devuelve datos; mantiene un intervalo hasta stopMusic.
  APIs: setInterval y Web Audio API locales; no reproduce música de terceros.
  Dónde se usa: comienza al pulsar START, ya que los navegadores exigen interacción para audio.
  Fecha de modificación: 10/10/2026.
  Nombre: MCardenas.
  */
  function startMusic() {
    if (!isEnabled || musicTimer !== null) return;
    musicTimer = window.setInterval(() => {
      const waveType = musicStep % 4 === 3 ? 'triangle' : 'square';
      playTone(musicNotes[musicStep % musicNotes.length], 0.18, waveType, 0.016);
      musicStep += 1;
    }, 320);
  }

  function stopMusic() {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }

  return {
    setEnabled(nextEnabled) {
      isEnabled = nextEnabled;
      if (!isEnabled) stopMusic();
    },
    startMusic,
    stopMusic,
    play(soundName) {
      if (!isEnabled || !soundMap[soundName]) return;
      const { frequency, duration, type } = soundMap[soundName];
      playTone(frequency, duration, type, 0.08);
    },
  };
}
