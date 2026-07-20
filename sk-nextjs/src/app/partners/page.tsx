import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';

export default function PartnersPage() {
  return (
    <main>
      <section className="section" style={{ paddingBlockStart: 'clamp(3rem,6vw,5rem)' }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Principals &amp; partners</p>
            <h1 style={{ maxWidth: '20ch', marginBottom: '1rem' }}>An international sourcing network</h1>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '54ch', fontSize: '1.05rem' }}>
              This wall is reserved for the principal manufacturers and suppliers SK Trade
              International represents. Names and logos will populate it as they&apos;re confirmed —
              nothing here is invented in the meantime.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap partner-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <Reveal key={i} delay={i * 40}>
              <div className="partner-tile">
                <Icon name="globe" className="icon" />
                <span>Principal Partner</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <Reveal>
            <div className="trust-reserved">
              <div className="icon-box" style={{ margin: '0 auto 1rem' }}><Icon name="award" /></div>
              <h3 style={{ marginBottom: '.6rem' }}>Client testimonials &amp; certifications</h3>
              <p>Reserved for verified client references and certifications once provided by SK Trade International.</p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
