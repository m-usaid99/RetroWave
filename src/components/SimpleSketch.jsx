import React from 'react';
import { ReactP5Wrapper } from '@p5-wrapper/react';

function sketch(p) {
  let analyserNode;
  let dataArray;
  let bufferLength;
  let width = 800;
  let height = 600;

  const borderSize = 2; // Border size (adjust as needed)

  p.setup = () => {
    p.createCanvas(width, height);
    p.noStroke();
  };

  p.updateWithProps = (props) => {
    // Update width and height if provided
    if (props.width && props.height) {
      width = props.width - 50;
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
    p.clear(); // Clear the canvas

    // Draw the background rectangle with border and shadow
    p.push();
    let ctx = p.drawingContext;

    // Set shadow properties to mimic the CSS box-shadow
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 5; // Adjust the blur radius as needed
    ctx.shadowColor = 'rgba(64, 64, 64, 1)'; // Adjust the color and opacity

    // Set border properties
    p.stroke('#A0A0A0'); // Border color (same as your CSS)
    p.strokeWeight(borderSize); // Border size

    // Draw the rectangle slightly smaller than the canvas to show the shadow
    p.fill(255); // Background color (white)
    p.rect(
      borderSize / 2,
      borderSize / 2,
      width - borderSize,
      height - borderSize
    );

    p.pop();

    // Adjust visualization area to fit within the border
    let visX = borderSize;
    let visY = borderSize;
    let visWidth = width - 2 * borderSize;
    let visHeight = height - 2 * borderSize;

    if (analyserNode) {
      analyserNode.getByteFrequencyData(dataArray);

      let barWidth = (visWidth / bufferLength) * 2.5;
      let x = visX;

      // Amplification factor
      let amplification = 0.75; // Adjust as needed

      for (let i = 0; i < bufferLength; i++) {
        let amplitude = dataArray[i];
        let normalizedValue = amplitude / 255;

        // Apply exponential scaling and amplification
        let barHeight = Math.pow(normalizedValue, 1.5) * visHeight * amplification;

        // Ensure bar height does not exceed visualization area height
        barHeight = Math.min(barHeight, visHeight);

        p.fill(255 - amplitude, amplitude, 150);
        p.rect(
          x,
          visY + visHeight - barHeight,
          barWidth,
          barHeight
        );

        x += barWidth + 1;
      }
    } else {
      p.fill(0);
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

