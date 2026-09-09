import type { Metadata } from 'next';
import { AlieShell } from '@/components/alie-shell';
import { LinkedInPostMaker } from '@/components/linkedin-post-maker';
import '../../tool.css';

export const metadata: Metadata = {
  title: 'LinkedIn Post Maker',
  description: 'Write, format, preview, and copy a professional post for free.',
};

export const dynamic = 'force-static';

export default function LinkedInPostMakerPage() {
  return (
    <AlieShell activeTool="linkedin">
      <LinkedInPostMaker />
    </AlieShell>
  );
}
