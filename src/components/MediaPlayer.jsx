import React, { useState, useRef, useEffect } from 'react';
import * as mm from 'music-metadata';
import { getSpotifyAuthorizationUrl, fetchSpotifyToken, searchSpotify } from '../utils/spotifyUtils';
import {
  loadSpotifyPlayer,
  playSpotifyTrack,
  startPollingForDevice,
  stopPollingForDevice,
  setSpotifyVolume,
  seekSpotifyTrack
}
  from '../utils/spotifyPlayerUtils';
import styles from './MediaPlayer.module.css';

const MediaPlayer = ({ isPlaying, onPlayPause, onMetadataLoaded, onTimeUpdate, setSpotifyPlayer, seekTime }) => {
  const [selectedSource, setSelectedSource] = useState('local'); // Default to Local Files
  const [trackList, setTrackList] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('No file chosen');
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  const handleSourceChange = (event) => {
    setSelectedSource(event.target.value);
    setTrackList([]); // Clear track list when source changes
    setCurrentTrackIndex(null);
    onMetadataLoaded(null); // Clear metadata display
  };

  const handleSpotifyLogin = () => {
    localStorage.setItem('selectedSource', 'spotify');
    window.location.href = getSpotifyAuthorizationUrl(); // Redirect to Spotify's authorization page
  };


  useEffect(() => {
    if (selectedSource === 'spotify') {
      setIsLoading(true);
      const fetchTokenAndLoadPlayer = async () => {
        const token = await fetchSpotifyToken();
        if (token) {
          setSpotifyToken(token);
          loadSpotifyPlayer(
            token,
            (state) => {
              onTimeUpdate(state.position / 1000, state.duration / 1000);
              onPlayPause(!state.paused);
            },
            (playerInstance) => {
              setSpotifyPlayer(playerInstance);
            },
            onTimeUpdate
          );

          startPollingForDevice('RetroWave', token, (device) => {
            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      };
      fetchTokenAndLoadPlayer();
    }

    return () => {
      stopPollingForDevice();
    };
  }, [selectedSource]);

  const handleSearch = async () => {
    if (spotifyToken && searchQuery) {
      const results = await searchSpotify(searchQuery, 'track', spotifyToken);
      if (results && results.tracks) {
        setSearchResults(results.tracks.items);
      }
    }
  };

  const handleSpotifyTrackSelect = (track) => {
    // Convert duration from milliseconds to seconds
    const durationInSeconds = track.duration_ms / 1000;

    // Passing the selected track metadata to the parent component (App.jsx)
    onMetadataLoaded({
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      albumArt: track.album.images[0]?.url || null,
      url: `https://open.spotify.com/track/${track.id}`, // Spotify track URL for reference
      duration: durationInSeconds, // Add the duration in seconds
    });
    playSpotifyTrack(`spotify:track:${track.id}`, spotifyToken);

    setSearchResults([]); // Clear search results after selection
    setCurrentTrackIndex(null); // Reset current track index
    onPlayPause(true); // Start playback
  };


  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    const newTracks = [];

    for (const file of files) {
      const url = URL.createObjectURL(file);
      setSelectedFileName(file.name); // Update state with the selected file name

      try {
        const metadata = await mm.parseBlob(file);
        const { title, artist, album, picture } = metadata.common;

        let albumArt = null;
        if (picture && picture.length > 0) {
          const imageUrl = URL.createObjectURL(new Blob([picture[0].data]));
          albumArt = imageUrl;
        }

        newTracks.push({
          name: title || file.name,
          artist: artist || 'Unknown Artist',
          album: album || 'Unknown Album',
          albumArt: albumArt || null, // Use a default image if no album art
          url: url,
        });
      } catch (error) {
        console.error('Error parsing metadata:', error);
        newTracks.push({
          name: file.name,
          artist: 'Unknown Artist',
          album: 'Unknown Album',
          albumArt: null,
          url: url,
        });
      }
    }

    setTrackList(prevList => [...prevList, ...newTracks]);
    onPlayPause(false); // Pause playback when new files are uploaded
  };


  const handleRemoveTrack = (index) => {
    setTrackList(prevList => prevList.filter((_, i) => i !== index));
    if (currentTrackIndex === index) {
      setCurrentTrackIndex(null);
      onMetadataLoaded(null);
    } else if (currentTrackIndex > index) {
      setCurrentTrackIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleTrackSelect = (index) => {
    setCurrentTrackIndex(index);
    onPlayPause(false); // Pause current playback
    const track = trackList[index];
    onMetadataLoaded({
      title: track.name,
      artist: track.artist,
      album: track.album,
      albumArt: track.albumArt,
    });
  };

  const handleVolumeChange = (event) => {
    const volume = event.target.value / 100; // Convert to 0-1 range
    if (selectedSource === 'spotify') {
      setSpotifyVolume(volume);
    } else if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  // Handle seeking to the new time when `seekTime` changes
  useEffect(() => {
    if (seekTime !== null) {
      if (selectedSource === 'spotify') {
        seekSpotifyTrack(seekTime);
      } else if (audioRef.current) {
        audioRef.current.currentTime = seekTime;  // Set the audio's current time to the new seek time
      }
    }
  }, [seekTime]);  // Only run when seekTime changes

  useEffect(() => {
    if (audioRef.current && currentTrackIndex !== null) {
      audioRef.current.src = trackList[currentTrackIndex].url;
      audioRef.current.play();
      onPlayPause(true); // Auto-play when a new track is selected
    }
  }, [currentTrackIndex]); // Trigger only when the track changes

  useEffect(() => {
    if (audioRef.current && currentTrackIndex !== null) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Time update logic
  useEffect(() => {
    if (audioRef.current) {
      const updateTime = () => {
        onTimeUpdate(audioRef.current.currentTime, audioRef.current.duration);
      };
      audioRef.current.addEventListener('timeupdate', updateTime);
      audioRef.current.addEventListener('loadedmetadata', updateTime);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateTime);
          audioRef.current.removeEventListener('loadedmetadata', updateTime);
        }
      };
    }
  }, [onTimeUpdate]);

  return (
    <div className={styles.mediaPlayer}>
      <div className={styles.header}>
        <label htmlFor="sourceSelect">Select Source:</label>
        <select id="sourceSelect" value={selectedSource} onChange={handleSourceChange}>
          <option value="local">Local Files</option>
          <option value="spotify">Spotify</option>
        </select>
      </div>

      {selectedSource === 'local' && (
        <div className={styles.fileUploadSection}>
          <label className={styles.customFileUpload}>
            Choose Files
            <input type="file" accept="audio/*" multiple onChange={handleFileUpload} />
          </label>
          <span className={styles.fileName}>{selectedFileName}</span>
        </div>
      )}

      {selectedSource === 'spotify' && (
        <div className={styles.spotifySection}>
          {!spotifyToken ? (
            <button onClick={handleSpotifyLogin}>Login to Spotify</button>
          ) : (
            <p>Spotify token acquired. Ready to play music!</p>
          )}
        </div>
      )}

      {selectedSource === 'spotify' && spotifyToken && (
        <div className={styles.searchSection}>
          <div className={styles.searchInputWrapper}>
            <label className={styles.customSearchLabel}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Spotify"
                className={styles.searchInput}
              />
            </label>
            <button onClick={handleSearch} className={styles.searchButton}>Search</button>
          </div>

          {searchResults.length > 0 && (
            <ul className={styles.searchResults}>
              {searchResults.map((track) => (
                <li key={track.id} onClick={() => handleSpotifyTrackSelect(track)}>
                  {track.name} - {track.artists.map(artist => artist.name).join(', ')}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {trackList.length > 0 && (
        <div className={styles.trackList}>
          <ul>
            {trackList.map((track, index) => (
              <li key={index} className={currentTrackIndex === index ? styles.activeTrack : ''}>
                <span onClick={() => handleTrackSelect(index)}>
                  {track.name} - {track.artist} ({track.album})
                </span>
                <button onClick={() => handleRemoveTrack(index)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.volumeControl}>
        <label htmlFor="volume">Volume:</label>
        <input type="range" id="volume" name="volume" min="0" max="100" onChange={handleVolumeChange} />
      </div>

      {currentTrackIndex !== null && (
        <audio ref={audioRef} controls={false} />
      )}
    </div>
  );
};

export default MediaPlayer;

