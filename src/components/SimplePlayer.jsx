import { useRef, useState, useEffect } from 'react';
import './SimplePlayer.css';

function SimplePlayer() {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [currentSubtitle, setCurrentSubtitle] = useState('none');
  const [currentAudio, setCurrentAudio] = useState('default');
  const [isPlaying, setIsPlaying] = useState(false);

  // Definir las pistas de subtítulos disponibles
  const subtitles = [
    { id: 'none', label: 'Desactivar subtítulos', src: '' },
    { id: 'es', label: 'Español', src: '/videos/subtitles_es.vtt', language: 'es' },
    { id: 'en', label: 'Inglés', src: '/videos/subtitles_en.vtt', language: 'en' }
  ];

  // Definir las pistas de audio disponibles
  const audioTracks = [
    { id: 'default', label: 'Audio original' },
    { id: 'audio1', label: 'Audio alternativo 1', src: '/videos/audio1.mp3' },
    { id: 'audio2', label: 'Audio alternativo 2', src: '/videos/audio2.mp3' }
  ];

  // Manejar cambio de subtítulos
  const handleSubtitleChange = (e) => {
    const subtitleId = e.target.value;
    setCurrentSubtitle(subtitleId);

    const video = videoRef.current;
    if (!video) return;

    // Desactivar todas las pistas de texto
    for (let i = 0; i < video.textTracks.length; i++) {
      video.textTracks[i].mode = 'hidden';
    }

    // Activar la pista seleccionada si no es 'none'
    if (subtitleId !== 'none') {
      // Encontrar la pista por su ID (basado en el atributo srclang)
      const trackIndex = Array.from(video.textTracks).findIndex(
        track => track.language === subtitleId
      );

      if (trackIndex !== -1) {
        video.textTracks[trackIndex].mode = 'showing';
      }
    }
  };

  // Manejar cambio de pista de audio
  const handleAudioChange = (e) => {
    const audioId = e.target.value;
    setCurrentAudio(audioId);

    const video = videoRef.current;
    const audio = audioRef.current;

    if (!video || !audio) return;

    if (audioId === 'default') {
      // Usar audio original del video
      video.muted = false;
      audio.pause();
      audio.removeAttribute('src');

      // Si el video estaba reproduciéndose, mantener ese estado
      if (isPlaying) {
        video.play();
      }
    } else {
      // Silenciar el video para reproducir el audio alternativo
      video.muted = true;

      // Establecer la fuente de audio alternativa
      const selectedTrack = audioTracks.find(track => track.id === audioId);
      audio.src = selectedTrack.src;

      // Sincronizar tiempo y estado de reproducción
      audio.currentTime = video.currentTime;

      if (isPlaying) {
        audio.play();
      }
    }
  };

  // Controlar la reproducción y sincronización de video y audio
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (!video || !audio) return;

    const syncAudioVideo = () => {
      if (currentAudio !== 'default' && Math.abs(audio.currentTime - video.currentTime) > 0.3) {
        audio.currentTime = video.currentTime;
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (currentAudio !== 'default') {
        audio.play().catch(e => console.error('Error reproduciendo audio:', e));
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (currentAudio !== 'default') {
        audio.pause();
      }
    };

    const handleSeeking = () => {
      if (currentAudio !== 'default') {
        audio.currentTime = video.currentTime;
      }
    };

    // Agregar event listeners
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', syncAudioVideo);
    video.addEventListener('seeking', handleSeeking);

    // Limpiar event listeners
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', syncAudioVideo);
      video.removeEventListener('seeking', handleSeeking);
    };
  }, [currentAudio, isPlaying]);

  return (
    <div className="simple-player">
      <audio ref={audioRef} id="external-audio" hidden />

      <div className="video-container">
        <video
          ref={videoRef}
          src="/videos/abracadabra_final.mp4"
          controls
          className="video-element"
        >
          {/* Pistas de subtítulos */}
          {subtitles.filter(sub => sub.id !== 'none').map(subtitle => (
            <track
              key={subtitle.id}
              kind="subtitles"
              src={subtitle.src}
              srcLang={subtitle.language}
              label={subtitle.label}
            />
          ))}
          Su navegador no soporta la etiqueta de video.
        </video>
      </div>

      <div className="controls-container">
        <div className="control-group">
          <label htmlFor="subtitle-selector">Subtítulos:</label>
          <select
            id="subtitle-selector"
            value={currentSubtitle}
            onChange={handleSubtitleChange}
          >
            {subtitles.map(subtitle => (
              <option key={subtitle.id} value={subtitle.id}>
                {subtitle.label}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="audio-selector">Pista de Audio:</label>
          <select
            id="audio-selector"
            value={currentAudio}
            onChange={handleAudioChange}
          >
            {audioTracks.map(track => (
              <option key={track.id} value={track.id}>
                {track.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="info-message">
        <p><strong>Nota:</strong> El cambio de pistas de audio se simula usando un elemento de audio secundario.</p>
        <p>Las pistas de audio reales en HTML5 no son tan flexibles como las de subtítulos.</p>
      </div>
    </div>
  );
}

export default SimplePlayer;
