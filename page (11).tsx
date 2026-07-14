import Link from 'next/link';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/session';
import LogoutButton from '@/components/LogoutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Deliberately re-verified here, not just trusted from middleware — see the
  // comment in src/middleware.ts on why this project treats middleware as one
  // layer, not the only layer, given Next.js's middleware-bypass CVE history.
  const token = cookies().get('sk_admin_session')?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    // Not authenticated — this only renders for /admin/login, since middleware
    // already redirects everything else. Render children with no admin chrome.
    return <div style={{ minHeight: '100vh' }}>{children}</div>;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <aside style={{ width: 220, borderRight: '1px solid var(--line)', padding: '1.5rem', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--ff-display)', fontWeight: 600, marginBottom: '2rem', color: 'var(--copper)' }}>SK Admin</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
          <Link href="/admin" style={navLink}>Dashboard</Link>
          <Link href="/admin/quotes" style={navLink}>Quote Requests</Link>
          <Link href="/admin/support" style={navLink}>Support Conversations</Link>
        </nav>
        <div style={{ marginTop: '2rem' }}>
          <LogoutButton />
        </div>
        <p style={{ fontSize: '.72rem', color: 'var(--ink-faint)', marginTop: '1.5rem' }}>Role: {session.role}</p>
      </aside>
      <main style={{ flex: 1, padding: '2rem' }}>{children}</main>
    </div>
  );
}

const navLink: React.CSSProperties = { fontSize: '.9rem', color: 'var(--ink-soft)', textDecoration: 'none', padding: '.4rem 0' };
