import Link from 'next/link';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import { getProductCategories, getProducts, getSolutions, getGalleryImages, getIndustries } from '@/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [categories, products, solutions, gallery, industries] = await Promise.all([
    getProductCategories(),
    getProducts({ take: 4 }),
    getSolutions(),
    getGalleryImages({ take: 6 }),
    getIndustries(),
  ]);

  const years = new Date().getFullYear() - 2008;

  return (
    <main>
      {/* ---------- Hero ---------- */}
      <section
        style={{
          position: 'relative', minHeight: '78vh', display: 'flex', alignItems: 'flex-end',
          overflow: 'hidden', color: '#f7f1e4',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/gallery/hero-697ae64c.jpg" alt="SK Trade International facility" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.04)' }} />
        </div>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(180deg, rgba(18,15,10,.55) 0%, rgba(18,15,10,.62) 45%, rgba(14,12,8,.94) 100%), linear-gradient(90deg, rgba(14,12,8,.55), transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, opacity: 0.14, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(247,241,228,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(247,241,228,.5) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 3, paddingBlock: 'clamp(3rem,7vw,5rem)' }}>
          <Reveal>
            <p className="eyebrow" style={{ color: 'var(--copper-soft)' }}>Ceramic materials &amp; machinery · Since 2008</p>
            <h1 style={{ maxWidth: '16ch', color: '#fbf7ec' }}>Materials. Machinery. Precision.</h1>
            <p style={{ maxWidth: '46ch', marginTop: '1.2rem', fontSize: '1.12rem', color: '#e8e0ce' }}>
              Supporting Bangladesh&apos;s ceramic industry with globally sourced raw materials, advanced
              machinery and dependable technical expertise since 2008.
            </p>
            <div style={{ display: 'flex', gap: '.9rem', flexWrap: 'wrap', marginTop: '2rem' }}>
              <Link href="/products" className="btn btn--primary" style={{ background: 'var(--copper)', color: '#1b1712' }}>Explore Our Products</Link>
              <Link href="/contact" className="btn btn--ghost" style={{ borderColor: 'rgba(247,241,228,.4)', color: '#f7f1e4' }}>Request a Quote</Link>
              <Link href="/solutions" className="btn btn--ghost" style={{ borderColor: 'rgba(247,241,228,.4)', color: '#f7f1e4' }}>Talk to a Specialist</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Credibility strip ---------- */}
      <section style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="wrap stat-grid" style={{ paddingBlock: 'clamp(2.2rem,4vw,3rem)' }}>
          <div className="stat"><div className="num">{years}</div><div className="lbl">Years in the ceramic sector<small>Since 2008</small></div></div>
          <div className="stat"><div className="num">3</div><div className="lbl">Core industries served<small>Tableware · Tiles · Sanitary Ware</small></div></div>
          <div className="stat"><div className="num pending">—</div><div className="lbl">Global principals<small>Added once confirmed</small></div></div>
          <div className="stat"><div className="num pending">—</div><div className="lbl">Countries represented<small>Added once confirmed</small></div></div>
        </div>
      </section>

      {/* ---------- Product categories ---------- */}
      <section className="section">
        <div className="wrap">
          <Reveal><div className="section-head">
            <p className="eyebrow">Product categories</p>
            <h2>Materials and machinery, by production line</h2>
            <p>Five core lines cover the raw materials and equipment ceramic manufacturers rely on daily.</p>
          </div></Reveal>
          <div className="grid g5">
            {categories.map((c, i) => (
              <Reveal key={c.id} delay={i * 60}>
                <Link href={`/products?category=${c.slug}`} className="card cat-card" style={{ height: '100%' }}>
                  <div className="icon-box"><Icon name={c.icon} /></div>
                  <div className="tag">{c.tag}</div>
                  <h3>{c.title}</h3>
                  <p>{c.summary}</p>
                  <span className="cat-link">Explore <Icon name="arrow-right" /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Featured products ---------- */}
      <section className="section section-alt">
        <div className="wrap">
          <Reveal><div className="section-head">
            <p className="eyebrow">Featured products</p>
            <h2>From our supply chain</h2>
          </div></Reveal>
          <div className="grid g4">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <Link href={`/products/${p.slug}`} className="card prod-card" style={{ height: '100%' }}>
                  <div className="swatch"><Icon name={p.icon} /></div>
                  <div className="cat">{p.category_tag}</div>
                  <h4>{p.title}</h4>
                  <p>{p.summary}</p>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal><div style={{ textAlign: 'center', marginTop: '2.2rem' }}>
            <Link href="/products" className="btn btn--ghost">View full catalogue <Icon name="arrow-right" /></Link>
          </div></Reveal>
        </div>
      </section>

      {/* ---------- Industries preview ---------- */}
      <section className="section">
        <div className="wrap">
          <Reveal><div className="section-head">
            <p className="eyebrow">Industries served</p>
            <h2>Built around three ceramic production lines</h2>
          </div></Reveal>
          <div className="grid g3">
            {industries.map((ind, i) => (
              <Reveal key={ind.id} delay={i * 80}>
                <Link href="/industries" className="card industry-card" style={{ height: '100%', display: 'block', textDecoration: 'none' }}>
                  <div className="icon-box icon-box--outline"><Icon name={ind.icon} /></div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--ink)' }}>{ind.title}</h3>
                  <ul>{ind.points.slice(0, 3).map((p) => <li key={p}><Icon name="check" /><span>{p}</span></li>)}</ul>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Solutions preview ---------- */}
      <section className="section section-alt">
        <div className="wrap">
          <Reveal><div className="section-head">
            <p className="eyebrow">Solutions</p>
            <h2>Support that goes beyond the invoice</h2>
          </div></Reveal>
          <div className="grid g4">
            {solutions.slice(0, 4).map((s, i) => (
              <Reveal key={s.id} delay={i * 60}>
                <div className="card sol-card" style={{ height: '100%' }}>
                  <div className="icon-box"><Icon name={s.icon} /></div>
                  <div><h4>{s.title}</h4><p>{s.description}</p></div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal><div style={{ textAlign: 'center', marginTop: '2.2rem' }}>
            <Link href="/solutions" className="btn btn--ghost">See all solutions <Icon name="arrow-right" /></Link>
          </div></Reveal>
        </div>
      </section>

      {/* ---------- Gallery preview ---------- */}
      <section className="section">
        <div className="wrap">
          <Reveal><div className="section-head">
            <p className="eyebrow">Gallery</p>
            <h2>From our own archive</h2>
          </div></Reveal>
          <div className="gallery-grid">
            {gallery.map((g) => (
              <div key={g.id} className="gallery-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/gallery/${g.filename}`} alt={g.caption ?? g.category} loading="lazy" />
                <span className="tag">{g.category}</span>
              </div>
            ))}
          </div>
          <Reveal><div style={{ textAlign: 'center', marginTop: '2.2rem' }}>
            <Link href="/gallery" className="btn btn--ghost">View full gallery <Icon name="arrow-right" /></Link>
          </div></Reveal>
        </div>
      </section>

      {/* ---------- Quote CTA ---------- */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <div style={{
              background: 'var(--ink)', color: '#f4eedf', borderRadius: 'var(--r-lg)',
              padding: 'clamp(2.6rem,6vw,4.5rem)', textAlign: 'center', position: 'relative', overflow: 'hidden',
            }}>
              <p className="eyebrow" style={{ justifyContent: 'center', color: 'var(--copper-soft)' }}>Get in touch</p>
              <h2 style={{ color: '#f9f5ea' }}>Discuss Your Material or Machinery Requirements</h2>
              <p style={{ color: '#cfc5ae', maxWidth: '44ch', margin: '1rem auto 2rem' }}>
                Tell us what your production line needs — we&apos;ll follow up with sourcing options and a clear quotation.
              </p>
              <Link href="/contact" className="btn btn--primary" style={{ background: 'var(--copper)', color: '#1b1712' }}>Request a Quote</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
