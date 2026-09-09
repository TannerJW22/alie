import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

// Node runs this TypeScript test directly with type stripping. The application build resolves
// the same module through its bundler.
// @ts-expect-error Node's type-stripping runner requires the explicit TypeScript extension.
import * as textFormats from './text-formats.ts';

const { STYLE_DEFINITIONS, applyLineFormat, applyTextStyle } = textFormats;
type StyleId = (typeof STYLE_DEFINITIONS)[number]['id'];

void describe('STYLE_DEFINITIONS', () => {
  void test('publishes every Typegrow-parity text style once', () => {
    const expectedIds: StyleId[] = [
      'normal',
      'bold',
      'boldSans',
      'italic',
      'italicSans',
      'boldItalic',
      'boldItalicSans',
      'sans',
      'underline',
      'strikethrough',
      'boldUnderline',
      'boldStrikethrough',
      'script',
      'doublestruck',
      'fullwidth',
      'uppercase',
      'lowercase',
    ];

    assert.deepEqual(
      STYLE_DEFINITIONS.map(({ id }) => id),
      expectedIds,
    );
    assert.ok(
      STYLE_DEFINITIONS.every(({ label, description }) => label && description),
    );
  });
});

void describe('applyTextStyle', () => {
  void test('maps representative letters and digits for each mathematical alphabet', () => {
    assert.equal(applyTextStyle('Az09', 'bold'), '𝐀𝐳𝟎𝟗');
    assert.equal(applyTextStyle('Az09', 'boldSans'), '𝗔𝘇𝟬𝟵');
    assert.equal(applyTextStyle('Az09', 'italic'), '𝐴𝑧09');
    assert.equal(applyTextStyle('Az09', 'italicSans'), '𝘈𝘻09');
    assert.equal(applyTextStyle('Az09', 'boldItalic'), '𝑨𝒛09');
    assert.equal(applyTextStyle('Az09', 'boldItalicSans'), '𝘼𝙯09');
    assert.equal(applyTextStyle('Az09', 'sans'), '𝖠𝗓𝟢𝟫');
    assert.equal(applyTextStyle('Az09', 'script'), '𝓐𝔃09');
    assert.equal(applyTextStyle('Az09', 'doublestruck'), '𝔸𝕫𝟘𝟡');
    assert.equal(applyTextStyle('Az09', 'fullwidth'), 'Ａｚ０９');
  });

  void test('uses the Unicode exception code points and preserves unrelated graphemes', () => {
    assert.equal(applyTextStyle('h', 'italic'), 'ℎ');
    assert.equal(applyTextStyle('CHNPQRZ', 'doublestruck'), 'ℂℍℕℙℚℝℤ');
    assert.equal(applyTextStyle('Café 👩🏽‍💻', 'bold'), '𝐂𝐚𝐟é 👩🏽‍💻');
    assert.equal(applyTextStyle('Café 👩🏽‍💻', 'normal'), 'Café 👩🏽‍💻');
  });

  void test('applies combining styles once per grapheme without crossing line breaks', () => {
    assert.equal(applyTextStyle('A1', 'underline'), 'A̲1̲');
    assert.equal(applyTextStyle('A1', 'strikethrough'), 'A̶1̶');
    assert.equal(applyTextStyle('A\n1', 'boldUnderline'), '𝐀̲\n𝟏̲');
    assert.equal(applyTextStyle('A1', 'boldStrikethrough'), '𝐀̶𝟏̶');
    assert.equal(applyTextStyle('e\u0301', 'underline'), 'e\u0301\u0332');
  });

  void test('changes case with native Unicode-aware casing', () => {
    assert.equal(applyTextStyle('Alie É', 'uppercase'), 'ALIE É');
    assert.equal(applyTextStyle('Alie É', 'lowercase'), 'alie é');
  });
});

void describe('applyLineFormat', () => {
  void test('formats non-empty lines as bullets, numbers, or checklists', () => {
    const source = 'First\n\nSecond';

    assert.equal(applyLineFormat(source, 'bullets'), '  • First\n\n  • Second');
    assert.equal(
      applyLineFormat(source, 'numbered'),
      '  1. First\n\n  2. Second',
    );
    assert.equal(
      applyLineFormat(source, 'checklist'),
      '  [ ] First\n\n  [ ] Second',
    );
  });

  void test('replaces another line format and toggles the active format off', () => {
    const bullets = '  • First\n  • Second';

    assert.equal(
      applyLineFormat(bullets, 'numbered'),
      '  1. First\n  2. Second',
    );
    assert.equal(applyLineFormat(bullets, 'bullets'), 'First\nSecond');
  });

  void test('sorts lines by code-point length and keeps equal lengths stable', () => {
    const source = 'long\nx\nmid\ncat';

    assert.equal(applyLineFormat(source, 'ascending'), 'x\nmid\ncat\nlong');
    assert.equal(applyLineFormat(source, 'descending'), 'long\nmid\ncat\nx');
  });
});
