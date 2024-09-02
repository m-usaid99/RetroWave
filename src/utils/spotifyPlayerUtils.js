let spotifyPlayer = null;
let pollingInterval = null;
let positionInterval = null;

export const loadSpotifyPlayer = (token, onPlayerStateChange, onReady, onTimeUpdate) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      spotifyPlayer = new window.Spotify.Player({
        name: 'RetroWave',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });

      spotifyPlayer.addListener('player_state_changed', state => {
        if (state) {
          onPlayerStateChange(state);
          if (!state.paused) {
            startPositionInterval(state.duration / 1000, onPlayerStateChange, onTimeUpdate);
          } else {
            clearPositionInterval();
          }
        }
      });

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        onReady(device_id);
      });

      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      spotifyPlayer.connect().then(success => {
        if (success) {
          resolve(spotifyPlayer);
        } else {
          reject('Failed to connect to the player!');
        }
      });
    };
  });
};

// Attempt to force the device to be active without auto-playing music
export const forceActivateDevice = async (device_id, token) => {
  const response = await fetch(`https://api.spotify.com/v1/me/player`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      device_ids: [device_id],
      play: false, // Ensure playback does not start automatically
    }),
  });

  if (!response.ok) {
    console.error('Error forcing device activation:', response.status, response.statusText);
  }
};

// Polling function, updated with an attempt to force activation
export const startPollingForDevice = (deviceName, token, onDeviceActive) => {
  const poll = async () => {
    const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();

    // Log the devices received from Spotify
    console.log('Devices:', data.devices);

    const device = data.devices.find(d => d.name === deviceName && d.is_active);

    if (device) {
      onDeviceActive(device);
    } else {
      console.log(`Device ${deviceName} is not active yet.`);

      // Attempt to force activation if not yet active
      const foundDevice = data.devices.find(d => d.name === deviceName);
      if (foundDevice) {
        await forceActivateDevice(foundDevice.id, token);
      }
    }
  };

  pollingInterval = setInterval(poll, 5000); // Poll every 5 seconds
};

export const playSpotifyTrack = async (trackUri, token) => {
  console.log(trackUri, token);
  const response = await fetch(`https://api.spotify.com/v1/me/player/play`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uris: [trackUri]  // Ensure this is the correct format
    })
  });

  if (!response.ok) {
    console.error('Error playing track:', response.status, response.statusText);
  }
};

export const toggleSpotifyPlayPause = () => {
  if (spotifyPlayer) {
    return spotifyPlayer.togglePlay();
  }
  return Promise.reject('Spotify player is not initialized');
};

export const stopPollingForDevice = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

const startPositionInterval = (duration, onPlayerStateChange, onTimeUpdate) => {
  if (positionInterval) {
    clearInterval(positionInterval);
  }

  positionInterval = setInterval(() => {
    spotifyPlayer.getCurrentState().then(state => {
      if (state) {
        const position = state.position / 1000; // Convert to seconds
        onPlayerStateChange({
          ...state,
          position,
          duration
        });
        onTimeUpdate(position, duration);  // Update the current time and duration directly
      }
    });
  }, 1000); // Update every second
};


const clearPositionInterval = () => {
  if (positionInterval) {
    clearInterval(positionInterval);
    positionInterval = null;
  }
};
