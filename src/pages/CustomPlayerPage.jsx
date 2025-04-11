import { useState, useEffect } from 'react';
import VideoPlayerSelector from '../components/VideoPlayerSelector';
import FilePicker from '../components/FilePicker';
import './PageStyles.css';

function CustomPlayerPage() {
  const [videoSrc, setVideoSrc] = useState('');
  const [videoName, setVideoName] = useState('');
  const [subtitleTracks, setSubtitleTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [combinedTracks, setCombinedTracks] = useState({ subtitles: [], audioTracks: [] });

  // Update combined tracks when external tracks change
  useEffect(() => {
    setCombinedTracks({
      subtitles: subtitleTracks,
      audioTracks: audioTracks
    });
  }, [subtitleTracks, audioTracks]);

  const handleVideoSelect = (url, name) => {
    setVideoSrc(url);
    setVideoName(name);
    // Clear previous tracks when new video is selected
    setSubtitleTracks([]);
    setAudioTracks([]);
  };

  const handleSubtitlesSelect = (tracks) => {
    setSubtitleTracks(tracks);
  };

  const handleAudioSelect = (tracks) => {
    setAudioTracks(tracks);
  };

  const handleTracksLoaded = (info) => {
    // Combine embedded tracks with our external tracks
    const embeddedSubtitles = info.subtitles.filter(track => track.isEmbedded);
    const embeddedAudio = info.audioTracks.filter(track => track.isEmbedded);

    setCombinedTracks({
      subtitles: [...embeddedSubtitles, ...subtitleTracks],
      audioTracks: [...embeddedAudio, ...audioTracks]
    });
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
      <h1>Custom Player</h1>
      <p className="page-description">
        This player lets you select a video file and add your own subtitle and audio tracks.
      </p>

      <FilePicker
        onVideoSelect={handleVideoSelect}
        onSubtitlesSelect={handleSubtitlesSelect}
        onAudioSelect={handleAudioSelect}
      />

      {videoSrc && (
        <>
          <VideoPlayerSelector videoProps={videoProps} />

          <div className="info-section">
            <h2>Custom Player Configuration</h2>
            <p><strong>Video:</strong> {videoName}</p>

            <div className="tracks-info">
              <div className="track-column">
                <h3>Subtitle Tracks</h3>
                {combinedTracks.subtitles.length > 0 ? (
                  <ul>
                    {combinedTracks.subtitles.map((track, index) => (
                      <li key={index}>
                        {track.label} ({track.language})
                        {track.isEmbedded ? ' - Embedded' : ' - External'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No subtitle tracks added or detected</p>
                )}
              </div>

              <div className="track-column">
                <h3>Audio Tracks</h3>
                {combinedTracks.audioTracks.length > 0 ? (
                  <ul>
                    {combinedTracks.audioTracks.map((track, index) => (
                      <li key={index}>
                        {track.label} ({track.language})
                        {track.isEmbedded ? ' - Embedded' : ' - External'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No additional audio tracks added or detected</p>
                )}
              </div>
            </div>

            <div className="note">
              <p>
                <strong>Tip:</strong> Subtitle files should be in WebVTT (.vtt) or SubRip (.srt) format.
                For best results with audio tracks, make sure they match the duration of the video.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CustomPlayerPage;
