import React, { useEffect, useState } from "react";
import styles from "./artwork.module.css";
import {
  drawCanvasToCanvas,
  createStretchCanvas,
  getTargCells,
  getSourceCells,
  getRandomColAndRowSizes,
  getNextColAndRowSizes,
} from "../../helpers/helpers";

const cols = 20;
const rows = 20;
const min = 0.2; // smallest fraction of source size
const max = 3.0; // largest fraction of source size
const incSize = 0.8; // smaller = slower

export default function Artwork({ sourceImg, frameCount, animationTimer }) {
  const [targColAndRowSizes, setTargColsAndRowSizes] = useState(null);
  const [srcCells, setSrcCells] = useState(null);
  const [doDoubleScan, setDoDoubleScan] = useState(true);
  const experimentCanvasRef = React.useRef(null);

  useEffect(() => {
    if (!sourceImg) return;

    // Set starting col and row sizes
    if (!srcCells) {
      const { width, height } = sourceImg;
      const cellSize = {
        w: Math.round(width / cols),
        h: Math.round(height / rows),
      };

      setSrcCells(getSourceCells(cellSize, cols, rows));

      const init = getRandomColAndRowSizes({
        cellSize,
        cols,
        rows,
        incSize,
        min,
        max,
      });

      setTargColsAndRowSizes(init);
    } else {
      setTargColsAndRowSizes(getNextColAndRowSizes(targColAndRowSizes));
    }

    // eslint-disable-next-line
  }, [animationTimer]);

  useEffect(() => {
    if (!sourceImg || !experimentCanvasRef || !srcCells || !targColAndRowSizes)
      return;

    const expDisplayCanvas = experimentCanvasRef.current;

    let targCanvasWidth = 0;
    for (let wData of targColAndRowSizes.colWidths) {
      targCanvasWidth += wData.w;
    }
    let targCanvasHeight = 0;
    for (let hData of targColAndRowSizes.rowHeights) {
      targCanvasHeight += hData.h;
    }

    const targCells = getTargCells(targColAndRowSizes);

    const stretchCanvas = createStretchCanvas({
      sourceCanvas: sourceImg,
      srcCells,
      targCells,
      canvasW: parseInt(targCanvasWidth, 0),
      canvasH: parseInt(targCanvasHeight, 0),
    });

    drawCanvasToCanvas(
      stretchCanvas,
      expDisplayCanvas,
      1024,
      768,
      doDoubleScan
    );

    // eslint-disable-next-line
  }, [frameCount]);

  return (
    <div
      className={styles.artwork}
      onClick={() => setDoDoubleScan(!doDoubleScan)}
    >
      <canvas ref={experimentCanvasRef} />
    </div>
  );
}
