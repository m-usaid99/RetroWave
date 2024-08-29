/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Window from './components/Window';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import styles from './App.module.css';

const App = () => {
  const [windows, setWindows] = useState({
    home: { open: true, x: 150, y: 300, width: 400, height: 300, zIndex: 2 },
    media: { open: true, x: 425, y: 200, width: 450, height: 300, zIndex: 1 },
    about: { open: false, x: 950, y: 600, width: 350, height: 200, zIndex: 0 },
    visualizer: { open: true, x: 375, y: 125, width: 800, height: 600, zIndex: 0 },
    settings: { open: false, x: 800, y: 100, width: 300, height: 200, zIndex: 0 },
  });
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
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

  const updatePosition = (windowKey, x, y) => {
    setWindows(prev => ({
      ...prev,
      [windowKey]: { ...prev[windowKey], x, y },
    }));
  };

  return (
    <div className={styles.app}>
      <TopBar
        songName="Bring The Sun"
        artistName="Swans"
        albumName="To Be Kind"
        elapsedTime="00:42"
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
      />
      <Sidebar onTextClick={handleTextClick} />
      {Object.keys(windows).map(key => (
        windows[key].open && (
          <Window
            key={key}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            width={windows[key].width}
            height={windows[key].height}
            x={windows[key].x}
            y={windows[key].y}
            zIndex={windows[key].zIndex}
            closeWindow={() => closeWindow(key)}
            bringToFront={() => bringToFront(key)}
            updatePosition={(x, y) => updatePosition(key, x, y)}
          >
            <p>{`${key.charAt(0).toUpperCase() + key.slice(1)} content goes here.`}</p>
          </Window>
        )
      ))}
    </div>
  );
};

export default App;

