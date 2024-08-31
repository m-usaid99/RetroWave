import { useRef } from 'react';
import styles from './TopBar.module.css';

function TopBar({ songName, artistName, albumName, albumArt, isPlaying, onPlayPause, currentTime, duration }) {
  const songNameRef = useRef(null);
  const artistAlbumRef = useRef(null);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercentage = (currentTime / duration) * 100;
  return (
    <div className={styles.topBar}>
      <div className={styles.playPauseBlock} onClick={onPlayPause}>
        <span className={styles.playPauseIcon}>
          {isPlaying ? '❚❚' : '►'}
        </span>
      </div>
      <div className={styles.songInfoBlock}>
        <div className={styles.songDetailsContainer}>

          {albumArt && (
            <img className={styles.albumArt} src={albumArt} alt="album art" />
          )}
          <div className={styles.songDetails}>
            <div className={styles.songName} ref={songNameRef}>
              {songName}
            </div>
            <div className={styles.artistAlbum} ref={artistAlbumRef}>
              {albumName} - {artistName}
            </div>
          </div>
        </div>
        <div className={styles.timeLabel}>
          <span className={styles.startTime}>{formatTime(currentTime)}</span>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${progressPercentage}%` }} />          </div>
          <span className={styles.endTime}>{formatTime(duration)}</span>
        </div>
      </div>
      <div className={styles.githubButton}>
        <img className={styles.githubIcon} src="https://i.imgur.com/zIQbezh.png" alt="lastfm" />
      </div>
      <div className={styles.githubButton}>
        <img className={styles.githubIcon} src="https://unpkg.com/pixelarticons@1.8.1/svg/github.svg" alt="GitHub" />
      </div>
    </div >
  );
}

export default TopBar;

