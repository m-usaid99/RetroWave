import React, { useState, useRef, useEffect } from 'react';
import * as mm from 'music-metadata';

const MediaPlayer = ({ isPlaying, onPlayPause, onMetadataLoaded }) => {
  const [audioSrc, setAudioSrc] = useState(null);
  const audioRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
      onPlayPause(false); // Pause playback when a new file is uploaded

      const metadata = await mm.parseBlob(file);
      const { title, artist, album } = metadata.common;

      // Pass metadata back to the parent component
      onMetadataLoaded({
        title: title || file.name,
        artist: artist || 'Unknown Artist',
        album: album || 'Unknown Album',
      });
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileUpload} />
      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} controls={false} />
      )}
    </div>
  );
};

export default MediaPlayer;

