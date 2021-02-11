import React, { useEffect, useState } from "react";
import { WebcamCapture } from "./components/webcamCapture/WebcamCapture";
import Artwork from "./components/artwork/Artwork";

const App = () => {
  const [frameCount, setFrameCount] = useState(0);
  const [animationTimer, setAnimationTimer] = useState(0);
  const [sourceImg, setSourceImg] = useState(null);

  useEffect(() => {
    // if (frameCount % 1 === 0) {
    setAnimationTimer((prev) => prev + 0.01);
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
