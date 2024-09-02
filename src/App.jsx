import React, { useState, useEffect } from 'react';
import Window from './components/Window';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import styles from './App.module.css';
import { Home } from './components/Home';
import MediaPlayer from './components/MediaPlayer';

const App = () => {
  const [windows, setWindows] = useState({
    home: { open: true, x: 150, y: 300, width: 400, height: 300, zIndex: 2 },
    media: { open: true, x: 425, y: 200, width: 600, height: 450, zIndex: 1 },
    about: { open: false, x: 950, y: 600, width: 350, height: 200, zIndex: 0 },
    visualizer: { open: true, x: 375, y: 125, width: 800, height: 600, zIndex: 0 },
    settings: { open: false, x: 800, y: 100, width: 300, height: 200, zIndex: 0 },
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({
    title: 'No Track Selected',
    artist: '',
    album: '',
    albumArt: null,
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (current, total) => {
    setCurrentTime(current);
    setDuration(total);
  };

  const handleMetadataLoaded = (metadata) => {
    setCurrentTrack(metadata);
  };

  const adjustWindowPositions = () => {
    setWindows(prevWindows => {
      const updatedWindows = { ...prevWindows };
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      Object.keys(updatedWindows).forEach(key => {
        const win = updatedWindows[key];
        let newX = win.x;
        let newY = win.y;

        // Ensure window stays within the screen horizontally
        if (win.x + win.width > screenWidth) {
          newX = screenWidth - win.width - 10;
        } else if (win.x < 0) {
          newX = 10;
        }

        // Ensure window stays within the screen vertically
        if (win.y + win.height > screenHeight) {
          newY = screenHeight - win.height - 10;
        } else if (win.y < 0) {
          newY = 10;
        }

        updatedWindows[key] = {
          ...win,
          x: newX,
          y: newY,
        };
      });

      return updatedWindows;
    });
  };

  useEffect(() => {
    adjustWindowPositions(); // Adjust on initial load
    window.addEventListener('resize', adjustWindowPositions);

    return () => {
      window.removeEventListener('resize', adjustWindowPositions);
    };
  }, []);

  const handleTextClick = (windowKey) => {
    setWindows(prev => {
      const maxZIndex = Math.max(...Object.values(prev).map(win => win.zIndex));
      return {
        ...prev,
        [windowKey]: { ...prev[windowKey], open: true, zIndex: maxZIndex + 1 },
      };
    });
  };

  const closeWindow = (windowKey) => {
    setWindows(prev => ({
      ...prev,
      [windowKey]: { ...prev[windowKey], open: false },
    }));
  };

  const bringToFront = (windowKey) => {
    setWindows(prev => {
      const maxZIndex = Math.max(...Object.values(prev).map(win => win.zIndex));
      return {
        ...prev,
        [windowKey]: { ...prev[windowKey], zIndex: maxZIndex + 1 },
      };
    });
  };

  const updatePositionAndSize = (windowKey, x, y, width, height) => {
    setWindows(prev => ({
      ...prev,
      [windowKey]: { ...prev[windowKey], x, y, width, height },
    }));
  };

  return (
    <div className={styles.app}>
      <TopBar
        songName={currentTrack?.title || 'No Track Selected'}
        artistName={currentTrack?.artist || 'Unknown Artist'}
        albumName={currentTrack?.album || 'Unknown Album'}
        albumArt={currentTrack?.albumArt || null}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        currentTime={currentTime}
        duration={duration}
      />
      <Sidebar onTextClick={handleTextClick} />

      {windows.home.open && (
        <Window
          title="Home"
          width={windows.home.width}
          height={windows.home.height}
          x={windows.home.x}
          y={windows.home.y}
          zIndex={windows.home.zIndex}
          closeWindow={() => closeWindow('home')}
          bringToFront={() => bringToFront('home')}
          updatePositionAndSize={(x, y, width, height) => updatePositionAndSize('home', x, y, width, height)}
        >
          <Home />
        </Window>
      )}

      {windows.media.open && (
        <Window
          title="Media"
          width={windows.media.width}
          height={windows.media.height}
          x={windows.media.x}
          y={windows.media.y}
          zIndex={windows.media.zIndex}
          closeWindow={() => closeWindow('media')}
          bringToFront={() => bringToFront('media')}
          updatePositionAndSize={(x, y, width, height) => updatePositionAndSize('media', x, y, width, height)}
        >
          <MediaPlayer
            isPlaying={isPlaying}
            onPlayPause={setIsPlaying}
            onMetadataLoaded={handleMetadataLoaded}
            onTimeUpdate={handleTimeUpdate}
          />
        </Window>
      )}

      {windows.about.open && (
        <Window
          title="About"
          width={windows.about.width}
          height={windows.about.height}
          x={windows.about.x}
          y={windows.about.y}
          zIndex={windows.about.zIndex}
          closeWindow={() => closeWindow('about')}
          bringToFront={() => bringToFront('about')}
          updatePositionAndSize={(x, y, height, width) => updatePositionAndSize('about', x, y, height, width)}
        >
          <p>About content goes here.</p>
        </Window>
      )}

      {windows.visualizer.open && (
        <Window
          title="Visualizer"
          width={windows.visualizer.width}
          height={windows.visualizer.height}
          x={windows.visualizer.x}
          y={windows.visualizer.y}
          zIndex={windows.visualizer.zIndex}
          closeWindow={() => closeWindow('visualizer')}
          bringToFront={() => bringToFront('visualizer')}
          updatePositionAndSize={(x, y, height, width) => updatePositionAndSize('visualizer', x, y, height, width)}
        >
          <p>Visualizer content goes here.</p>
        </Window>
      )}

      {windows.settings.open && (
        <Window
          title="Settings"
          width={windows.settings.width}
          height={windows.settings.height}
          x={windows.settings.x}
          y={windows.settings.y}
          zIndex={windows.settings.zIndex}
          closeWindow={() => closeWindow('settings')}
          bringToFront={() => bringToFront('settings')}
          updatePositionAndSize={(x, y) => updatePositionAndSize('settings', x, y)}
        >
          <p>Settings content goes here.</p>
        </Window>
      )}
    </div>
  );
};

export default App;

