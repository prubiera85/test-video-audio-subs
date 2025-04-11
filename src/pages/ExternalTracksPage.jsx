import VideoPlayerSelector from '../components/VideoPlayerSelector';
import './PageStyles.css';

function ExternalTracksPage() {
  // Path to a video file
  const videoSrc = "/videos/abracadabra_final.mp4";

  // External subtitle tracks
  const subtitleTracks = [
    {
      id: 'ext-en',
      src: '/videos/subtitles_en.vtt',
      label: 'English Subtitles',
      language: 'en',
      isEmbedded: false
    },
    {
      id: 'ext-es',
      src: '/videos/subtitles_es.vtt',
      label: 'Spanish Subtitles',
      language: 'es',
      isEmbedded: false
    }
  ];

  // External audio tracks
  const audioTracks = [
    {
      id: "ext-audio-en",
      src: "/videos/audio1.mp3",
      label: "Audio 1",
      language: "en",
      isEmbedded: false,
    },
    {
      id: "ext-audio-es",
      src: "/videos/audio2.mp3",
      label: "Audio 2",
      language: "en",
      isEmbedded: false,
    },
  ];

  const handleTracksLoaded = () => {
    // We can use this callback if needed in the future
  };

  // Prepare video props to pass to the selector
  const videoProps = {
    src: videoSrc,
    tracks: subtitleTracks,
    audioTracks: audioTracks,
    onTracksLoaded: handleTracksLoaded
  };

  return (
    <div className="page-container">
      <h1>External Tracks Player</h1>
      <p className="page-description">
        This player loads a video file along with separate subtitle (.vtt/.srt) and audio files.
      </p>

      <VideoPlayerSelector videoProps={videoProps} />

      <div className="info-section">
        <h2>Track Information</h2>

        <div className="tracks-info">
          <div className="track-column">
            <h3>Subtitle Tracks</h3>
            <ul>
              {subtitleTracks.map((track, index) => (
                <li key={index}>
                  {track.label} - Language: {track.language}
                </li>
              ))}
            </ul>
          </div>

          <div className="track-column">
            <h3>Audio Tracks</h3>
            <ul>
              {audioTracks.map((track, index) => (
                <li key={index}>
                  {track.label} - Language: {track.language}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="note">
          <p>
            <strong>Note:</strong> This player demonstrates loading external subtitle and audio
            tracks alongside a video. For full functionality, ensure the server has the proper
            subtitle files (.vtt or .srt) and audio files in the specified locations.
          </p>
          <p>
            Common subtitle formats include WebVTT (.vtt) and SubRip (.srt).
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExternalTracksPage;
