export function createSizedCanvas(sourceImg, w) {
  const outCanvas = document.createElement("canvas");
  const wToHratio = w / sourceImg.width;
  const h = wToHratio * sourceImg.height;

  outCanvas.width = w;
  outCanvas.height = h;
  const ctx = outCanvas.getContext("2d");
  ctx.drawImage(sourceImg, 0, 0, sourceImg.width, sourceImg.height, 0, 0, w, h);

  return outCanvas;
}

export const drawCanvasToCanvas = (
  srcCanvas,
  targCanvas,
  targW = 1024,
  targH = 768,
  doDoubleScan = true
) => {
  targCanvas.width = targW;
  targCanvas.height = targH;

  const ctx = targCanvas.getContext("2d");
  ctx.drawImage(
    srcCanvas,
    0,
    0,
    srcCanvas.width,
    srcCanvas.height,
    0,
    0,
    targCanvas.width,
    targCanvas.height
  );

  if (doDoubleScan) {
    ctx.globalAlpha = 0.5;
    ctx.globalCompositeOperation = "overlay";
    ctx.drawImage(
      srcCanvas,
      0,
      0,
      srcCanvas.width,
      srcCanvas.height,
      0,
      0,
      targCanvas.width,
      targCanvas.height
    );
  }
};

export function drawStretchCanvas({
  sourceCanvas,
  targStretchW = 300,
  targStretchH = 300,
  srcStretchW = 100,
  srcStretchH = 100,
  randomSizes,
  rows = 5,
  cols = 5,
}) {
  const outCanvas = document.createElement("canvas");
  const { width: srcW, height: srcH } = sourceCanvas;

  outCanvas.width = srcW + targStretchW - srcStretchW;
  outCanvas.height = srcH + targStretchH - srcStretchH;

  const ctx = outCanvas.getContext("2d");

  const { rowHeights, colWidths } = randomSizes;

  const srcData = getSrcData(srcW, srcH, cols, rows);
  const targData = getTargData(srcW, srcH, rowHeights, colWidths);

  // draw middle middle stretch
  for (let i = 0; i < srcData.length; i++) {
    drawSegment(sourceCanvas, ctx, srcData[i], targData[i]);
  }

  return outCanvas;
}

function getSrcData(w, h, cols, rows) {
  const data = [];

  // add x, y, w, h for each segment
  const cellWidth = w / cols;
  const cellHeight = h / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      data.push({
        x: c * (cellWidth + 1),
        y: r * (cellHeight + 2),
        w: cellWidth,
        h: cellHeight,
      });
    }
  }

  return data;
}

export function getRandomColAndRowFractions(cols, rows) {
  const rowHeights = [];
  const colWidths = [];

  const minHeight = 0.3;
  const maxHeight = 1.5;

  const minWidth = 0.2;
  const maxWidth = 2;

  for (let r = 0; r < rows; r++) {
    rowHeights.push(getConstrainedRandom(minHeight, maxHeight));
  }

  for (let c = 0; c < cols; c++) {
    colWidths.push(getConstrainedRandom(minWidth, maxWidth));
  }

  return { rowHeights, colWidths };
}

function getConstrainedRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function getTargData(w, h, colWidths, rowHeights) {
  const data = [];

  const cols = colWidths.length;
  const rows = rowHeights.length;

  // add x, y, w, h for each segment
  const srcCellWidth = w / cols;
  const srcCellHeight = h / rows;

  let yPos = 0;
  for (let r = 0; r < rows; r++) {
    let height = rowHeights[r] * srcCellHeight;

    let xPos = 0;
    for (let c = 0; c < cols; c++) {
      let width = colWidths[c] * srcCellWidth;
      data.push({
        x: xPos,
        y: yPos,
        w: width,
        h: height,
      });

      xPos += width;
    }

    yPos += height;
  }

  return data;
}

function drawSegment(img, ctx, src, targ) {
  ctx.drawImage(
    img,
    src.x,
    src.y,
    src.w,
    src.h,
    targ.x,
    targ.y,
    targ.w,
    targ.h
  );
}

export const createInkCanvas = (inputCanvas) => {
  if (!inputCanvas) return;

  const { width: inputW, height: inputH } = inputCanvas;
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = inputW;
  tempCanvas.height = inputH;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(inputCanvas, 0, 0);

  const inputCtx = tempCanvas.getContext("2d");
  if (!inputCtx) return;

  let imgData = inputCtx.getImageData(0, 0, inputW, inputH);
  let pixels = imgData.data;
  let r, g, b, outColour;
  for (let i = 0; i < pixels.length; i += 4) {
    r = pixels[i];
    g = pixels[i + 1];
    b = pixels[i + 2];

    if (r === 0 && g === 0 && b === 0) {
      outColour = 0;
    } else {
      outColour = 255;
    }

    pixels[i] = outColour;
    pixels[i + 1] = outColour;
    pixels[i + 2] = outColour;
  }

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = inputW;
  outputCanvas.height = inputH;
  const outputCtx = outputCanvas.getContext("2d");
  outputCtx.putImageData(imgData, 0, 0);

  return outputCanvas;
};
