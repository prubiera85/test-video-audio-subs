import VideoPlayer from './VideoPlayer';
import './VideoPlayerSelector.css';

function VideoPlayerSelector({ videoProps }) {
  return (
    <div className="player-container">
      <VideoPlayer {...videoProps} />
    </div>
  );
}

export default VideoPlayerSelector;
