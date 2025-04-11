import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <h1>Video Player Testing Application</h1>
      <p className="intro">
        This application helps you test different capabilities of HTML5 video players,
        focusing on handling subtitle tracks and audio tracks for video files.
      </p>

      <div className="features-grid">
        <div className="feature-card">
          <h2>Embedded Tracks Player</h2>
          <p>Test playing videos with embedded subtitle and audio tracks.</p>
          <p>
            This player detects and displays all subtitles and audio tracks that are embedded
            within the video file itself.
          </p>
          <Link to="/embedded-tracks" className="feature-link">
            Go to Embedded Tracks Player
          </Link>
        </div>

        <div className="feature-card">
          <h2>External Tracks Player</h2>
          <p>Test playing videos with external subtitle and audio files.</p>
          <p>
            This player loads a video file along with separate subtitle (.vtt/.srt) and
            audio files that are located on the server.
          </p>
          <Link to="/external-tracks" className="feature-link">
            Go to External Tracks Player
          </Link>
        </div>

        <div className="feature-card">
          <h2>File Picker Player</h2>
          <p>Test playing your own video files from your computer.</p>
          <p>
            This player allows you to select any video file from your local device
            and play it in the browser.
          </p>
          <Link to="/file-picker" className="feature-link">
            Go to File Picker Player
          </Link>
        </div>

        <div className="feature-card">
          <h2>Custom Player</h2>
          <p>Test playing videos with your own custom subtitle and audio tracks.</p>
          <p>
            This player lets you select a video file from your device and add
            your own subtitle and audio tracks to it.
          </p>
          <Link to="/custom-player" className="feature-link">
            Go to Custom Player
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
