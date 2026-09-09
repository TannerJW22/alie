'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownAZ,
  ArrowUpZA,
  Bold,
  Check,
  Copy,
  Italic,
  List,
  ListChecks,
  ListOrdered,
  LockKeyhole,
  MessageCircle,
  Monitor,
  Redo2,
  Repeat2,
  Send,
  Smartphone,
  Strikethrough,
  ThumbsUp,
  Trash2,
  Underline,
  Undo2,
} from 'lucide-react';
import {
  STYLE_DEFINITIONS,
  applyLineFormat,
  applyTextStyle,
  type StyleId,
} from '@/lib/text-formats';
import { usePostMakerWebMcp } from '@/components/use-post-maker-webmcp';

const selectionFormats: ReadonlyArray<{
  id: StyleId;
  label: string;
  icon: typeof Bold;
}> = [
  { id: 'bold', label: 'Bold', icon: Bold },
  { id: 'italic', label: 'Italic', icon: Italic },
  { id: 'underline', label: 'Underline', icon: Underline },
  { id: 'strikethrough', label: 'Strikethrough', icon: Strikethrough },
];

const lineFormats = [
  { id: 'bullets', label: 'Bullets', icon: List },
  { id: 'numbered', label: 'Numbered', icon: ListOrdered },
  { id: 'checklist', label: 'Checklist', icon: ListChecks },
  { id: 'ascending', label: 'Shortest first', icon: ArrowDownAZ },
  { id: 'descending', label: 'Longest first', icon: ArrowUpZA },
] as const;

type PreviewDevice = 'desktop' | 'mobile';
type CopyTarget = 'post' | StyleId;

export function LinkedInPostMaker() {
  const [text, setText] = useState('');
  const [historyPosition, setHistoryPosition] = useState(0);
  const [historyLength, setHistoryLength] = useState(1);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [copyTarget, setCopyTarget] = useState<CopyTarget | null>(null);
  const [feedback, setFeedback] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selectionRef = useRef({ start: 0, end: 0 });
  const pendingSelectionRef = useRef<{ start: number; end: number } | null>(
    null,
  );
  const historyRef = useRef<string[]>(['']);

  const counts = useMemo(() => {
    const trimmed = text.trim();
    return {
      characters: Array.from(text).length,
      words: trimmed ? trimmed.split(/\s+/u).length : 0,
    };
  }, [text]);

  const previewText = useMemo(() => {
    if (!text) return 'Your post preview will appear here as you type.';
    const characters = Array.from(text);
    return characters.length > 260
      ? `${characters.slice(0, 260).join('')}… more`
      : text;
  }, [text]);

  useLayoutEffect(() => {
    const selection = pendingSelectionRef.current;
    const textarea = textareaRef.current;
    if (!selection || !textarea) return;

    textarea.focus();
    textarea.setSelectionRange(selection.start, selection.end);
    selectionRef.current = selection;
    pendingSelectionRef.current = null;
  }, [text]);

  function rememberSelection() {
    const textarea = textareaRef.current;
    if (!textarea) return;
    selectionRef.current = {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    };
  }

  function commitText(
    nextText: string,
    nextSelection?: { start: number; end: number },
  ) {
    if (nextText === text) {
      if (nextSelection) {
        pendingSelectionRef.current = nextSelection;
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(
          nextSelection.start,
          nextSelection.end,
        );
      }
      return;
    }

    const nextHistory = [
      ...historyRef.current.slice(0, historyPosition + 1),
      nextText,
    ];
    historyRef.current = nextHistory;
    setHistoryPosition(nextHistory.length - 1);
    setHistoryLength(nextHistory.length);
    pendingSelectionRef.current = nextSelection ?? {
      start: nextText.length,
      end: nextText.length,
    };
    setCopyTarget(null);
    setFeedback('');
    setText(nextText);
  }

  function applySelectionFormat(id: StyleId) {
    const { start, end } = selectionRef.current;
    if (start === end) {
      setFeedback('Select some text before applying a text style.');
      textareaRef.current?.focus();
      return;
    }

    const formattedSelection = applyTextStyle(text.slice(start, end), id);
    const nextText = `${text.slice(0, start)}${formattedSelection}${text.slice(end)}`;
    commitText(nextText, {
      start,
      end: start + formattedSelection.length,
    });
  }

  function applyWholeTextLineFormat(
    id: 'bullets' | 'numbered' | 'checklist' | 'ascending' | 'descending',
  ) {
    if (!text) return;
    commitText(applyLineFormat(text, id));
  }

  function moveThroughHistory(direction: -1 | 1) {
    const nextPosition = historyPosition + direction;
    if (nextPosition < 0 || nextPosition >= historyRef.current.length) return;

    const nextText = historyRef.current[nextPosition];
    setHistoryPosition(nextPosition);
    pendingSelectionRef.current = {
      start: nextText.length,
      end: nextText.length,
    };
    setCopyTarget(null);
    setFeedback(direction < 0 ? 'Last change undone.' : 'Change restored.');
    setText(nextText);
  }

  async function copyText(value: string, target: CopyTarget, label: string) {
    if (!value) {
      setFeedback('Write a post before copying it.');
      textareaRef.current?.focus();
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopyTarget(target);
      setFeedback(`${label} copied to your clipboard.`);
    } catch {
      setCopyTarget(null);
      setFeedback(
        'Copy was blocked by your browser. Select the post and copy it manually.',
      );
    }
  }

  usePostMakerWebMcp(text, (nextText) => commitText(nextText));

  return (
    <section className="maker-shell" aria-labelledby="maker-title">
      <header className="maker-head">
        <div>
          <p className="eyebrow">Writing &amp; Social</p>
          <h1 id="maker-title">LinkedIn Post Maker</h1>
          <p>
            Write, format, preview, and copy a professional post in one place.
          </p>
        </div>
        <p className="privacy-chip">
          <LockKeyhole aria-hidden="true" /> Your draft stays in this browser
          tab.
        </p>
      </header>

      <div className="maker-workbench">
        <section className="editor-card" aria-labelledby="editor-title">
          <div className="panel-topline">
            <div>
              <p className="eyebrow">Step 1</p>
              <h2 id="editor-title">Write and format</h2>
            </div>
            <div className="editor-toolbar" aria-label="Edit draft">
              <button
                className="format-button"
                type="button"
                onClick={() => moveThroughHistory(-1)}
                disabled={historyPosition === 0}
              >
                <Undo2 aria-hidden="true" /> Undo
              </button>
              <button
                className="format-button"
                type="button"
                onClick={() => moveThroughHistory(1)}
                disabled={historyPosition >= historyLength - 1}
              >
                <Redo2 aria-hidden="true" /> Redo
              </button>
              <button
                className="format-button"
                type="button"
                onClick={() => commitText('', { start: 0, end: 0 })}
                disabled={!text}
              >
                <Trash2 aria-hidden="true" /> Clear
              </button>
            </div>
          </div>

          <div
            className="editor-toolbar"
            role="toolbar"
            aria-label="Format selected text"
          >
            {selectionFormats.map(({ id, label, icon: Icon }) => (
              <button
                className="format-button"
                type="button"
                key={id}
                aria-label={`Apply ${label.toLowerCase()} to selected text`}
                title={`Apply ${label.toLowerCase()} to selected text`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => applySelectionFormat(id)}
              >
                <Icon aria-hidden="true" /> {label}
              </button>
            ))}
          </div>

          <div
            className="editor-toolbar"
            role="toolbar"
            aria-label="Format every line"
          >
            {lineFormats.map(({ id, label, icon: Icon }) => (
              <button
                className="format-button"
                type="button"
                key={id}
                onClick={() => applyWholeTextLineFormat(id)}
                disabled={!text}
              >
                <Icon aria-hidden="true" /> {label}
              </button>
            ))}
          </div>

          <label className="sr-only" htmlFor="post-draft">
            Post text
          </label>
          <textarea
            ref={textareaRef}
            className="editor-textarea"
            id="post-draft"
            value={text}
            rows={15}
            spellCheck="true"
            placeholder="Share an update, lesson, idea, or question..."
            onChange={(event) => {
              const nextText = event.target.value;
              commitText(nextText, {
                start: event.target.selectionStart,
                end: event.target.selectionEnd,
              });
            }}
            onSelect={rememberSelection}
          />

          <footer className="editor-footer">
            <div className="counts" aria-live="polite" aria-atomic="true">
              <span>
                <strong>{counts.characters}</strong> characters
              </span>
              <span>
                <strong>{counts.words}</strong> words
              </span>
            </div>
            <button
              className="copy-button"
              type="button"
              onClick={() => copyText(text, 'post', 'Post')}
              disabled={!text}
            >
              {copyTarget === 'post' ? (
                <Check aria-hidden="true" />
              ) : (
                <Copy aria-hidden="true" />
              )}
              {copyTarget === 'post' ? 'Copied' : 'Copy post'}
            </button>
          </footer>
        </section>

        <section className="preview-card" aria-labelledby="preview-title">
          <div className="preview-topline">
            <div>
              <p className="eyebrow">Step 2</p>
              <h2 id="preview-title">Preview</h2>
            </div>
            <fieldset
              className="device-toggle"
              aria-label="Preview width"
            >
              <button
                className={`device-button${previewDevice === 'desktop' ? ' is-active' : ''}`}
                type="button"
                aria-pressed={previewDevice === 'desktop'}
                onClick={() => setPreviewDevice('desktop')}
              >
                <Monitor aria-hidden="true" /> Desktop
              </button>
              <button
                className={`device-button${previewDevice === 'mobile' ? ' is-active' : ''}`}
                type="button"
                aria-pressed={previewDevice === 'mobile'}
                onClick={() => setPreviewDevice('mobile')}
              >
                <Smartphone aria-hidden="true" /> Mobile
              </button>
            </fieldset>
          </div>

          <div className="post-preview-frame" data-device={previewDevice}>
            <article
              className="post-preview"
              aria-label="Professional post preview"
            >
              <div className="post-profile">
                <span className="post-avatar" aria-hidden="true">
                  AP
                </span>
                <div className="post-author">
                  <strong>Alex Parker</strong>
                  <span>Product professional</span>
                  <span>1h</span>
                </div>
              </div>
              <p className="post-copy">{previewText}</p>
              <div className="post-actions" aria-label="Example post actions">
                <span>
                  <ThumbsUp aria-hidden="true" /> Like
                </span>
                <span>
                  <MessageCircle aria-hidden="true" /> Comment
                </span>
                <span>
                  <Repeat2 aria-hidden="true" /> Repost
                </span>
                <span>
                  <Send aria-hidden="true" /> Send
                </span>
              </div>
            </article>
          </div>
        </section>
      </div>

      <section className="styles-section" aria-labelledby="styles-title">
        <header className="panel-topline">
          <div>
            <p className="eyebrow">Style gallery</p>
            <h2 id="styles-title">Copy your post in another text style</h2>
          </div>
          <p>
            Select text in the editor for focused formatting, or copy a full
            styled version below.
          </p>
        </header>

        <div className="styles-grid">
          {STYLE_DEFINITIONS.map((style) => {
            const styledPost = applyTextStyle(text, style.id);
            const sample = applyTextStyle('Aa', style.id);
            const wasCopied = copyTarget === style.id;

            return (
              <button
                className="style-card"
                type="button"
                key={style.id}
                aria-label={`Copy your post in ${style.label.toLowerCase()} style`}
                onClick={() =>
                  copyText(styledPost, style.id, `${style.label} post`)
                }
                disabled={!text}
              >
                <span className="style-sample" aria-hidden="true">
                  {sample}
                </span>
                <span className="style-copy">
                  <strong>{style.label}</strong>
                  <span>{style.description}</span>
                  <span>
                    {wasCopied ? (
                      <>
                        <Check aria-hidden="true" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy aria-hidden="true" /> Copy
                      </>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <output
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {feedback}
      </output>
    </section>
  );
}
