import Link from 'next/link';
import SiteLogo from './SiteLogo';
import Icon from './Icon';

export default function SiteFooter() {
  return (
    <footer style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--line)', padding: '3rem 0 1.5rem', marginTop: '2rem' }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(3, 1fr)', gap: '2rem' }}>
        <div>
          <div style={{ marginBottom: '.8rem' }}>
            <SiteLogo height={22} />
          </div>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', maxWidth: '32ch' }}>
            Ceramic raw materials, machinery and technical support for Bangladesh&apos;s tableware, tile and
            sanitaryware manufacturers, since 2008.
          </p>
        </div>
        <div>
          <h5 style={footerH5}>Explore</h5>
          <ul style={footerUl}>
            <li><Link href="/products" style={footerA}>Products</Link></li>
            <li><Link href="/industries" style={footerA}>Industries</Link></li>
            <li><Link href="/solutions" style={footerA}>Solutions</Link></li>
            <li><Link href="/gallery" style={footerA}>Gallery</Link></li>
            <li><Link href="/partners" style={footerA}>Partners</Link></li>
          </ul>
        </div>
        <div>
          <h5 style={footerH5}>Company</h5>
          <ul style={footerUl}>
            <li><Link href="/about" style={footerA}>About</Link></li>
            <li><Link href="/insights" style={footerA}>Insights</Link></li>
            <li><Link href="/contact" style={footerA}>Contact</Link></li>
            <li><Link href="/admin/login" style={footerA}>Admin</Link></li>
          </ul>
        </div>
        <div>
          <h5 style={footerH5}>Contact</h5>
          <ul style={{ ...footerUl, gap: '.65rem' }}>
            <li style={{ display: 'flex', gap: '.55rem' }}><span style={{ color: 'var(--copper)', marginTop: '.15em' }}><Icon name="pin" /></span><span style={{ color: 'var(--ink-soft)', fontSize: '.88rem' }}>Grand Plaza Shopping Mall, Office No. 308, 3rd Floor, Wireless, Moghbazar, Dhaka-1217, Bangladesh</span></li>
            <li style={{ display: 'flex', gap: '.55rem' }}><span style={{ color: 'var(--copper)' }}><Icon name="phone" /></span><span style={{ color: 'var(--ink-soft)', fontSize: '.88rem' }}>+880 1715-531422</span></li>
            <li style={{ display: 'flex', gap: '.55rem' }}><span style={{ color: 'var(--copper)' }}><Icon name="mail" /></span><span style={{ color: 'var(--ink-soft)', fontSize: '.88rem' }}>info@sktradeinternational.net</span></li>
          </ul>
        </div>
      </div>
      <div className="wrap" style={{ marginTop: '2rem', paddingTop: '1.2rem', borderTop: '1px solid var(--line)', fontSize: '.82rem', color: 'var(--ink-faint)', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between' }}>
        <span>© {new Date().getFullYear()} SK Trade International. All rights reserved. · Crafted by Pratik Studios</span>
      </div>
      <style>{`
        @media (max-width: 860px) { footer .wrap:first-of-type { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { footer .wrap:first-of-type { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}

const footerH5: React.CSSProperties = { fontSize: '.78rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ink-faint)', marginBottom: '1rem', fontWeight: 800 };
const footerUl: React.CSSProperties = { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '.6rem' };
const footerA: React.CSSProperties = { textDecoration: 'none', color: 'var(--ink-soft)', fontSize: '.9rem' };
