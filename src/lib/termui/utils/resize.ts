function resizeUint16Array(
  array: Uint16Array,
  width: number,
  height: number,
  newWidth: number,
  newHeight: number
) {
  const newArray = new Uint16Array(newWidth * newHeight);

  const effectiveWidth = Math.min(width, newWidth);
  const effectiveHeight = Math.min(height, newHeight);

  for (let y = 0; y < effectiveHeight; y++)
    for (let x = 0; x < effectiveWidth; x++) newArray[y * newWidth + x] = array[y * width + x];

  return newArray;
}

function resizeArray<T>(
  array: T[],
  emptyEl: T,
  width: number,
  height: number,
  newWidth: number,
  newHeight: number
) {
  const newArray = new Array<T>(newWidth * newHeight).fill(emptyEl);

  const effectiveWidth = Math.min(width, newWidth);
  const effectiveHeight = Math.min(height, newHeight);

  for (let y = 0; y < effectiveHeight; y++)
    for (let x = 0; x < effectiveWidth; x++) newArray[y * newWidth + x] = array[y * width + x];

  return newArray;
}

export { resizeUint16Array, resizeArray };
