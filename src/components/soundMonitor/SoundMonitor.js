import { useEffect } from "react";

export default function SoundMonitor({ onVolumeChange }) {
  // const [freqArray, setFreqArray] = useState([]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(soundAllowed)
      .catch(function (err) {
        console.log("Sound not allowed: ", err);
      });

    // eslint-disable-next-line
  }, []);

  function soundAllowed(stream) {
    //source: https://stackoverflow.com/questions/33322681/checking-microphone-volume-in-javascript
    //updated deprecated value https://stackoverflow.com/questions/65447236/scriptnode-onaudioprocess-is-deprecated-any-alternative
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);

    javascriptNode.addEventListener("audioprocess", function () {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      let values = 0;

      const length = array.length; // 512

      for (let i = 0; i < length; i++) {
        values += array[i];
      }

      const average = values / length;

      // setFreqArray(Array.from(array));
      onVolumeChange(average);
      // colorPids(average);
    });
  }

  return null;
}

/*
<div>
      <svg height={40} width={"100%"}>
        <rect x={0} y={0} width={`${volume}%`} height={10} fill={"red"} />

        {freqArray.map((f, i) => (
          <rect
            key={i}
            x={i * freqBarWidth}
            y={10}
            width={(f / 100) * freqBarWidth}
            height={10}
            fill={"blue"}
          />
        ))}
      </svg>
    </div>

*/
