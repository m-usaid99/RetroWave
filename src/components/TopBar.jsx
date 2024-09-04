import { useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import styles from './TopBar.module.css';

function TopBar({ songName, artistName, albumName, albumArt, isPlaying, onPlayPause, currentTime, duration, onSeek }) {
  const songNameRef = useRef(null);
  const artistAlbumRef = useRef(null);
  const progressBarRef = useRef(null);

  const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect if the user is on mobile

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercentage = (currentTime / duration) * 100;

  useEffect(() => {
    const applyMarquee = (element) => {
      if (element.scrollWidth > element.clientWidth) {
        element.classList.add(styles.marqueeAnimation);
      } else {
        element.classList.remove(styles.marqueeAnimation);
      }
    };

    applyMarquee(songNameRef.current);
    applyMarquee(artistAlbumRef.current);
  }, [songName, artistName, albumName]);

  const handleProgressBarClick = (event) => {
    if (!duration) return;

    const progressBarRect = progressBarRef.current.getBoundingClientRect();
    const clickX = event.clientX - progressBarRect.left;
    const progressBarWidth = progressBarRect.width;
    const newTime = (clickX / progressBarWidth) * duration;

    onSeek(newTime);
  };

  // Desktop JSX
  const renderDesktop = () => (
    <div className={styles.topBar}>
      <div className={styles.playPauseBlock} onClick={onPlayPause}>
        <span className={styles.playPauseIcon}>{isPlaying ? '❚❚' : '►'}</span>
      </div>
      <div className={styles.songInfoBlock}>
        <div className={styles.songDetailsContainer}>
          {albumArt && <img className={styles.albumArt} src={albumArt} alt="album art" />}
          <div className={styles.songDetails}>
            <div ref={songNameRef} className={styles.marquee}>
              <div className={styles.songName}>{songName}</div>
            </div>
            <div ref={artistAlbumRef} className={styles.marquee}>
              <div className={styles.artistAlbum}>{albumName} - {artistName}</div>
            </div>
          </div>
        </div>
        <div className={styles.timeLabel}>
          <span className={styles.startTime}>{formatTime(currentTime)}</span>
          <div className={styles.progressBarContainer} ref={progressBarRef} onClick={handleProgressBarClick}>
            <div className={styles.progressBar} style={{ width: `${progressPercentage}%` }} />
          </div>
          <span className={styles.endTime}>{formatTime(duration)}</span>
        </div>
      </div>
      <div className={styles.githubButton}>
        <img className={styles.githubIcon} src="https://i.imgur.com/zIQbezh.png" alt="lastfm" />
      </div>
      <div className={styles.githubButton}>
        <img className={styles.githubIcon} src="https://unpkg.com/pixelarticons@1.8.1/svg/github.svg" alt="GitHub" />
      </div>
    </div>
  );

  // Mobile JSX
  const renderMobile = () => (
    <div className={styles.topBar}>
      <div className={styles.songInfoBlock}>
        {albumArt && <img className={styles.albumArt} src={albumArt} alt="album art" />}
        <div className={styles.songDetails}>
          <div ref={songNameRef} className={styles.marquee}>
            <div className={styles.songName}>{songName}</div>
          </div>
          <div ref={artistAlbumRef} className={styles.marquee}>
            <div className={styles.artistAlbum}>{albumName} - {artistName}</div>
          </div>
        </div>
      </div>

      <div className={styles.buttonAndProgressMobile}>
        <div className={styles.playPauseBlock} onClick={onPlayPause}>
          <span className={styles.playPauseIcon}>{isPlaying ? '❚❚' : '►'}</span>
        </div>
        <span className={styles.startTime}>{formatTime(currentTime)}</span>
        <div className={styles.progressBarContainer} ref={progressBarRef} onClick={handleProgressBarClick}>
          <div className={styles.progressBar} style={{ width: `${progressPercentage}%` }} />
        </div>
        <span className={styles.endTime}>{formatTime(duration)}</span>
      </div>
    </div>
  );

  return isMobile ? renderMobile() : renderDesktop();
}

export default TopBar;

