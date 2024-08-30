import styles from './TopBar.module.css';

function TopBar({ songName, artistName, albumName, albumArt, isPlaying, onPlayPause }) {
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
            <div className={styles.songName}>
              {songName}
            </div>
            <div className={styles.artistAlbum}>
              {albumName} - {artistName}
            </div>
          </div>
        </div>
        <div className={styles.timeLabel}>
          <span className={styles.startTime}>2:35</span>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} />
          </div>
          <span className={styles.endTime}>32:05</span>
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

