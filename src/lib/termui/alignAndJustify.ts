enum Alignment {
  Start,
  Center,
  End
}

// prettier-ignore
const fixAlignment =
  (pos: number, size: number, alignment: Alignment) =>
      alignment === Alignment.Start ? pos
    : alignment === Alignment.End ? pos - size
    : pos - Math.floor(size / 2);

enum Justify {
  Start,
  Center,
  SpaceBetween,
  SpaceAround,
  End
}

function calculateJustify(sizes: number[], containerSize: number, padding: number, gap: number, justify: Justify) {
  const offsets = new Array(sizes.length).fill(0);

  let offset = padding;
  if (justify === Justify.Start) {
    for (let i = 0; i < sizes.length; i++) {
      offsets[i] = offset;
      offset += sizes[i] + gap;
    }
  } else if (justify === Justify.Center) {
    let size = gap * (sizes.length - 1);
    for (let i = 0; i < sizes.length; i++) size += sizes[i];

    offset = Math.floor((containerSize - size) / 2);

    for (let i = 0; i < sizes.length; i++) {
      offsets[i] = offset;
      offset += sizes[i] + gap;
    }
  } else if (justify === Justify.End) {
    offset = containerSize - padding;

    for (let i = sizes.length - 1; i >= 0; i--) {
      offset -= sizes[i];
      offsets[i] = offset;
      offset -= gap;
    }
  } else {
    const spaceCount = sizes.length + (justify === Justify.SpaceAround ? 1 : -1);

    let space = containerSize - padding * 2;
    for (let i = 0; i < sizes.length; i++) space -= sizes[i];
    space = Math.floor(space / spaceCount);

    if (justify === Justify.SpaceAround) offset += space;

    for (let i = 0; i < sizes.length; i++) {
      offsets[i] = offset;
      offset += sizes[i] + space;
    }
  }

  return offsets;
}

export { Alignment, fixAlignment, Justify, calculateJustify };
