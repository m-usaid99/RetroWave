// utils/spotifyUtils.js

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const SCOPES = import.meta.env.VITE_SPOTIFY_SCOPES.split(' ');
const AUTHORIZATION_ENDPOINT = 'https://accounts.spotify.com/authorize';

export const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const getSpotifyAuthorizationUrl = () => {
  const state = generateRandomString(16);
  const scope = SCOPES.join(' ');

  const url = `${AUTHORIZATION_ENDPOINT}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scope)}&state=${state}`;

  return url;
};

export const handleSpotifyCallback = async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (code) {
    // Exchange code for access token
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + import.meta.env.VITE_SPOTIFY_CLIENT_SECRET),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await response.json();
    window.history.pushState({}, document.title, "/"); // Clean up the URL
    return data.access_token;
  }

  return null;
};


export const searchSpotify = async (query, type, token) => {
  const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=10`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Spotify API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return null;
  }
};
