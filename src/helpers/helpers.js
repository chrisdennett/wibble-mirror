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
  rows = 5,
  cols = 5,
}) {
  const outCanvas = document.createElement("canvas");
  const { width: srcW, height: srcH } = sourceCanvas;

  outCanvas.width = srcW + targStretchW - srcStretchW;
  outCanvas.height = srcH + targStretchH - srcStretchH;

  const ctx = outCanvas.getContext("2d");

  const srcData = getSrcData(srcW, srcH, cols, rows);
  const targData = getTargData(srcW, srcH, cols, rows);

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

function getTargData(w, h, cols, rows) {
  const data = [];

  // add x, y, w, h for each segment
  const srcCellWidth = w / cols;
  const srcCellHeight = h / rows;

  const minWidth = srcCellWidth / 3;
  const maxWidth = srcCellWidth * 3;

  const diff = maxWidth - minWidth;
  const inc = diff / cols;

  for (let r = 0; r < rows; r++) {
    let width = minWidth;
    let xPos = 0;
    for (let c = 0; c < cols; c++) {
      data.push({
        x: xPos,
        y: r * srcCellHeight,
        w: width,
        h: srcCellHeight,
      });

      xPos += width;
      width += inc;
    }
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
