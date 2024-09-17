import React from 'react';
import { ReactP5Wrapper } from '@p5-wrapper/react';

function sketch(p) {
  let analyserNode;
  let dataArray;
  let bufferLength;
  let width = 800;
  let height = 600;

  p.setup = () => {
    p.createCanvas(width, height);
    p.noStroke();
  };

  p.updateWithProps = (props) => {
    // Update width and height if provided
    if (props.width && props.height) {
      width = props.width - 52;
      height = props.height - 100;
      p.resizeCanvas(width, height);
    }

    // Set up the analyserNode if provided
    if (props.analyserNode && props.analyserNode !== analyserNode) {
      analyserNode = props.analyserNode;
      analyserNode.fftSize = 256; // Adjust the FFT size as needed
      analyserNode.smoothingTimeConstant = 0.9; // Increase smoothing
      bufferLength = analyserNode.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }
  };

  p.draw = () => {
    p.background(255);

    if (analyserNode) {
      analyserNode.getByteFrequencyData(dataArray);

      let barWidth = (width / bufferLength) * 2.5;
      let x = 0;

      // Amplification factor
      let amplification = 0.5; // Adjust as needed

      for (let i = 0; i < bufferLength; i++) {
        let amplitude = dataArray[i];
        let normalizedValue = amplitude / 255;

        // Apply exponential scaling and amplification
        let barHeight = Math.pow(normalizedValue, 1.5) * height * amplification;

        // Ensure bar height does not exceed canvas height
        barHeight = Math.min(barHeight, height);

        p.fill(255 - amplitude, amplitude, 150);
        p.rect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    } else {
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(24);
      p.text('No Audio Data', width / 2, height / 2);
    }
  };

}

export const SimpleSketch = ({ width, height, analyserNode }) => {
  return (
    <ReactP5Wrapper
      sketch={sketch}
      width={width}
      height={height}
      analyserNode={analyserNode}
    />
  );
};

