import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive'; // For mobile detection
import Window from './components/Window';
import WindowMobile from './components/WindowMobile'; // Mobile specific component
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import styles from './App.module.css';
import { Home } from './components/Home';
import { toggleSpotifyPlayPause } from './utils/spotifyPlayerUtils';
import MediaPlayer from './components/MediaPlayer';

const App = () => {
  const [windows, setWindows] = useState({
    home: { open: true, minimized: false, x: 150, y: 300, width: 400, height: 300, zIndex: 2 },
    media: { open: true, minimized: false, x: 425, y: 200, width: 600, height: 450, zIndex: 1 },
    about: { open: false, minimized: false, x: 950, y: 600, width: 350, height: 200, zIndex: 0 },
    visualizer: { open: true, minimized: false, x: 375, y: 125, width: 800, height: 600, zIndex: 0 },
    settings: { open: false, minimized: false, x: 800, y: 100, width: 300, height: 200, zIndex: 0 },
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
  const [spotifyPlayer, setSpotifyPlayer] = useState(null);
  const [seekTime, setSeekTime] = useState(null);

  const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile layout

  const handlePlayPause = () => {
    if (spotifyPlayer) {
      toggleSpotifyPlayPause()
        .then(() => {
          setIsPlaying(!isPlaying);
        })
        .catch(err => {
          console.error('Failed to toggle Spotify playback:', err);
        });
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = (current, total) => {
    setCurrentTime(current);
    setDuration(total);
  };

  const handleMetadataLoaded = metadata => {
    setCurrentTrack(metadata);
    if (metadata && metadata.duration) {
      setDuration(metadata.duration);
    } else {
      setDuration(0); // Set to 0 if duration is not available
    }
  };

  const handleSeek = newTime => {
    setSeekTime(newTime);
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

        if (win.x + win.width > screenWidth) {
          newX = screenWidth - win.width - 10;
        } else if (win.x < 0) {
          newX = 10;
        }

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
      console.log(windowKey);
      const maxZIndex = Math.max(...Object.values(prev).map(win => win.zIndex));
      return {
        ...prev,
        [windowKey]: {
          ...prev[windowKey],
          open: true, // Ensure the window is open
          minimized: false, // Ensure the window is not minimized
          zIndex: maxZIndex + 1, // Bring to front by increasing zIndex
        },
      };
    });
  };

  const closeWindow = windowKey => {
    // Special case for media player: Minimize instead of closing on mobile
    if (windowKey === 'media') {
      minimizeWindow(windowKey);
    } else {
      setWindows(prev => ({
        ...prev,
        [windowKey]: { ...prev[windowKey], open: false },
      }));
    }
  };

  const minimizeWindow = (windowKey) => {
    setWindows(prev => ({
      ...prev,
      [windowKey]: { ...prev[windowKey], minimized: true, zIndex: -1 },
    }));
  };

  const bringToFront = windowKey => {
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


  // Helper function to handle conditional rendering
  const renderWindow = (windowKey, content, title = windowKey) => {
    if (!windows[windowKey].open) return null; // If window is closed, return nothing

    const isMinimized = windows[windowKey].minimized;
    const isActive = windows[windowKey].zIndex === Math.max(...Object.values(windows).map(win => win.zIndex));

    if (isMobile) {
      return (
        <div
          className={`window ${isMinimized ? 'minimized' : isActive ? 'active' : ''}`}
          style={{ zIndex: windows[windowKey].zIndex }}
        >
          <WindowMobile
            title={title}
            closeWindow={() => closeWindow(windowKey)}
          >
            {content}
          </WindowMobile>
        </div>
      );
    } else {
      return (
        <Window
          title={title}
          width={windows[windowKey].width}
          height={windows[windowKey].height}
          x={windows[windowKey].x}
          y={windows[windowKey].y}
          zIndex={windows[windowKey].zIndex}
          closeWindow={() => closeWindow(windowKey)}
          bringToFront={() => bringToFront(windowKey)}
          updatePositionAndSize={(x, y, width, height) => updatePositionAndSize(windowKey, x, y, width, height)}
        >
          {content}
        </Window>
      );
    }
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
        onSeek={handleSeek}
      />
      <Sidebar onTextClick={handleTextClick} />

      {/* Render windows conditionally based on device */}
      {renderWindow('home', <Home />, 'Home')}
      {renderWindow(
        'media',
        <MediaPlayer
          isPlaying={isPlaying}
          onPlayPause={setIsPlaying}
          onMetadataLoaded={handleMetadataLoaded}
          onTimeUpdate={handleTimeUpdate}
          setSpotifyPlayer={setSpotifyPlayer}
          seekTime={seekTime} />,
        'MediaPlayer'
      )}
      {renderWindow('about', <p>About content goes here</p>)}
      {renderWindow('visualizer', <p>Visualizer content goes here</p>)}
      {renderWindow('settings', <p>Settings content goes here</p>)}
    </div>
  );
};

export default App;
