import VideoJsPlayer from '../components/VideoJsPlayer';
import './PageStyles.css';

function VideoJsPage() {
  return (
    <div className="page-container">
      <h1 className="page-title">Reproductor con Video.js</h1>
      <div className="page-content">
        <p className="page-description">
          Esta página muestra un reproductor de video implementado con la biblioteca Video.js,
          que ofrece una experiencia más avanzada y personalizable.
        </p>
        <VideoJsPlayer />
      </div>
    </div>
  );
}

export default VideoJsPage;
