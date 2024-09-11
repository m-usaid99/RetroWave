import { ReactP5Wrapper } from "@p5-wrapper/react";

function sketch(p, width, height) {
  let canvas;

  p.setup = () => {
    // Create a canvas with initial size.
    canvas = p.createCanvas(800, 600);
  };

  p.updateWithProps = (props) => {
    // Check if the canvas is initialized and props are valid.
    if (canvas && props.width && props.height) {
      p.resizeCanvas(props.width - 50, props.height - 100); // Resize based on props.
      p.background("#FFF"); // Set the background color.
    }
  };

  p.draw = () => {
    // Draw logic here if needed.
    p.ellipse(250, 250, 20, 20);
  };
}

export const SimpleSketch = ({ width, height }) => {
  return <ReactP5Wrapper sketch={sketch} width={width} height={height} />;
};

