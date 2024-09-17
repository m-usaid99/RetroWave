import React, { useState } from 'react';
import { SimpleSketch } from './SimpleSketch';
import useResizeObserver from 'use-resize-observer'; // For observing window resize
import styles from './Visualizer.module.css';

export const Visualizer = ({ analyserNode }) => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Using a ref to observe the parent window size
  const { ref } = useResizeObserver({
    onResize: ({ width = 800, height = 600 }) => {
      setDimensions({ width, height });
    },
  });

  return (
    <div ref={ref} className={styles.content}>
      <h3>This be a visualizer</h3>
      <div className={styles.sketch}>
        <SimpleSketch
          width={dimensions.width}
          height={dimensions.height}
          analyserNode={analyserNode}
        />
      </div>
    </div>
  );
};

