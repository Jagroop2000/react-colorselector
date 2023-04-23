import * as React from 'react';

// Props that user can pass alter  
interface Props {
  image: string;
  width?: number;
  height?: number;
  className?: string;
  onChange?: (color: string, eventType: string) => unknown;
}

const ColorSelector: React.FC<Props> = ({
  image,
  width = 200,
  height = 200,
  className = 'react-colorselector',
  onChange = () => undefined
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null); // Ref for the canvas element

  // Draws the image on the canvas element
  const drawImage = React.useCallback(() => {
    const imageElement = new Image();
    imageElement.crossOrigin = 'Anonymous';

    imageElement.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      context.drawImage(imageElement, 0, 0, width, height);
    };

    imageElement.src = image;
  }, [image, width, height]);

  // Gets the color data at a given point on the canvas
  const getColorData = React.useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const { left, top } = canvas.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const [r, g, b] = context.getImageData(x, y, 1, 1).data;
    return `#${(b + 256 * g + 65536 * r).toString(16)}`; // Returns color in hex format
  }, []);

  // Updates the state with the selected color
  const setColor = React.useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const color = getColorData(e);
      if (!color) return;

      onChange(color, e.type);
    },
    [onChange, getColorData]
  );

  // Draws the image when the component mounts
  React.useEffect(() => {
    drawImage();
  }, [drawImage]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      onClick={setColor}
      onMouseMove={setColor}
    />
  );
};

export default ColorSelector;
