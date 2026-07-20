import { getQuoteRequests } from '@/db';

export const dynamic = 'force-dynamic';

export default async function AdminQuotesPage() {
  const quotes = await getQuoteRequests(100);

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Quote Requests</h1>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
              <th style={th}>Ref</th>
              <th style={th}>Contact</th>
              <th style={th}>Sector</th>
              <th style={th}>Items</th>
              <th style={th}>Status</th>
              <th style={th}>Received</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={td}><strong>{q.ref_number}</strong></td>
                <td style={td}>{q.contact_name}<br /><span style={{ color: 'var(--ink-faint)' }}>{q.contact_email}</span></td>
                <td style={td}>{q.sector}</td>
                <td style={td}>{q.items.map((i) => i.product_name).join(', ') || '—'}</td>
                <td style={td}>
                  <span style={{ padding: '.2em .6em', borderRadius: 999, background: 'var(--copper-tint)', color: 'var(--copper)', fontSize: '.78rem', fontWeight: 700 }}>
                    {q.status}
                  </span>
                </td>
                <td style={td}>{new Date(q.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {quotes.length === 0 && <p style={{ color: 'var(--ink-faint)', marginTop: '1rem' }}>No quote requests yet — try submitting the live form at /contact.</p>}
      </div>
    </div>
  );
}

const th: React.CSSProperties = { padding: '.7rem .5rem', fontSize: '.76rem', textTransform: 'uppercase', color: 'var(--ink-faint)' };
const td: React.CSSProperties = { padding: '.7rem .5rem', verticalAlign: 'top' };
