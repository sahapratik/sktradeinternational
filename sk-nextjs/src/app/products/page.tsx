import Link from 'next/link';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import { getProductCategories, getProducts } from '@/db';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }: { searchParams: { category?: string } }) {
  const categories = await getProductCategories();
  const products = await getProducts({ categorySlug: searchParams.category });
  const activeCategory = categories.find((c) => c.slug === searchParams.category);

  return (
    <main>
      <section className="section" style={{ paddingBlockStart: 'clamp(3rem,6vw,5rem)', paddingBottom: '2rem' }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Products</p>
            <h1 style={{ marginBottom: '.4rem' }}>{activeCategory ? activeCategory.title : 'Materials & machinery catalogue'}</h1>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '54ch' }}>
              {activeCategory ? activeCategory.summary : 'Browse by production line, or view everything we source and support.'}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', marginTop: '1.8rem' }}>
              <Link href="/products" className="btn btn--ghost btn--sm" style={!searchParams.category ? activeChip : undefined}>All</Link>
              {categories.map((c) => (
                <Link key={c.id} href={`/products?category=${c.slug}`} className="btn btn--ghost btn--sm" style={searchParams.category === c.slug ? activeChip : undefined}>
                  {c.title}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap grid g4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 50}>
              <Link href={`/products/${p.slug}`} className="card prod-card" style={{ height: '100%' }}>
                <div className="swatch"><Icon name={p.icon} /></div>
                <div className="cat">{p.category_title}</div>
                <h4>{p.title}</h4>
                <p>{p.summary}</p>
                <div style={{ fontSize: '.78rem', color: 'var(--copper)', marginTop: '.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '.3em' }}>
                  View details <Icon name="arrow-right" />
                </div>
              </Link>
            </Reveal>
          ))}
          {products.length === 0 && <p style={{ color: 'var(--ink-faint)' }}>No products in this category yet.</p>}
        </div>
      </section>
    </main>
  );
}

const activeChip: React.CSSProperties = { borderColor: 'var(--copper)', color: 'var(--copper)' };
