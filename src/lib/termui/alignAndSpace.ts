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

enum Spacing {
  Start,
  SpaceBetween,
  SpaceAround,
  End
}

function calculateSpacing(sizes: number[], containerSize: number, padding: number, gap: number, spacing: Spacing) {
  const offsets = new Array(sizes.length).fill(0);

  let offset = padding;
  if (spacing === Spacing.Start) {
    for (let i = 0; i < sizes.length; i++) {
      offsets[i] = offset;
      offset += sizes[i] + gap;
    }
  } else if (spacing === Spacing.End) {
    offset = containerSize - padding;

    for (let i = sizes.length - 1; i >= 0; i--) {
      offset -= sizes[i];
      offsets[i] = offset;
      offset -= gap;
    }
  } else {
    const spaceCount = sizes.length + (spacing === Spacing.SpaceAround ? 1 : -1);

    let space = containerSize - padding * 2;
    for (let i = 0; i < sizes.length; i++) space -= sizes[i];
    space = Math.round(space / spaceCount);

    if (spacing === Spacing.SpaceAround) offset += space;

    for (let i = 0; i < sizes.length; i++) {
      offsets[i] = offset;
      offset += sizes[i] + space;
    }
  }

  return offsets;
}

export { Alignment, fixAlignment, Spacing, calculateSpacing };
