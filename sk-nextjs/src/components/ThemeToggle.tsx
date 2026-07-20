'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setTheme((document.documentElement.getAttribute('data-theme') as 'light' | 'dark') ?? 'light');
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setTheme(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: '1px solid transparent',
        background: 'transparent',
        color: 'var(--ink)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.1rem',
      }}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
