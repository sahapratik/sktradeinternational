'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      style={{ fontSize: '.82rem', color: 'var(--ink-faint)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      Sign out
    </button>
  );
}
