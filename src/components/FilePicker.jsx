import { useState } from 'react';
import './FilePicker.css';

function FilePicker({
  onVideoSelect,
  onSubtitlesSelect = null,
  onAudioSelect = null,
  accept = "video/*"
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [subtitleFiles, setSubtitleFiles] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    // Create object URL for the video file
    const videoUrl = URL.createObjectURL(file);
    onVideoSelect(videoUrl, file.name);
  };

  const handleSubtitlesChange = (e) => {
    if (!onSubtitlesSelect) return;

    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newSubtitles = files.map(file => {
      // Try to extract language from filename (e.g., "subtitle_en.vtt" -> "en")
      let language = 'unknown';
      const match = file.name.match(/_([a-z]{2})\.vtt$/i);
      if (match && match[1]) {
        language = match[1].toLowerCase();
      }

      return {
        name: file.name,
        src: URL.createObjectURL(file),
        language,
        label: `${file.name} (${language.toUpperCase()})`
      };
    });

    setSubtitleFiles([...subtitleFiles, ...newSubtitles]);
    onSubtitlesSelect(newSubtitles);
  };

  const handleAudioChange = (e) => {
    if (!onAudioSelect) return;

    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newAudioTracks = files.map(file => {
      // Try to extract language from filename (e.g., "audio_es.mp3" -> "es")
      let language = 'unknown';
      const match = file.name.match(/_([a-z]{2})\.[a-z0-9]+$/i);
      if (match && match[1]) {
        language = match[1].toLowerCase();
      }

      return {
        name: file.name,
        src: URL.createObjectURL(file),
        language,
        label: `${file.name} (${language.toUpperCase()})`
      };
    });

    setAudioFiles([...audioFiles, ...newAudioTracks]);
    onAudioSelect(newAudioTracks);
  };

  const removeSubtitle = (index) => {
    const newSubtitles = [...subtitleFiles];
    newSubtitles.splice(index, 1);
    setSubtitleFiles(newSubtitles);
    onSubtitlesSelect(newSubtitles);
  };

  const removeAudio = (index) => {
    const newAudioTracks = [...audioFiles];
    newAudioTracks.splice(index, 1);
    setAudioFiles(newAudioTracks);
    onAudioSelect(newAudioTracks);
  };

  return (
    <div className="file-picker">
      <div className="file-input-group">
        <label htmlFor="video-upload" className="file-input-label">
          Select Video File
        </label>
        <input
          type="file"
          id="video-upload"
          className="file-input"
          accept={accept}
          onChange={handleVideoChange}
        />
        {selectedFile && (
          <div className="selected-file">
            Selected: {selectedFile.name}
          </div>
        )}
      </div>

      {onSubtitlesSelect && (
        <div className="file-input-group">
          <label htmlFor="subtitle-upload" className="file-input-label">
            Add Subtitle Files (VTT/SRT)
          </label>
          <input
            type="file"
            id="subtitle-upload"
            className="file-input"
            accept=".vtt,.srt"
            onChange={handleSubtitlesChange}
            multiple
          />

          {subtitleFiles.length > 0 && (
            <div className="file-list">
              <h4>Subtitle Tracks:</h4>
              <ul>
                {subtitleFiles.map((file, index) => (
                  <li key={index}>
                    {file.name} ({file.language.toUpperCase()})
                    <button
                      className="remove-file-btn"
                      onClick={() => removeSubtitle(index)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {onAudioSelect && (
        <div className="file-input-group">
          <label htmlFor="audio-upload" className="file-input-label">
            Add Audio Tracks
          </label>
          <input
            type="file"
            id="audio-upload"
            className="file-input"
            accept="audio/*"
            onChange={handleAudioChange}
            multiple
          />

          {audioFiles.length > 0 && (
            <div className="file-list">
              <h4>Audio Tracks:</h4>
              <ul>
                {audioFiles.map((file, index) => (
                  <li key={index}>
                    {file.name} ({file.language.toUpperCase()})
                    <button
                      className="remove-file-btn"
                      onClick={() => removeAudio(index)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FilePicker;
