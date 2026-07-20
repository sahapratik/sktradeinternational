import Link from 'next/link';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import { getIndustries } from '@/db';

export const dynamic = 'force-dynamic';

export default async function IndustriesPage() {
  const industries = await getIndustries();

  return (
    <main>
      <section className="section" style={{ paddingBlockStart: 'clamp(3rem,6vw,5rem)' }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Industries served</p>
            <h1 style={{ maxWidth: '18ch', marginBottom: '1rem' }}>Built around three ceramic production lines</h1>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '54ch', fontSize: '1.05rem' }}>
              Every material, machine and service on this site maps back to one of three production
              contexts — tableware, tiles, and sanitary ware — each with its own material chemistry,
              machinery needs and quality-control pressures.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap grid g3">
          {industries.map((ind, i) => (
            <Reveal key={ind.id} delay={i * 80}>
              <div className="card industry-card" style={{ height: '100%' }}>
                <div className="icon-box icon-box--outline">
                  <Icon name={ind.icon} />
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '.4rem' }}>{ind.title}</h3>
                <ul>
                  {ind.points.map((p) => (
                    <li key={p}>
                      <Icon name="check" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/products?category=${ind.slug === 'sanitary-ware' ? 'sanitary-ware-raw-materials' : ind.slug === 'tiles' ? 'tile-raw-materials' : 'tableware-raw-materials'}`}
                  className="btn btn--ghost btn--sm"
                  style={{ marginTop: '1.4rem' }}
                >
                  View materials <Icon name="arrow-right" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-alt" style={{ textAlign: 'center' }}>
        <div className="wrap">
          <Reveal>
            <h2 style={{ marginBottom: '1rem' }}>Not sure which line your requirement fits?</h2>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '44ch', margin: '0 auto 1.6rem' }}>
              Tell us about the product you&apos;re manufacturing — we&apos;ll match it to the right
              materials, machinery and technical support.
            </p>
            <Link href="/contact" className="btn btn--primary">Talk to a Specialist</Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
