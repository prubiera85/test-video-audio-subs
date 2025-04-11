import SimplePlayer from './components/SimplePlayer';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Reproductor de Video Simple</h1>
      </header>
      <main className="content">
        <SimplePlayer />
      </main>
      <footer className="footer">
        <p>Video Player Testing App - {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
