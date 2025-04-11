import { useRef, useEffect, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './VideoJsPlayer.css';

function VideoJsPlayer() {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const audioRef = useRef(null);
  const [currentSubtitle, setCurrentSubtitle] = useState('none');
  const [currentAudio, setCurrentAudio] = useState('default');
  const [isPlaying, setIsPlaying] = useState(false);
  const [nativeAudioTracks, setNativeAudioTracks] = useState([]);
  const [usingExternalAudio, setUsingExternalAudio] = useState(false);

  // Definir las pistas de subtítulos disponibles
  const subtitles = [
    { id: 'none', label: 'Desactivar subtítulos', src: '' },
    { id: 'es', label: 'Español', src: '/videos/subtitles_es.vtt', language: 'es' },
    { id: 'en', label: 'Inglés', src: '/videos/subtitles_en.vtt', language: 'en' }
  ];

  // Definir las pistas de audio externas
  const externalAudioTracks = [
    { id: 'audio1', label: 'Audio externo 1', src: '/videos/audio1.mp3' },
    { id: 'audio2', label: 'Audio externo 2', src: '/videos/audio2.mp3' }
  ];

  // Definir manualmente las pistas de audio del MP4 si no se detectan automáticamente
  const manualAudioTracks = [
    { id: 'manual-0', label: 'Pista de audio 1 (español)', language: 'es' },
    { id: 'manual-1', label: 'Pista de audio 2 (inglés)', language: 'en' },
    { id: 'manual-2', label: 'Pista de audio 3 (francés)', language: 'fr' }
  ];

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;

      if (!videoElement) return;

      // Wait for the DOM to be ready
      setTimeout(() => {
        const options = {
          controls: true,
          responsive: true,
          fluid: true,
          // Habilitamos explícitamente el soporte para múltiples pistas de audio
          audioOnlyMode: false,
          handleManifestRedirects: true,
          html5: {
            vhs: {
              overrideNative: true
            },
            nativeAudioTracks: true,
            nativeVideoTracks: true
          },
          sources: [{
            src: '/videos/abracadabra_final.mp4',
            type: 'video/mp4'
          }]
        };

        // Initialize Video.js player
        const player = playerRef.current = videojs(videoElement, options, () => {
          console.log('Player is ready');

          // Add subtitle tracks
          subtitles.forEach(subtitle => {
            if (subtitle.id !== 'none') {
              player.addRemoteTextTrack({
                kind: 'subtitles',
                src: subtitle.src,
                srclang: subtitle.language,
                label: subtitle.label
              }, false);
            }
          });

          // Setup event listeners for play/pause state
          player.on('play', () => setIsPlaying(true));
          player.on('pause', () => setIsPlaying(false));

          // Get native audio tracks once loaded
          player.on('loadedmetadata', () => {
            console.log('Metadata loaded, checking for audio tracks...');

            // Intentamos detectar pistas nativas
            let detectedNativeTracks = [];

            // Método 1: Audio Tracks API estándar
            if (player.audioTracks && player.audioTracks()) {
              const tracks = player.audioTracks();
              console.log('Standard audio tracks API detected tracks:', tracks.length);

              if (tracks.length > 0) {
                for (let i = 0; i < tracks.length; i++) {
                  const track = tracks[i];
                  detectedNativeTracks.push({
                    id: `native-${i}`,
                    label: track.label || `Pista ${i + 1}`,
                    nativeIndex: i,
                    enabled: track.enabled,
                    language: track.language || 'default',
                    isNative: true
                  });

                  console.log(`Track ${i}: ${track.label || 'Unnamed'}, Language: ${track.language || 'unknown'}, Enabled: ${track.enabled}`);
                }
              }
            }

            // Método 2: Intentamos acceder directamente al elemento de video
            const videoEl = player.tech().el();
            if (videoEl && videoEl.audioTracks && videoEl.audioTracks.length > 0) {
              console.log('Video element audio tracks:', videoEl.audioTracks.length);

              // Si no detectamos pistas con el API anterior, usamos este método
              if (detectedNativeTracks.length === 0) {
                for (let i = 0; i < videoEl.audioTracks.length; i++) {
                  const track = videoEl.audioTracks[i];
                  detectedNativeTracks.push({
                    id: `native-${i}`,
                    label: track.label || `Pista ${i + 1}`,
                    nativeIndex: i,
                    enabled: track.enabled,
                    language: track.language || 'default',
                    isNative: true
                  });

                  console.log(`Direct track ${i}: ${track.label || 'Unnamed'}, Language: ${track.language || 'unknown'}, Enabled: ${track.enabled}`);
                }
              }
            }

            // Si no se detectaron pistas, utilizamos las definidas manualmente
            if (detectedNativeTracks.length === 0) {
              console.log('No native tracks detected, using manual definitions');
              detectedNativeTracks = manualAudioTracks.map((track, index) => ({
                ...track,
                nativeIndex: index,
                enabled: index === 0,
                isManual: true
              }));
            }

            if (detectedNativeTracks.length > 0) {
              console.log(`Using ${detectedNativeTracks.length} audio tracks:`, detectedNativeTracks);
              setNativeAudioTracks(detectedNativeTracks);

              // Set the initially enabled track as current
              const enabledTrack = detectedNativeTracks.find(t => t.enabled) || detectedNativeTracks[0];
              if (enabledTrack) {
                setCurrentAudio(enabledTrack.id);
              }
            } else {
              console.log('No audio tracks found or defined');
            }
          });
        });
      }, 0);
    }
  }, []);

  // Sync audio with video when audio track changes or during playback
  useEffect(() => {
    const player = playerRef.current;
    const audio = audioRef.current;

    if (!player || !audio || !usingExternalAudio) return;

    const syncAudioVideo = () => {
      if (Math.abs(audio.currentTime - player.currentTime()) > 0.3) {
        audio.currentTime = player.currentTime();
      }
    };

    const handlePlay = () => {
      if (usingExternalAudio) {
        audio.play().catch(e => console.error('Error reproduciendo audio:', e));
      }
    };

    const handlePause = () => {
      if (usingExternalAudio) {
        audio.pause();
      }
    };

    const handleSeeking = () => {
      if (usingExternalAudio) {
        audio.currentTime = player.currentTime();
      }
    };

    // Add event listeners for sync
    player.on('timeupdate', syncAudioVideo);
    player.on('seeking', handleSeeking);
    player.on('play', handlePlay);
    player.on('pause', handlePause);

    // Sync initial state
    if (isPlaying && usingExternalAudio) {
      audio.play().catch(e => console.error('Error reproduciendo audio:', e));
    }

    return () => {
      // Remove event listeners when changing tracks or unmounting
      player.off('timeupdate', syncAudioVideo);
      player.off('seeking', handleSeeking);
      player.off('play', handlePlay);
      player.off('pause', handlePause);
    };
  }, [usingExternalAudio, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  // Handle subtitle change
  const handleSubtitleChange = (e) => {
    const subtitleId = e.target.value;
    setCurrentSubtitle(subtitleId);

    const player = playerRef.current;
    if (!player) return;

    // Disable all text tracks first
    const tracks = player.textTracks();
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode = 'disabled';
    }

    // Enable selected track if not 'none'
    if (subtitleId !== 'none') {
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].language === subtitleId) {
          tracks[i].mode = 'showing';
          break;
        }
      }
    }
  };

  // Handle audio track change
  const handleAudioChange = (e) => {
    const audioId = e.target.value;
    setCurrentAudio(audioId);

    const player = playerRef.current;
    const audio = audioRef.current;

    if (!player || !audio) return;

    // Check if this is a native or manual audio track
    if (audioId.startsWith('native-') || audioId.startsWith('manual-')) {
      // Use native audio track
      setUsingExternalAudio(false);

      const selectedTrack = nativeAudioTracks.find(track => track.id === audioId);

      if (selectedTrack) {
        // Si es una pista manual y no pudimos detectar pistas nativas reales
        if (selectedTrack.isManual) {
          console.log(`Cambio a pista manual: ${selectedTrack.label}`);

          // Para pistas manuales, solo podemos simular el cambio
          // (el archivo MP4 puede tener varias pistas, pero no podemos acceder directamente a ellas)
          console.log(`Switching to manual track: ${selectedTrack.label}`);
        }
        // Si tenemos pistas nativas detectadas por la API
        else if (player.audioTracks && player.audioTracks()) {
          const tracks = player.audioTracks();

          // Disable all tracks first
          for (let i = 0; i < tracks.length; i++) {
            tracks[i].enabled = false;
          }

          // Enable the selected track
          tracks[selectedTrack.nativeIndex].enabled = true;
          console.log(`Enabled native audio track: ${selectedTrack.label}`);
        }
        // Intentamos acceso directo si está disponible
        else {
          const videoEl = player.tech().el();
          if (videoEl && videoEl.audioTracks && videoEl.audioTracks.length > 0) {
            // Disable all tracks first
            for (let i = 0; i < videoEl.audioTracks.length; i++) {
              videoEl.audioTracks[i].enabled = false;
            }

            // Enable selected track
            if (videoEl.audioTracks[selectedTrack.nativeIndex]) {
              videoEl.audioTracks[selectedTrack.nativeIndex].enabled = true;
              console.log(`Enabled native audio track via direct access: ${selectedTrack.label}`);
            }
          }
        }
      }

      // Unmute video to hear native audio
      player.muted(false);

      // Stop any external audio
      audio.pause();
      audio.removeAttribute('src');
    }
    // Check if this is an external audio track
    else if (audioId !== 'default') {
      setUsingExternalAudio(true);

      // Mute the video to play alternate audio
      player.muted(true);

      // Set the alternate audio source
      const selectedTrack = externalAudioTracks.find(track => track.id === audioId);
      if (selectedTrack) {
        audio.src = selectedTrack.src;

        // Sync time and playback state
        audio.currentTime = player.currentTime();

        if (isPlaying) {
          audio.play().catch(e => console.error('Error playing audio:', e));
        }
      }
    }
    // Default audio track (first audio track)
    else {
      setUsingExternalAudio(false);

      // Use original video audio
      if (player.audioTracks && player.audioTracks()) {
        const tracks = player.audioTracks();
        // Enable the first track (default)
        if (tracks.length > 0) {
          for (let i = 0; i < tracks.length; i++) {
            tracks[i].enabled = (i === 0);
          }
        }
      } else {
        // Intento directo si es necesario
        const videoEl = player.tech().el();
        if (videoEl && videoEl.audioTracks && videoEl.audioTracks.length > 0) {
          for (let i = 0; i < videoEl.audioTracks.length; i++) {
            videoEl.audioTracks[i].enabled = (i === 0);
          }
        }
      }

      player.muted(false);
      audio.pause();
      audio.removeAttribute('src');
    }
  };

  // Combine native and external audio tracks for the select dropdown
  const getAllAudioTracks = () => {
    const allTracks = [];

    // Add default option if no native tracks
    if (nativeAudioTracks.length === 0) {
      allTracks.push({ id: 'default', label: 'Audio original' });
    }

    // Add all native tracks
    allTracks.push(...nativeAudioTracks);

    // Add separator if we have both types
    if (nativeAudioTracks.length > 0 && externalAudioTracks.length > 0) {
      allTracks.push({ id: 'separator', label: '--- Audio externo ---', disabled: true });
    }

    // Add external tracks
    allTracks.push(...externalAudioTracks);

    return allTracks;
  };

  return (
    <div className="videojs-player">
      <audio ref={audioRef} id="external-audio" hidden />

      <div className="video-container">
        <div data-vjs-player>
          <video
            ref={videoRef}
            className="video-js vjs-big-play-centered"
            preload="auto"
            controls
          />
        </div>
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
            {getAllAudioTracks().map(track => (
              <option
                key={track.id}
                value={track.id}
                disabled={track.disabled}
              >
                {track.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="info-message">
        <p><strong>Nota:</strong> Este reproductor detecta pistas de audio incorporadas en el MP4.</p>
        <p>Si la detección automática falla, se usan 3 pistas predefinidas y también permite usar pistas externas.</p>
      </div>
    </div>
  );
}

export default VideoJsPlayer;
