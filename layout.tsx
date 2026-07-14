import Link from 'next/link';
import { getMachineryProducts } from '@/db';

export const dynamic = 'force-dynamic';

// Design note: machinery is modeled as products tagged category.tag === "Machinery"
// rather than a separate table — see architecture.md for the promotion path if
// dedicated specification fields (dimensions, capacity, utilities) become a real need.
export default async function MachineryPage() {
  const machinery = getMachineryProducts();

  return (
    <main className="section wrap">
      <p className="eyebrow">Machinery</p>
      <h1 style={{ fontSize: 'clamp(2rem,3vw,3rem)', marginBottom: '1.5rem' }}>Production &amp; finishing machinery</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: '1.2rem' }}>
        {machinery.map((m) => (
          <Link key={m.id} href={`/products/${m.slug}`} className="card" style={{ padding: '1.4rem', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: '.7rem', textTransform: 'uppercase', color: 'var(--ink-faint)', fontWeight: 700 }}>{m.category_title}</div>
            <h3 style={{ fontSize: '1.05rem', margin: '.4rem 0 .5rem', color: 'var(--ink)' }}>{m.title}</h3>
            <p style={{ fontSize: '.87rem', color: 'var(--ink-soft)' }}>{m.summary}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
