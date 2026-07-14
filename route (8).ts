import { getConversations } from '@/db';

export const dynamic = 'force-dynamic';

export default async function AdminSupportPage() {
  const conversations = getConversations(100);

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Support Conversations</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {conversations.map((c) => (
          <div key={c.id} className="card" style={{ padding: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem', marginBottom: '.6rem' }}>
              <strong style={{ fontSize: '.9rem' }}>{c.ticket_id}</strong>
              <span style={{ fontSize: '.76rem', color: 'var(--ink-faint)' }}>
                {c.channel} · {c.status} · {new Date(c.last_message_at).toLocaleString()}
              </span>
            </div>
            {c.messages.map((m) => (
              <div key={m.id} style={{ fontSize: '.85rem', padding: '.4rem 0', color: m.direction === 'inbound' ? 'var(--ink)' : 'var(--copper)' }}>
                <strong>{m.direction === 'inbound' ? 'Visitor' : 'Agent'}:</strong> {m.body}
              </div>
            ))}
          </div>
        ))}
        {conversations.length === 0 && (
          <p style={{ color: 'var(--ink-faint)' }}>No conversations yet — try the live chat form at /contact, or send a test webhook (see README).</p>
        )}
      </div>
    </div>
  );
}
