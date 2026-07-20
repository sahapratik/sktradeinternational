import Link from 'next/link';
import { countNewQuoteRequests, countOpenConversations, countProducts } from '@/db';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [newQuotes, openConversations, totalProducts] = await Promise.all([
    countNewQuoteRequests(),
    countOpenConversations(),
    countProducts(),
  ]);

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '1rem' }}>
        <Link href="/admin/quotes" className="card" style={{ padding: '1.4rem', textDecoration: 'none', display: 'block' }}>
          <div style={{ fontSize: '2rem', fontFamily: 'var(--ff-display)', color: 'var(--ink)' }}>{newQuotes}</div>
          <div style={{ fontSize: '.85rem', color: 'var(--ink-soft)' }}>New quote requests</div>
        </Link>
        <Link href="/admin/support" className="card" style={{ padding: '1.4rem', textDecoration: 'none', display: 'block' }}>
          <div style={{ fontSize: '2rem', fontFamily: 'var(--ff-display)', color: 'var(--ink)' }}>{openConversations}</div>
          <div style={{ fontSize: '.85rem', color: 'var(--ink-soft)' }}>Open conversations</div>
        </Link>
        <div className="card" style={{ padding: '1.4rem' }}>
          <div style={{ fontSize: '2rem', fontFamily: 'var(--ff-display)' }}>{totalProducts}</div>
          <div style={{ fontSize: '.85rem', color: 'var(--ink-soft)' }}>Published products</div>
        </div>
      </div>
    </div>
  );
}
