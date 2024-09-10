import { ReactP5Wrapper } from "@p5-wrapper/react";

function sketch(p) {
  let canvas;

  p.setup = () => {
    // Create a canvas with initial size.
    canvas = p.createCanvas(600, 400);
    p.background("#FF6347"); // Set the initial background color.
  };

  p.updateWithProps = (props) => {
    // Check if the canvas is initialized and props are valid.
    if (canvas && props.width && props.height) {
      p.resizeCanvas(props.width - 150, props.height - 100); // Resize based on props.
      p.background("#FF6347"); // Set the background color.
    }
  };

  p.draw = () => {
    // Draw logic here if needed.
  };
}

export const SimpleSketch = ({ width, height }) => {
  return <ReactP5Wrapper sketch={sketch} width={width} height={height} />;
};

