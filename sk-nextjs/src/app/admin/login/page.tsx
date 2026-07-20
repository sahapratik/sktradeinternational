'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Invalid email or password.');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <main className="wrap" style={{ maxWidth: 380, margin: '5rem auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Admin sign in</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '.9rem', textAlign: 'left' }}>
        <label style={{ fontSize: '.85rem', fontWeight: 700 }}>
          Email
          <input name="email" type="email" required style={inputStyle} />
        </label>
        <label style={{ fontSize: '.85rem', fontWeight: 700 }}>
          Password
          <input name="password" type="password" required style={inputStyle} />
        </label>
        {error && <p style={{ color: 'var(--kiln)', fontSize: '.85rem' }}>{error}</p>}
        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p style={{ fontSize: '.78rem', color: 'var(--ink-faint)', marginTop: '1.5rem' }}>
        Seeded demo account: admin@sktradeinternational.net — see README for the password.
      </p>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  display: 'block', width: '100%', marginTop: '.4rem', padding: '.75em .9em', borderRadius: 'var(--r-sm)',
  border: '1px solid var(--line-strong)', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: '.92rem',
};
