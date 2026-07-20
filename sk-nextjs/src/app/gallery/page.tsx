import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { getGalleryImages, getGalleryCategories } from '@/db';

export const dynamic = 'force-dynamic';

export default async function GalleryPage({ searchParams }: { searchParams: { category?: string } }) {
  const images = await getGalleryImages({ category: searchParams.category });
  const categories = await getGalleryCategories();

  return (
    <main>
      <section className="section" style={{ paddingBlockStart: 'clamp(3rem,6vw,5rem)', paddingBottom: '2rem' }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Gallery</p>
            <h1 style={{ marginBottom: '.6rem' }}>From the factory floor to the exhibition hall</h1>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '54ch' }}>
              A first set of photos from our own archive — more will be added as they&apos;re supplied.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', marginTop: '1.6rem' }}>
              <Link href="/gallery" className="btn btn--ghost btn--sm" style={!searchParams.category ? activeChip : undefined}>All</Link>
              {categories.map((c) => (
                <Link key={c} href={`/gallery?category=${encodeURIComponent(c)}`} className="btn btn--ghost btn--sm" style={searchParams.category === c ? activeChip : undefined}>
                  {c}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap gallery-grid">
          {images.map((g) => (
            <figure key={g.id} className="gallery-item" style={{ margin: '0 0 1rem' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/gallery/${g.filename}`} alt={g.caption ?? g.category} loading="lazy" />
              <span className="tag">{g.category}</span>
            </figure>
          ))}
        </div>
        {images.length === 0 && <div className="wrap"><p style={{ color: 'var(--ink-faint)' }}>No images in this category yet.</p></div>}
      </section>
    </main>
  );
}

const activeChip: React.CSSProperties = { borderColor: 'var(--copper)', color: 'var(--copper)' };
