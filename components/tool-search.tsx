'use client';

import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Search } from 'lucide-react';

export function ToolSearch() {
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');

  function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = query.trim().toLowerCase();
    if (
      !normalized ||
      ['linkedin', 'post', 'writing', 'formatter'].some((term) =>
        normalized.includes(term),
      )
    ) {
      window.location.assign(
        `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/tools/linkedin-post-maker.html`,
      );
      return;
    }
    setMessage('LinkedIn Post Maker is the only available tool in this MVP.');
  }

  return (
    <form className="tool-search" onSubmit={submit}>
      <Search aria-hidden="true" size={21} />
      <input
        aria-label="Search Alie tools"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setMessage('');
        }}
        placeholder="Search tools, examples, or tasks..."
      />
      <span className="sr-only" aria-live="polite">
        {message}
      </span>
    </form>
  );
}
