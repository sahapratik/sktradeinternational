import Link from 'next/link';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import { getMachineryProducts } from '@/db';

export const dynamic = 'force-dynamic';

// Design note: machinery is modeled as products tagged category.tag === "Machinery"
// rather than a separate table — see architecture.md for the promotion path if
// dedicated specification fields (dimensions, capacity, utilities) become a real need.
export default async function MachineryPage() {
  const machinery = await getMachineryProducts();

  return (
    <main>
      <section className="section" style={{ paddingBlockStart: 'clamp(3rem,6vw,5rem)' }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Machinery</p>
            <h1 style={{ marginBottom: '.6rem' }}>Production &amp; finishing machinery</h1>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '54ch' }}>
              Sourced from established international manufacturers, with installation and
              commissioning support included in every conversation.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap grid g3">
          {machinery.map((m, i) => (
            <Reveal key={m.id} delay={i * 70}>
              <Link href={`/products/${m.slug}`} className="card prod-card" style={{ height: '100%' }}>
                <div className="swatch"><Icon name={m.icon} /></div>
                <div className="cat">{m.category_title}</div>
                <h4 style={{ fontSize: '1.1rem' }}>{m.title}</h4>
                <p>{m.summary}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-alt" style={{ textAlign: 'center' }}>
        <div className="wrap">
          <Reveal>
            <h2 style={{ marginBottom: '1rem' }}>Need installation support too?</h2>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '44ch', margin: '0 auto 1.6rem' }}>
              Machinery installation assistance is one of our standing solutions, not an add-on.
            </p>
            <Link href="/solutions" className="btn btn--primary">See Solutions</Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
