export type StyleId =
  | 'normal'
  | 'bold'
  | 'boldSans'
  | 'italic'
  | 'italicSans'
  | 'boldItalic'
  | 'boldItalicSans'
  | 'sans'
  | 'underline'
  | 'strikethrough'
  | 'boldUnderline'
  | 'boldStrikethrough'
  | 'script'
  | 'doublestruck'
  | 'fullwidth'
  | 'uppercase'
  | 'lowercase';

export type StyleAvailability = 'available' | 'experimental' | 'disabled';

type StyleDefinition = {
  id: StyleId;
  label: string;
  description: string;
  availability?: StyleAvailability;
  unavailableReason?: string;
};

export const UNDERLINE_EXPERIMENT_STATE: StyleAvailability = 'experimental';
export const UNDERLINE_UNAVAILABLE_REASON =
  'LinkedIn does not reliably preserve connected underlining across fonts and devices.';

type LineFormatId =
  | 'bullets'
  | 'numbered'
  | 'checklist'
  | 'ascending'
  | 'descending';

type AlphanumericStyle = {
  uppercaseStart: number;
  lowercaseStart: number;
  digitStart?: number;
  overrides?: Readonly<Record<string, number>>;
};

export const STYLE_DEFINITIONS: readonly StyleDefinition[] = [
  { id: 'normal', label: 'Normal', description: 'Keep the original text.' },
  {
    id: 'bold',
    label: 'Bold',
    description: 'Use bold serif Unicode characters.',
  },
  {
    id: 'boldSans',
    label: 'Bold Sans',
    description: 'Use bold sans-serif Unicode characters.',
  },
  {
    id: 'italic',
    label: 'Italic',
    description: 'Use italic serif Unicode characters.',
  },
  {
    id: 'italicSans',
    label: 'Italic Sans',
    description: 'Use italic sans-serif Unicode characters.',
  },
  {
    id: 'boldItalic',
    label: 'Bold Italic',
    description: 'Use bold italic serif Unicode characters.',
  },
  {
    id: 'boldItalicSans',
    label: 'Bold Italic Sans',
    description: 'Use bold italic sans-serif Unicode characters.',
  },
  {
    id: 'sans',
    label: 'Sans',
    description: 'Use sans-serif Unicode characters.',
  },
  {
    id: 'underline',
    label: 'Underline (Experimental)',
    description:
      'Best-effort connected underline. Test it in LinkedIn before publishing.',
    availability: UNDERLINE_EXPERIMENT_STATE,
    unavailableReason: UNDERLINE_UNAVAILABLE_REASON,
  },
  {
    id: 'strikethrough',
    label: 'Strikethrough',
    description: 'Add a line through each text character.',
  },
  {
    id: 'boldUnderline',
    label: 'Bold Underline (Experimental)',
    description:
      'Best-effort bold underline. Test it in LinkedIn before publishing.',
    availability: UNDERLINE_EXPERIMENT_STATE,
    unavailableReason: UNDERLINE_UNAVAILABLE_REASON,
  },
  {
    id: 'boldStrikethrough',
    label: 'Bold Strikethrough',
    description: 'Use bold characters with a line through them.',
  },
  {
    id: 'script',
    label: 'Script',
    description: 'Use decorative bold script Unicode letters.',
  },
  {
    id: 'doublestruck',
    label: 'Doublestruck',
    description: 'Use double-struck Unicode letters and numbers.',
  },
  {
    id: 'fullwidth',
    label: 'Fullwidth',
    description: 'Use fullwidth letters and numbers.',
  },
  {
    id: 'uppercase',
    label: 'Uppercase',
    description: 'Convert letters to uppercase.',
  },
  {
    id: 'lowercase',
    label: 'Lowercase',
    description: 'Convert letters to lowercase.',
  },
];

const ALPHANUMERIC_STYLES = {
  bold: {
    uppercaseStart: 0x1d400,
    lowercaseStart: 0x1d41a,
    digitStart: 0x1d7ce,
  },
  boldSans: {
    uppercaseStart: 0x1d5d4,
    lowercaseStart: 0x1d5ee,
    digitStart: 0x1d7ec,
  },
  italic: {
    uppercaseStart: 0x1d434,
    lowercaseStart: 0x1d44e,
    overrides: { h: 0x210e },
  },
  italicSans: {
    uppercaseStart: 0x1d608,
    lowercaseStart: 0x1d622,
  },
  boldItalic: {
    uppercaseStart: 0x1d468,
    lowercaseStart: 0x1d482,
  },
  boldItalicSans: {
    uppercaseStart: 0x1d63c,
    lowercaseStart: 0x1d656,
  },
  sans: {
    uppercaseStart: 0x1d5a0,
    lowercaseStart: 0x1d5ba,
    digitStart: 0x1d7e2,
  },
  script: {
    uppercaseStart: 0x1d4d0,
    lowercaseStart: 0x1d4ea,
  },
  doublestruck: {
    uppercaseStart: 0x1d538,
    lowercaseStart: 0x1d552,
    digitStart: 0x1d7d8,
    overrides: {
      C: 0x2102,
      H: 0x210d,
      N: 0x2115,
      P: 0x2119,
      Q: 0x211a,
      R: 0x211d,
      Z: 0x2124,
    },
  },
  fullwidth: {
    uppercaseStart: 0xff21,
    lowercaseStart: 0xff41,
    digitStart: 0xff10,
  },
} as const satisfies Readonly<Record<string, AlphanumericStyle>>;

const UNDERLINE_MARK = '\u0332';
const STRIKETHROUGH_MARK = '\u0336';
const LIST_INDENT = '\u00a0\u00a0';
const graphemeSegmenter = new Intl.Segmenter(undefined, {
  granularity: 'grapheme',
});

function mapAlphanumeric(text: string, style: AlphanumericStyle): string {
  let result = '';

  for (const character of text) {
    const override = style.overrides?.[character];
    if (override !== undefined) {
      result += String.fromCodePoint(override);
      continue;
    }

    const codePoint = character.codePointAt(0);
    if (codePoint === undefined) {
      continue;
    }

    if (codePoint >= 0x41 && codePoint <= 0x5a) {
      result += String.fromCodePoint(style.uppercaseStart + codePoint - 0x41);
    } else if (codePoint >= 0x61 && codePoint <= 0x7a) {
      result += String.fromCodePoint(style.lowercaseStart + codePoint - 0x61);
    } else if (
      style.digitStart !== undefined &&
      codePoint >= 0x30 &&
      codePoint <= 0x39
    ) {
      result += String.fromCodePoint(style.digitStart + codePoint - 0x30);
    } else {
      result += character;
    }
  }

  return result;
}

function decorateGraphemes(text: string, mark: string): string {
  return Array.from(graphemeSegmenter.segment(text), ({ segment }) =>
    segment.includes(mark) || /[\r\n\t\u2028\u2029]/u.test(segment)
      ? segment
      : `${segment}${mark}`,
  ).join('');
}

export function applyTextStyle(text: string, id: StyleId): string {
  switch (id) {
    case 'normal':
      return text;
    case 'bold':
    case 'boldSans':
    case 'italic':
    case 'italicSans':
    case 'boldItalic':
    case 'boldItalicSans':
    case 'sans':
    case 'script':
    case 'doublestruck':
    case 'fullwidth':
      return mapAlphanumeric(text, ALPHANUMERIC_STYLES[id]);
    case 'underline':
      return decorateGraphemes(text, UNDERLINE_MARK);
    case 'strikethrough':
      return decorateGraphemes(text, STRIKETHROUGH_MARK);
    case 'boldUnderline':
      return decorateGraphemes(
        mapAlphanumeric(text, ALPHANUMERIC_STYLES.bold),
        UNDERLINE_MARK,
      );
    case 'boldStrikethrough':
      return decorateGraphemes(
        mapAlphanumeric(text, ALPHANUMERIC_STYLES.bold),
        STRIKETHROUGH_MARK,
      );
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
  }
}

function lineHasFormat(
  line: string,
  id: 'bullets' | 'numbered' | 'checklist',
): boolean {
  switch (id) {
    case 'bullets':
      return /^(?:\u00a0\u00a0|[ \t]*)•\s/u.test(line);
    case 'numbered':
      return /^(?:\u00a0\u00a0|[ \t]*)\d+\.\s/u.test(line);
    case 'checklist':
      return /^(?:\u00a0\u00a0|[ \t]*)\[ \]\s/u.test(line);
  }
}

function stripLineFormat(line: string): string {
  return line.replace(/^(?:\u00a0\u00a0|[ \t]*)(?:•|\d+\.|\[ \])\s/u, '');
}

function visibleLength(line: string): number {
  return Array.from(line).length;
}

export function applyLineFormat(text: string, id: LineFormatId): string {
  const lines = text.split('\n');

  if (id === 'ascending' || id === 'descending') {
    return lines
      .map((line, index) => ({ line, index, length: visibleLength(line) }))
      .sort((left, right) => {
        const difference =
          id === 'ascending'
            ? left.length - right.length
            : right.length - left.length;
        return difference || left.index - right.index;
      })
      .map(({ line }) => line)
      .join('\n');
  }

  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  if (
    nonEmptyLines.length > 0 &&
    nonEmptyLines.every((line) => lineHasFormat(line, id))
  ) {
    return lines.map(stripLineFormat).join('\n');
  }

  const plainLines = lines.map(stripLineFormat);
  let itemNumber = 1;

  return plainLines
    .map((line) => {
      if (line.trim().length === 0) {
        return line;
      }

      switch (id) {
        case 'bullets':
          return `${LIST_INDENT}• ${line}`;
        case 'numbered':
          return `${LIST_INDENT}${itemNumber++}. ${line}`;
        case 'checklist':
          return `${LIST_INDENT}[ ] ${line}`;
      }
    })
    .join('\n');
}
