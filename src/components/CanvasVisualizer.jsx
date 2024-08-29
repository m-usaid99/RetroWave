import { ReactP5Wrapper } from 'react-p5-wrapper';
import styles from './CanvasVisualizer.module.css';

const CanvasVisualizer = () => {
  const sketch = (p5) => {
    p5.setup = () => {
      p5.createCanvas(window.innerWidth, window.innerHeight);
    };

    p5.draw = () => {
      p5.background(0);
      p5.fill(255);
      p5.ellipse(p5.width / 2, p5.height / 2, 100, 100);
    };
  };

  return <ReactP5Wrapper sketch={sketch} className={styles.canvas} />;
};

export default CanvasVisualizer;

