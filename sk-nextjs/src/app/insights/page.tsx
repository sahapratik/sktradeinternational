import Link from 'next/link';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';

export default function InsightsPage() {
  return (
    <main className="section wrap" style={{ maxWidth: 720, textAlign: 'center', paddingBlockStart: 'clamp(3rem,6vw,5rem)' }}>
      <Reveal>
        <p className="eyebrow" style={{ justifyContent: 'center' }}>Insights</p>
        <h1 style={{ marginBottom: '1rem' }}>Resources, coming soon</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', marginBottom: '2.2rem' }}>
          This section is reserved for technical articles, sourcing guides and ceramic-industry
          notes from SK Trade International. Nothing is published here yet — genuine content
          takes real editorial time, and a placeholder article would only get in the way of it.
        </p>
        <div className="card" style={{ padding: '2rem', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '.8rem' }}>
          <div className="icon-box" style={{ margin: 0 }}><Icon name="book" /></div>
          <p style={{ color: 'var(--ink-faint)', fontSize: '.9rem', maxWidth: '32ch' }}>
            Have a technical question in the meantime? Ask a specialist directly.
          </p>
          <Link href="/contact" className="btn btn--ghost btn--sm">Contact Us</Link>
        </div>
      </Reveal>
    </main>
  );
}
