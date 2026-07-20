'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import SiteLogo from './SiteLogo';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/products', label: 'Products' },
  { href: '/industries', label: 'Industries' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/partners', label: 'Partners' },
  { href: '/insights', label: 'Insights' },
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
        background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} aria-label="SK Trade International">
          <SiteLogo height={24} />
        </Link>

        <nav aria-label="Primary" className="desktop-nav" style={{ display: 'none' }}>
          <ul style={{ display: 'flex', gap: '1.6rem', listStyle: 'none', margin: 0, padding: 0 }}>
            {NAV.slice(0, -1).map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="nav-link">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <ThemeToggle />
          <Link href="/contact" className="btn btn--primary" style={{ padding: '.7em 1.3em', fontSize: '.86rem' }}>
            Request a Quote
          </Link>
          <button
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="mobile-only icon-btn"
          >
            ≡
          </button>
        </div>
      </div>

      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        style={{
          position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 600,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .4s cubic-bezier(.22,1,.36,1)',
          padding: '1.5rem', display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SiteLogo height={22} />
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="icon-btn">✕</button>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '.2rem', marginTop: '2rem' }}>
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', padding: '.55rem 0', borderBottom: '1px solid var(--line)', textDecoration: 'none', color: 'var(--ink)' }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" onClick={() => setOpen(false)} className="btn btn--primary" style={{ marginTop: '1.5rem', justifyContent: 'center' }}>
          Request a Quote
        </Link>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: block !important; }
          .mobile-only { display: none !important; }
        }
        .icon-btn {
          width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--line);
          background: var(--surface); color: var(--ink); cursor: pointer; font-size: 1.1rem;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .nav-link { text-decoration: none; color: var(--ink-soft); font-weight: 600; font-size: .92rem; position: relative; padding-bottom: 3px; transition: color .2s; }
        .nav-link::after { content: ''; position: absolute; left: 0; right: 100%; bottom: -1px; height: 1.5px; background: var(--copper); transition: right .25s cubic-bezier(.22,1,.36,1); }
        .nav-link:hover { color: var(--copper); }
        .nav-link:hover::after { right: 0; }
      `}</style>
    </header>
  );
}
