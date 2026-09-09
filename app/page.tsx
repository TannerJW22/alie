import {
  ArrowRight,
  FileText,
  LockKeyhole,
  Mail,
  NotebookText,
  PenLine,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { AlieShell } from '@/components/alie-shell';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const comingSoon = [
  {
    name: 'Email Rewriter',
    description: 'Make your emails clearer.',
    icon: Mail,
  },
  {
    name: 'Meeting Notes',
    description: 'Turn notes into action.',
    icon: NotebookText,
  },
  {
    name: 'Bio Builder',
    description: 'Write a professional bio.',
    icon: UserRound,
  },
  {
    name: 'Text Cleaner',
    description: 'Remove clutter and fix text.',
    icon: Sparkles,
  },
  {
    name: 'Content Ideas',
    description: 'Find a useful starting point.',
    icon: FileText,
  },
];

export default function Home() {
  return (
    <AlieShell>
      <section className="page-intro">
        <p className="eyebrow">Writing &amp; Social</p>
        <h1>What would you like to make?</h1>
        <p>
          Create clear, confident content with a free tool that keeps the work
          straightforward.
        </p>
      </section>

      <div className="home-feature-grid">
        <article className="featured-tool">
          <div className="feature-copy">
            <div className="feature-title">
              <span className="feature-icon">
                <PenLine aria-hidden="true" />
              </span>
              <h2>LinkedIn Post Maker</h2>
            </div>
            <p>Write, format, preview, and copy a polished LinkedIn post.</p>
            <a className="primary-action" href={`${basePath}/tools/linkedin-post-maker.html`}>
              Start a post <ArrowRight aria-hidden="true" />
            </a>
          </div>
          <div
            className="mini-flow"
            aria-label="Write an idea and preview the finished post"
          >
            <div className="mini-sheet">
              <strong>Your ideas</strong>
              <span>Share an update about a recent project...</span>
              <i />
              <i />
              <i />
            </div>
            <ArrowRight className="flow-arrow" aria-hidden="true" />
            <div className="mini-sheet mini-preview">
              <strong>Post preview</strong>
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </article>

        <aside className="coming-panel">
          <h2>Coming next</h2>
          {comingSoon.slice(0, 2).map(({ name, description, icon: Icon }) => (
            <div className="coming-row" key={name}>
              <span className="coming-icon">
                <Icon aria-hidden="true" />
              </span>
              <span>
                <strong>{name}</strong>
                <small>{description}</small>
              </span>
              <em>Coming soon</em>
            </div>
          ))}
        </aside>
      </div>

      <div className="section-heading">
        <div>
          <h2>More free tools</h2>
          <p>
            The suite will grow here without making the first tool harder to
            use.
          </p>
        </div>
        <span className="privacy-note">
          <LockKeyhole aria-hidden="true" /> Your draft stays in your browser.
        </span>
      </div>

      <div className="tool-card-grid">
        {comingSoon.map(({ name, description, icon: Icon }) => (
          <article className="tool-card is-coming" key={name}>
            <span className="card-icon">
              <Icon aria-hidden="true" />
            </span>
            <span>
              <strong>{name}</strong>
              <small>{description}</small>
            </span>
            <em>Coming soon</em>
          </article>
        ))}
      </div>
    </AlieShell>
  );
}
