'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/products', label: 'Products' },
  { href: '/machinery', label: 'Machinery' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 500,
        background: 'color-mix(in srgb, var(--bg) 90%, transparent)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76 }}>
        <Link href="/" style={{ fontFamily: 'var(--ff-display)', fontWeight: 600, fontSize: '1.15rem', color: 'var(--copper)', textDecoration: 'none' }}>
          SK Trade International
        </Link>

        <nav aria-label="Primary" style={{ display: 'none' }} className="desktop-nav">
          <ul style={{ display: 'flex', gap: '1.7rem', listStyle: 'none', margin: 0, padding: 0 }}>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} style={{ textDecoration: 'none', color: 'var(--ink-soft)', fontWeight: 600, fontSize: '0.92rem' }}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <ThemeToggle />
          <Link href="/contact" className="btn btn--primary" style={{ padding: '.7em 1.3em', fontSize: '.88rem' }}>
            Request a Quote
          </Link>
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="mobile-only"
            style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--line)', background: 'var(--surface)', cursor: 'pointer' }}
          >
            ≡
          </button>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 600, padding: '2rem', display: 'flex', flexDirection: 'column' }}
        >
          <button aria-label="Close menu" onClick={() => setOpen(false)} style={{ alignSelf: 'flex-end', fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)' }}>
            ✕
          </button>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginTop: '2rem' }}>
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                style={{ fontFamily: 'var(--ff-display)', fontSize: '1.6rem', padding: '.6rem 0', borderBottom: '1px solid var(--line)', textDecoration: 'none', color: 'var(--ink)' }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: block !important; }
          .mobile-only { display: none !important; }
        }
      `}</style>
    </header>
  );
}
