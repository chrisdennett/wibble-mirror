import React, { useEffect, useState } from "react";
import {
  drawCanvasToCanvas,
  drawStretchCanvas,
  getRandomColAndRowFractions,
} from "../../helpers/helpers";

export default function Artwork({ sourceImg, frameCount }) {
  const [randomSizes, setRandomSizes] = useState(null);
  const [doDoubleScan, setDoDoubleScan] = useState(true);
  const experimentCanvasRef = React.useRef(null);

  useEffect(() => {
    if (!randomSizes) {
      setRandomSizes(getRandomColAndRowFractions(5, 5));
    }
  }, [randomSizes]);

  useEffect(() => {
    if (!sourceImg || !experimentCanvasRef || !randomSizes) return;

    const expDisplayCanvas = experimentCanvasRef.current;

    const stretchProps = {
      sourceCanvas: sourceImg,
      targStretchW: 300,
      targStretchH: 300,
      srcStretchW: 100,
      srcStretchH: 100,
      randomSizes,
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
  }, [sourceImg, frameCount, randomSizes]);

  // const setVolume = (vol) => {
  //   console.log('vol: ', vol)
  // };

  return (
    <div onClick={() => setDoDoubleScan(!doDoubleScan)}>
      <canvas ref={experimentCanvasRef} />
    </div>
  );
}
