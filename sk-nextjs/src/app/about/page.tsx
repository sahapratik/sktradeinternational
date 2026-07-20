import Link from 'next/link';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';

export default function AboutPage() {
  const years = new Date().getFullYear() - 2008;
  const values = [
    { icon: 'shield-check', t: 'Reliability', d: 'A consistent focus on product and supply consistency over volume.' },
    { icon: 'file-text', t: 'Transparency', d: 'Straightforward business practices and clear documentation.' },
    { icon: 'life-buoy', t: 'Support', d: 'Installation and technical support that continues after the sale.' },
    { icon: 'globe', t: 'Reach', d: 'An international sourcing network of established principals.' },
  ];

  return (
    <main>
      <section className="section" style={{ paddingBlockStart: 'clamp(3rem,6vw,5rem)' }}>
        <div className="wrap" style={{ maxWidth: 780 }}>
          <Reveal>
            <p className="eyebrow">About</p>
            <h1 style={{ marginBottom: '1.2rem' }}>{years} years in Bangladesh&apos;s ceramic industry</h1>
            <p style={{ color: 'var(--ink-soft)', fontSize: '1.08rem' }}>
              SK Trade International has worked as a technical sourcing partner to Bangladesh&apos;s ceramic
              tableware, tile and sanitaryware manufacturers since 2008 — connecting local production lines
              to an international network of raw-material and machinery principals, alongside the
              installation, documentation and logistics support that keeps a production line running.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt" style={{ paddingTop: 0 }}>
        <div className="wrap grid g4">
          {values.map((v, i) => (
            <Reveal key={v.t} delay={i * 70}>
              <div className="card" style={{ padding: '1.7rem', height: '100%' }}>
                <div className="icon-box"><Icon name={v.icon} /></div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '.4rem' }}>{v.t}</h3>
                <p style={{ fontSize: '.88rem', color: 'var(--ink-soft)' }}>{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 780 }}>
          <Reveal>
            <div className="card" style={{ padding: 'clamp(1.8rem,4vw,2.6rem)', borderStyle: 'dashed' }}>
              <div className="icon-box"><Icon name="compass" /></div>
              <h3 style={{ marginBottom: '.6rem' }}>Content pending from SK Trade International</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '.95rem' }}>
                The full company story, leadership section, timeline, certifications and downloadable
                company profile referenced in the original brief will populate this page once supplied —
                these placeholders are intentional, not oversights, in line with the &quot;don&apos;t
                invent&quot; content rule the whole build follows.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt" style={{ textAlign: 'center' }}>
        <div className="wrap">
          <Reveal>
            <h2 style={{ marginBottom: '1rem' }}>Want to know more before you commit?</h2>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '44ch', margin: '0 auto 1.6rem' }}>
              A short conversation with our team is the fastest way to get a straight answer.
            </p>
            <Link href="/contact" className="btn btn--primary">Contact Us</Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
