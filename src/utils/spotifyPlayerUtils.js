let player = null;

export const loadSpotifyPlayer = (token, onPlayerStateChange, onReady) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      player = new window.Spotify.Player({
        name: 'RetroWave',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      player.addListener('player_state_changed', state => {
        if (state) {
          onPlayerStateChange(state);
        }
      });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        onReady(device_id);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player
      player.connect().then(success => {
        if (success) {
          resolve(player);
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
      uris: [trackUri]
    })
  });

  if (!response.ok) {
    console.error('Error playing track:', response.status, response.statusText);
  }
};


