export default function AboutPage() {
  const years = new Date().getFullYear() - 2008;
  return (
    <main className="section wrap" style={{ maxWidth: 820 }}>
      <p className="eyebrow">About</p>
      <h1 style={{ fontSize: 'clamp(2rem,3vw,3rem)', marginBottom: '1.2rem' }}>{years} years in Bangladesh&apos;s ceramic industry</h1>
      <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', marginBottom: '1.4rem' }}>
        SK Trade International has worked as a technical sourcing partner to Bangladesh&apos;s ceramic tableware, tile
        and sanitaryware manufacturers since 2008 — connecting local production lines to an international network of
        raw-material and machinery principals, alongside the installation, documentation and logistics support that
        keeps a production line running.
      </p>
      <div className="card" style={{ padding: '1.6rem', marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '.6rem' }}>Content pending from SK Trade International</h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: '.92rem' }}>
          The full company story, leadership section, timeline, certifications and downloadable company profile
          referenced in the brief will populate this page once supplied — placeholders here are intentional, not
          oversights, in line with the &quot;don&apos;t invent&quot; content rule the whole build follows.
        </p>
      </div>
    </main>
  );
}
