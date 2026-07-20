import { notFound } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import { getProductBySlug, getRelatedProducts } from '@/db';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product || product.status !== 'PUBLISHED') notFound();

  const related = await getRelatedProducts(product.category_id, product.id, 3);

  return (
    <main className="section wrap" style={{ maxWidth: 820, paddingBlockStart: 'clamp(2.5rem,5vw,4rem)' }}>
      <Reveal>
        <Link href="/products" style={{ fontSize: '.85rem', color: 'var(--ink-soft)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '.4em' }}>
          <Icon name="arrow-right" className="icon" style={{ transform: 'rotate(180deg)' }} /> All products
        </Link>
        <p className="eyebrow" style={{ marginTop: '1.6rem' }}>{product.category_title}</p>
        <h1 style={{ marginBottom: '1rem' }}>{product.title}</h1>
        <p style={{ fontSize: '1.08rem', color: 'var(--ink-soft)', marginBottom: '2rem' }}>{product.summary}</p>
      </Reveal>

      <Reveal delay={80}>
        <div className="grid g2" style={{ marginBottom: '1.6rem' }}>
          <div className="card" style={{ padding: '1.6rem' }}>
            <div className="icon-box"><Icon name="package" /></div>
            <h3 style={{ fontSize: '.95rem', marginBottom: '.5rem' }}>Primary application</h3>
            <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)' }}>{product.application}</p>
          </div>
          <div className="card" style={{ padding: '1.6rem' }}>
            <div className="icon-box"><Icon name="file-text" /></div>
            <h3 style={{ fontSize: '.95rem', marginBottom: '.5rem' }}>Technical datasheet</h3>
            <p style={{ fontSize: '.88rem', color: 'var(--ink-faint)' }}>
              {product.datasheet_url ? <a href={product.datasheet_url}>Download datasheet</a> : 'Not yet uploaded — request one directly.'}
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={140}>
        <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap', marginBottom: '2.8rem' }}>
          <Link href={`/contact?product=${encodeURIComponent(product.title)}`} className="btn btn--primary">Add to Quote</Link>
          <Link href={`/contact?product=${encodeURIComponent(product.title)}`} className="btn btn--ghost"><Icon name="message" />WhatsApp inquiry</Link>
        </div>
      </Reveal>

      {related.length > 0 && (
        <Reveal delay={200}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.1rem' }}>Related products</h3>
          <div className="grid g3">
            {related.map((r) => (
              <Link key={r.id} href={`/products/${r.slug}`} className="card" style={{ padding: '1.2rem', textDecoration: 'none', display: 'block' }}>
                <h4 style={{ fontSize: '.95rem', color: 'var(--ink)' }}>{r.title}</h4>
              </Link>
            ))}
          </div>
        </Reveal>
      )}
    </main>
  );
}
