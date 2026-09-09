'use client';

import { useEffect, useRef } from 'react';
import {
  applyTextStyle,
  STYLE_DEFINITIONS,
  type StyleId,
} from '@/lib/text-formats';

type ToolDefinition = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (
    input: unknown,
  ) => Record<string, unknown> | Promise<Record<string, unknown>>;
};

type ModelContext = {
  registerTool: (
    tool: ToolDefinition,
    options?: { signal?: AbortSignal },
  ) => void | Promise<void>;
};

function parseObject(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Input must be an object.');
  }
  return input as Record<string, unknown>;
}

function afterVisibleUpdate() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

export function usePostMakerWebMcp(
  text: string,
  setText: (value: string) => void,
) {
  const textRef = useRef(text);
  const setTextRef = useRef(setText);

  useEffect(() => {
    textRef.current = text;
    setTextRef.current = setText;
  }, [text, setText]);

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext })
      .modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    const supportedStyles = STYLE_DEFINITIONS.filter(
      ({ availability }) => availability !== 'disabled',
    ).map(({ id }) => id);

    const commitText = async (nextText: string) => {
      textRef.current = nextText;
      setTextRef.current(nextText);
      await afterVisibleUpdate();
    };

    const registrations = [
      context.registerTool(
        {
          name: 'read_linkedin_post_draft',
          title: 'Read LinkedIn post draft',
          description:
            'Read the text currently visible in the Alie LinkedIn Post Maker editor.',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true, untrustedContentHint: true },
          execute(input) {
            parseObject(input);
            return {
              text: textRef.current,
              characterCount: textRef.current.length,
            };
          },
        },
        { signal: lifecycle.signal },
      ),
      context.registerTool(
        {
          name: 'set_linkedin_post_draft',
          title: 'Set LinkedIn post draft',
          description:
            'Replace the visible Alie editor draft with supplied text.',
          inputSchema: {
            type: 'object',
            properties: { text: { type: 'string' } },
            required: ['text'],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: true },
          async execute(input) {
            const value = parseObject(input);
            if (typeof value.text !== 'string')
              throw new Error('text must be a string.');
            await commitText(value.text);
            return { status: 'updated', characterCount: value.text.length };
          },
        },
        { signal: lifecycle.signal },
      ),
      context.registerTool(
        {
          name: 'format_linkedin_post_draft',
          title: 'Format LinkedIn post draft',
          description:
            'Apply one supported Alie text style to the entire visible draft.',
          inputSchema: {
            type: 'object',
            properties: { style: { type: 'string', enum: supportedStyles } },
            required: ['style'],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: true },
          async execute(input) {
            const value = parseObject(input);
            if (
              typeof value.style !== 'string' ||
              !supportedStyles.includes(value.style as StyleId)
            ) {
              throw new Error(
                'style must be one of the supported Alie style identifiers.',
              );
            }
            const nextText = applyTextStyle(
              textRef.current,
              value.style as StyleId,
            );
            await commitText(nextText);
            return {
              status: 'formatted',
              style: value.style,
              characterCount: nextText.length,
            };
          },
        },
        { signal: lifecycle.signal },
      ),
    ];

    for (const registration of registrations) {
      void Promise.resolve(registration).catch((error) => {
        console.warn('Alie could not register a browser tool.', error);
      });
    }

    return () => lifecycle.abort();
  }, []);
}
