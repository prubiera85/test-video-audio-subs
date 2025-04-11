import { useRef, useState, useEffect } from 'react';
import './VideoPlayer.css';

function VideoPlayer({
  src,
  tracks = [],
  audioTracks = [],
  onTracksLoaded = () => {},
}) {
  const videoRef = useRef(null);
  const [currentSubtitle, setCurrentSubtitle] = useState('off');
  const [currentAudioTrack, setCurrentAudioTrack] = useState(0);

  // Usar useEffect para informar al componente padre sobre las pistas disponibles
  useEffect(() => {
    if (tracks.length > 0 || audioTracks.length > 0) {
      onTracksLoaded({
        subtitles: tracks,
        audioTracks: audioTracks
      });
    }
  }, [tracks, audioTracks, onTracksLoaded]);

  // Manejar selección de subtítulos
  const handleSubtitleChange = (e) => {
    const value = e.target.value;
    setCurrentSubtitle(value);

    const video = videoRef.current;
    if (!video) return;

    // Primero, desactivar todas las pistas de texto
    for (let i = 0; i < video.textTracks.length; i++) {
      video.textTracks[i].mode = 'hidden';
    }

    // Si no es 'off', activar la pista seleccionada
    if (value !== 'off') {
      const trackId = parseInt(value, 10);
      if (!isNaN(trackId) && trackId >= 0 && trackId < video.textTracks.length) {
        video.textTracks[trackId].mode = 'showing';
      }
    }
  };

  // Manejar selección de pista de audio
  const handleAudioTrackChange = (e) => {
    const value = e.target.value;
    setCurrentAudioTrack(value);

    // Nota: Esta funcionalidad requeriría un enfoque personalizado
    // ya que audioTracks API no está ampliamente soportada
    console.log('Cambio de pista de audio seleccionada:', value);
  };

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={src}
        controls
        className="video-element"
      >
        {/* Renderizar pistas de subtítulos externas */}
        {tracks.map((track, index) => (
          <track
            key={index}
            kind="subtitles"
            src={track.src}
            srcLang={track.language}
            label={track.label}
            default={index === 0}
          />
        ))}
        Su navegador no soporta la etiqueta de video.
      </video>

      <div className="track-controls">
        {tracks.length > 0 && (
          <div className="control-group">
            <label htmlFor="subtitle-selector">Subtítulos:</label>
            <select
              id="subtitle-selector"
              value={currentSubtitle}
              onChange={handleSubtitleChange}
            >
              <option value="off">Desactivar</option>
              {tracks.map((track, index) => (
                <option key={index} value={index}>
                  {track.label} ({track.language})
                </option>
              ))}
            </select>
          </div>
        )}

        {audioTracks.length > 1 && (
          <div className="control-group">
            <label htmlFor="audio-selector">Pista de Audio:</label>
            <select
              id="audio-selector"
              value={currentAudioTrack}
              onChange={handleAudioTrackChange}
            >
              {audioTracks.map((track, index) => (
                <option key={index} value={index}>
                  {track.label} ({track.language})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;
