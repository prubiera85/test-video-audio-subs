import { useState } from 'react';
import SimplePlayer from './components/SimplePlayer';
import VideoJsPlayer from './components/VideoJsPlayer';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('simple');

  return (
    <div className="app">
      <header className="header">
        <h1>Reproductor de Video</h1>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'simple' ? 'active' : ''}`}
            onClick={() => setActiveTab('simple')}
          >
            Reproductor Simple
          </button>
          <button
            className={`tab ${activeTab === 'videojs' ? 'active' : ''}`}
            onClick={() => setActiveTab('videojs')}
          >
            Reproductor Video.js
          </button>
        </div>
      </header>
      <main className="content">
        {activeTab === 'simple' && <SimplePlayer />}
        {activeTab === 'videojs' && <VideoJsPlayer />}
      </main>
      <footer className="footer">
        <p>Video Player Testing App - {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
