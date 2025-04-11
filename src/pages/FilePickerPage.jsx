import { useState } from 'react';
import VideoPlayerSelector from '../components/VideoPlayerSelector';
import FilePicker from '../components/FilePicker';
import './PageStyles.css';

function FilePickerPage() {
  const [videoSrc, setVideoSrc] = useState('');
  const [videoName, setVideoName] = useState('');
  const [tracksInfo, setTracksInfo] = useState({ subtitles: [], audioTracks: [] });

  const handleVideoSelect = (url, name) => {
    setVideoSrc(url);
    setVideoName(name);
  };

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
      <h1>File Picker Player</h1>
      <p className="page-description">
        This player allows you to select and play video files from your computer.
      </p>

      <FilePicker onVideoSelect={handleVideoSelect} />

      {videoSrc ? (
        <>
          <VideoPlayerSelector videoProps={videoProps} />

          <div className="info-section">
            <h2>Video Information</h2>
            <p><strong>File name:</strong> {videoName}</p>

            {(tracksInfo.subtitles.length > 0 || tracksInfo.audioTracks.length > 0) && (
              <div className="tracks-info">
                <div className="track-column">
                  <h3>Detected Subtitle Tracks</h3>
                  {tracksInfo.subtitles.length > 0 ? (
                    <ul>
                      {tracksInfo.subtitles.map((track, index) => (
                        <li key={index}>
                          {track.label} ({track.language})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No subtitle tracks detected</p>
                  )}
                </div>

                <div className="track-column">
                  <h3>Detected Audio Tracks</h3>
                  {tracksInfo.audioTracks.length > 0 ? (
                    <ul>
                      {tracksInfo.audioTracks.map((track, index) => (
                        <li key={index}>
                          {track.label} ({track.language})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No additional audio tracks detected</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="no-video-message">
          <p>Select a video file to start playing</p>
        </div>
      )}
    </div>
  );
}

export default FilePickerPage;
