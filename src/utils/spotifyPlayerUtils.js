// utils/spotifyPlayerUtils.js
let spotifyPlayer = null;

export const loadSpotifyPlayer = (token, onPlayerStateChange, onReady) => {
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

      // Error handling
      spotifyPlayer.addListener('initialization_error', ({ message }) => { console.error(message); });
      spotifyPlayer.addListener('authentication_error', ({ message }) => { console.error(message); });
      spotifyPlayer.addListener('account_error', ({ message }) => { console.error(message); });
      spotifyPlayer.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      spotifyPlayer.addListener('player_state_changed', state => {
        if (state) {
          onPlayerStateChange(state);
        }
      });

      // Ready
      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        onReady(device_id);
      });

      // Not Ready
      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player
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

export const playSpotifyTrack = async (trackUri, token) => {
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

