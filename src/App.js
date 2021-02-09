import React, { useState } from "react";
import { WebcamCapture } from "./components/webcamCapture/WebcamCapture";
import Artwork from "./components/artwork/Artwork";

const App = () => {
  const [frameCount, setFrameCount] = useState(0);
  const [sourceImg, setSourceImg] = useState(null);

  return (
    <div>
      <Artwork sourceImg={sourceImg} frameCount={frameCount} />

      <WebcamCapture
        setSourceImg={setSourceImg}
        setFrameCount={setFrameCount}
      />
    </div>
  );
};

export default App;
