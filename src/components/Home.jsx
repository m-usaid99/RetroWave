import styles from './Home.module.css';

export const Home = () => {
  return (
    <div className={styles.content}>
      <h2>Welcome to Retrowave!</h2>
      <p>Step into a world where sound meets vision. Here at Retrowave, you’ll experience your music
        in a whole new way. Whether you're uploading your favorite tracks or connecting directly to Spotify,
        this platform is designed to turn every beat into a visual masterpiece.</p>
      <p>Explore the Media Player to choose your music source, dive into the Visualizer to see your sound come alive, and customize your experience to make it truly yours.</p>
      <p>This is more than just a music player—it's a journey through your soundscape.</p>
    </div>
  )
}
