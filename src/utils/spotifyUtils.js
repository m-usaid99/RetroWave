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

  const url = `${AUTHORIZATION_ENDPOINT}?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scope)}&state=${state}`;

  return url;
};

export const handleSpotifyCallback = () => {
  const hash = window.location.hash.substring(1); // Remove the `#`
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const expiresIn = params.get('expires_in'); // Spotify provides this

  if (accessToken) {
    const expirationTime = Date.now() + (expiresIn * 1000); // Calculate expiration time
    localStorage.setItem('spotifyToken', accessToken);
    localStorage.setItem('spotifyTokenExpiry', expirationTime); // Store expiration time
    window.history.pushState({}, document.title, "/"); // Clean up the URL
    return accessToken;
  }

  return null;
};

export const isSpotifyTokenExpired = () => {
  const tokenExpiry = localStorage.getItem('spotifyTokenExpiry');
  if (!tokenExpiry) return true;
  return Date.now() > tokenExpiry;
};

export const fetchSpotifyToken = async () => {
  const token = localStorage.getItem('spotifyToken');
  const tokenExpired = isSpotifyTokenExpired();

  if (token && !tokenExpired) {
    return token;
  } else {
    const newToken = handleSpotifyCallback(); // Try to get token from URL if it's a callback
    if (newToken) {
      return newToken;
    } else {
      // Redirect to login if no valid token is found
      localStorage.removeItem('spotifyToken');
      localStorage.removeItem('spotifyTokenExpiry');
      window.location.href = getSpotifyAuthorizationUrl();
      return null;
    }
  }
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

