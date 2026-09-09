import Image from 'next/image';
import {
  BriefcaseBusiness,
  Calculator,
  FileText,
  Grid3X3,
  Image as ImageIcon,
  Mail,
  NotebookText,
  PenLine,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { ToolSearch } from './tool-search';

const futureTools = [
  { name: 'Email Rewriter', icon: Mail },
  { name: 'Meeting Notes', icon: NotebookText },
  { name: 'Bio Builder', icon: UserRound },
  { name: 'Text Cleaner', icon: Sparkles },
];

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function AlieShell({
  children,
  activeTool = 'all',
}: {
  children: React.ReactNode;
  activeTool?: 'all' | 'linkedin';
}) {
  return (
    <div className="site-frame">
      <header className="brand-row">
        <a className="brand" href={`${basePath}/`} aria-label="Alie home">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/alie-mark.svg`}
            alt=""
            width="48"
            height="48"
          />
          <span>Alie</span>
        </a>
        <ToolSearch />
        <div className="header-note">
          <strong>Tools for everyone</strong>
          <span>Free. Clear. In your browser.</span>
        </div>
      </header>

      <nav className="category-tabs" aria-label="Tool categories">
        <a className="category-tab is-active" href={`${basePath}/`} aria-current="page">
          <PenLine aria-hidden="true" />
          <span>Writing &amp; Social</span>
        </a>
        <button
          className="category-tab"
          type="button"
          disabled
          title="Coming soon"
        >
          <FileText aria-hidden="true" />
          <span>Documents &amp; Files</span>
        </button>
        <button
          className="category-tab"
          type="button"
          disabled
          title="Coming soon"
        >
          <ImageIcon aria-hidden="true" />
          <span>Images &amp; Media</span>
        </button>
        <button
          className="category-tab"
          type="button"
          disabled
          title="Coming soon"
        >
          <Calculator aria-hidden="true" />
          <span>Data &amp; Calculators</span>
        </button>
        <button
          className="category-tab"
          type="button"
          disabled
          title="Coming soon"
        >
          <BriefcaseBusiness aria-hidden="true" />
          <span>Career &amp; Work</span>
        </button>
      </nav>

      <div className="workspace-shell">
        <aside className="tool-rail" aria-label="Writing and social tools">
          <h2>Writing &amp; Social</h2>
          <a
            className={`rail-link${activeTool === 'all' ? ' is-active' : ''}`}
            href={`${basePath}/`}
            aria-current={activeTool === 'all' ? 'page' : undefined}
          >
            <Grid3X3 aria-hidden="true" />
            <span>All writing tools</span>
          </a>
          <a
            className={`rail-link${activeTool === 'linkedin' ? ' is-active' : ''}`}
            href={`${basePath}/tools/linkedin-post-maker.html`}
            aria-current={activeTool === 'linkedin' ? 'page' : undefined}
          >
            <PenLine aria-hidden="true" />
            <span>LinkedIn Post Maker</span>
          </a>
          {futureTools.map(({ name, icon: Icon }) => (
            <div
              className="rail-link is-disabled"
              key={name}
              aria-disabled="true"
            >
              <Icon aria-hidden="true" />
              <span>{name}</span>
              <small>Coming soon</small>
            </div>
          ))}
        </aside>
        <main className="workspace-main">{children}</main>
      </div>
    </div>
  );
}
