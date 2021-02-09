import React, { useEffect, useState } from "react";
import { drawCanvasToCanvas, drawStretchCanvas } from "../../helpers/helpers";

export default function Artwork({ sourceImg, frameCount }) {
  const [doDoubleScan, setDoDoubleScan] = useState(true);
  const experimentCanvasRef = React.useRef(null);

  useEffect(() => {
    if (!sourceImg || !experimentCanvasRef) return;

    const expDisplayCanvas = experimentCanvasRef.current;

    const stretchProps = {
      sourceCanvas: sourceImg,
      targStretchW: 300,
      targStretchH: 300,
      srcStretchW: 100,
      srcStretchH: 100,
    };

    const stretchCanvas = drawStretchCanvas(stretchProps);
    drawCanvasToCanvas(
      stretchCanvas,
      expDisplayCanvas,
      1024,
      768,
      doDoubleScan
    );

    // eslint-disable-next-line
  }, [sourceImg, frameCount]);

  // const setVolume = (vol) => {
  //   console.log('vol: ', vol)
  // };

  return (
    <div onClick={() => setDoDoubleScan(!doDoubleScan)}>
      <canvas ref={experimentCanvasRef} />
    </div>
  );
}
