export default function SiteFooter() {
  return (
    <footer style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--line)', padding: '3rem 0 1.5rem', marginTop: '2rem' }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
        <div>
          <div style={{ fontFamily: 'var(--ff-display)', fontWeight: 600, color: 'var(--copper)', marginBottom: '.6rem' }}>SK Trade International</div>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', maxWidth: '32ch' }}>
            Ceramic raw materials, machinery and technical support for Bangladesh&apos;s tableware, tile and sanitaryware manufacturers, since 2008.
          </p>
        </div>
        <div>
          <h5 style={{ fontSize: '.78rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ink-faint)', marginBottom: '.8rem' }}>Contact</h5>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', margin: '0 0 .5rem' }}>Grand Plaza Shopping Mall, Office No. 308, 3rd Floor, Wireless, Moghbazar, Dhaka-1217, Bangladesh</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', margin: '0 0 .3rem' }}>+880 1715-531422</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', margin: 0 }}>info@sktradeinternational.net</p>
        </div>
      </div>
      <div className="wrap" style={{ marginTop: '2rem', paddingTop: '1.2rem', borderTop: '1px solid var(--line)', fontSize: '.82rem', color: 'var(--ink-faint)' }}>
        © {new Date().getFullYear()} SK Trade International. All rights reserved. · Crafted by Pratik Studios
      </div>
    </footer>
  );
}
