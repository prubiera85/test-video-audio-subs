import { useState } from 'react';
import VideoPlayerSelector from '../components/VideoPlayerSelector';
import './PageStyles.css';

function EmbeddedTracksPage() {
  const [tracksInfo, setTracksInfo] = useState({ subtitles: [], audioTracks: [] });

  // Path to a video file with embedded subtitles and audio tracks
  const videoSrc = '/videos/abracadabra_final.mp4';

  const handleTracksLoaded = (info) => {
    setTracksInfo(info);
  };

  // Prepare video props to pass to the selector
  const videoProps = {
    src: videoSrc,
    onTracksLoaded: handleTracksLoaded
  };

  return (
    <div className="page-container">
      <h1>Embedded Tracks Player</h1>
      <p className="page-description">
        This player detects and displays subtitle and audio tracks that are embedded within the video file itself.
      </p>

      <VideoPlayerSelector videoProps={videoProps} />

      <div className="info-section">
        <h2>Detected Tracks</h2>

        <div className="tracks-info">
          <div className="track-column">
            <h3>Subtitle Tracks</h3>
            {tracksInfo.subtitles.length > 0 ? (
              <ul>
                {tracksInfo.subtitles.map((track, index) => (
                  <li key={index}>
                    {track.label} - Language: {track.language}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No subtitle tracks detected</p>
            )}
          </div>

          <div className="track-column">
            <h3>Audio Tracks</h3>
            {tracksInfo.audioTracks.length > 0 ? (
              <ul>
                {tracksInfo.audioTracks.map((track, index) => (
                  <li key={index}>
                    {track.label} - Language: {track.language}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No audio tracks detected</p>
            )}
          </div>
        </div>

        <div className="note">
          <p>
            <strong>Note:</strong> To test this feature, you need a video file with embedded tracks.
            MP4 files can contain multiple audio tracks and subtitle tracks.
            If no tracks are detected, the example video may not have embedded tracks.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmbeddedTracksPage;
