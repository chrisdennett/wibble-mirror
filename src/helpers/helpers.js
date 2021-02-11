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

export function createStretchCanvas({
  sourceCanvas,
  srcCells,
  targCells,
  canvasW,
  canvasH,
}) {
  const outCanvas = document.createElement("canvas");

  outCanvas.width = canvasW;
  outCanvas.height = canvasH;

  const ctx = outCanvas.getContext("2d");

  // draw middle middle stretch
  for (let i = 0; i < srcCells.length; i++) {
    drawSegment(sourceCanvas, ctx, srcCells[i], targCells[i]);
  }

  return outCanvas;
}

export function getSourceCells(cellSize, cols, rows) {
  const data = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      data.push({
        x: c * cellSize.w,
        y: r * cellSize.h,
        w: cellSize.w,
        h: cellSize.h,
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

  const minWidth = 0.3;
  const maxWidth = 1.5;

  for (let r = 0; r < rows; r++) {
    rowHeights.push(getConstrainedRandom(minHeight, maxHeight));
  }

  for (let c = 0; c < cols; c++) {
    colWidths.push(getConstrainedRandom(minWidth, maxWidth));
  }

  return { rowHeights, colWidths };
}

//
// GET Initial sizes
//

export function getColAndRowSizes(cellSize, randomSizes, tick) {
  const cols = randomSizes.colWidths;
  const rows = randomSizes.rowHeights;

  const rowHeights = [];
  const colWidths = [];

  const minHeight = 0.3 * cellSize.h;
  const maxHeight = 1.5 * cellSize.h;

  const minWidth = 0.3 * cellSize.w;
  const maxWidth = 1.5 * cellSize.w;

  for (let r = 0; r < rows.length; r++) {
    rowHeights.push(getConstrainedRandom(minHeight, maxHeight));
  }

  for (let c = 0; c < cols.length; c++) {
    colWidths.push(getConstrainedRandom(minWidth, maxWidth));
  }

  return { rowHeights, colWidths };
}

export function getRandomColAndRowSizes(cellSize, cols, rows, setSize = 0.2) {
  const rowHeights = [];
  const colWidths = [];

  const minHeight = 0.3 * cellSize.h;
  const maxHeight = 1.5 * cellSize.h;

  const minWidth = 0.3 * cellSize.w;
  const maxWidth = 1.5 * cellSize.w;

  for (let r = 0; r < rows; r++) {
    const randomStartHeight = getConstrainedRandomInteger(minHeight, maxHeight);
    const startInc = randomStartHeight < maxHeight / 2 ? setSize : -setSize;

    rowHeights.push({ h: randomStartHeight, inc: startInc });
  }

  for (let c = 0; c < cols; c++) {
    const randomStartWidth = getConstrainedRandomInteger(minWidth, maxWidth);
    const startInc = randomStartWidth < maxWidth ? setSize : -setSize;

    colWidths.push({ w: randomStartWidth, inc: startInc });
  }

  return {
    rowHeights,
    colWidths,
    cellSize,
    minHeight,
    maxHeight,
    minWidth,
    maxWidth,
  };
}

export function getNextColAndRowSizes(currColAndRowSizes, setSize = 0.2) {
  const {
    colWidths: prevColWidths,
    rowHeights: prevRowHeights,
    minHeight,
    maxHeight,
    minWidth,
    maxWidth,
  } = currColAndRowSizes;

  const rowHeights = [];
  const colWidths = [];

  for (let r = 0; r < prevRowHeights.length; r++) {
    const { h, inc } = prevRowHeights[r];

    // reverse the increment if reach bounds
    let newInc = inc;
    if (h + inc > maxHeight) newInc = -setSize;
    if (h + inc < minHeight) newInc = setSize;

    rowHeights.push({ h: h + newInc, inc: newInc });
  }

  for (let c = 0; c < prevColWidths.length; c++) {
    const { w, inc } = prevColWidths[c];

    // reverse the increment if reach bounds
    let newInc = inc;
    if (w + inc > maxWidth) newInc = -setSize;
    if (w + inc < minWidth) newInc = setSize;

    colWidths.push({ w: w + newInc, inc: newInc });
  }

  return { ...currColAndRowSizes, colWidths, rowHeights };
}

export function getTargCells(colAndRowSizes) {
  const { colWidths, rowHeights } = colAndRowSizes;

  const data = [];

  let yPos = 0;
  for (let r = 0; r < rowHeights.length; r++) {
    let xPos = 0;
    const currHeight = rowHeights[r].h;

    for (let c = 0; c < colWidths.length; c++) {
      const currWidth = colWidths[c].w;

      data.push({
        x: xPos,
        y: yPos,
        w: currWidth,
        h: currHeight,
      });

      xPos += currWidth;
    }

    yPos += currHeight;
  }

  return data;
}

// float
function getConstrainedRandom(min, max) {
  return Math.random() * (max - min) + min;
}

// no decimals option
function getConstrainedRandomInteger(min, max) {
  return Math.round(getConstrainedRandom(min, max));
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

  // ctx.strokeStyle = "#fff";
  // ctx.strokeRect(targ.x, targ.y, targ.w, targ.h);
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
