import React, { useEffect, useState } from 'react';
import { SimpleSketch } from './SimpleSketch';
import useResizeObserver from 'use-resize-observer'; // For observing window resize

export const Visualizer = () => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Using a ref to observe the parent window size
  const { ref } = useResizeObserver({
    onResize: ({ width = 800, height = 600 }) => {
      setDimensions({ width, height });
    },
  });

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <h3>This be a visualizer</h3>
      <SimpleSketch width={dimensions.width} height={dimensions.height} />
    </div>
  );
};

