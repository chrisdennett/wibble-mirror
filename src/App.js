import React, { useEffect, useState } from "react";
import { WebcamCapture } from "./components/webcamCapture/WebcamCapture";
import Artwork from "./components/artwork/Artwork";

const min = 0.5;
const max = 1.5;
const diff = max - min;

const App = () => {
  const [frameCount, setFrameCount] = useState(0);
  const [animationTimer, setAnimationTimer] = useState({
    tick: 0,
    oscillation: 0,
    min,
    max,
  });
  const [sourceImg, setSourceImg] = useState(null);

  useEffect(() => {
    // if (frameCount % 1 === 0) {
    setAnimationTimer((prev) => {
      const newTick = prev.tick + 0.01;
      const newOscillation = (1 + Math.sin(newTick)) / 2;
      const currFrac = min + diff * newOscillation;

      return {
        ...prev,
        tick: newTick,
        oscillation: currFrac,
      };
    });
    // }
    // eslint-disable-next-line
  }, [frameCount]);

  return (
    <div>
      <Artwork
        sourceImg={sourceImg}
        frameCount={frameCount}
        animationTimer={animationTimer}
      />

      <WebcamCapture
        setSourceImg={setSourceImg}
        setFrameCount={setFrameCount}
      />
    </div>
  );
};

export default App;
