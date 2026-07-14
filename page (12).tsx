:root {
  --bg: #faf7f1;
  --bg-alt: #f1ece1;
  --surface: #ffffff;
  --surface-2: #f7f2e8;
  --ink: #221f1b;
  --ink-soft: #5b5449;
  --ink-faint: #948c7c;
  --line: #e3dbcb;
  --line-strong: #d0c4ac;
  --copper: #8f6a2e;
  --copper-soft: #b98f4e;
  --copper-tint: #f1e7d3;
  --kiln: #b34a22;
  --focus: #8f6a2e;
  --r-sm: 6px;
  --r: 14px;
  --r-lg: 22px;
  --ff-display: 'Fraunces', ui-serif, Georgia, serif;
  --ff-body: 'Manrope', -apple-system, 'Segoe UI', sans-serif;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --maxw: 1280px;
}

[data-theme='dark'] {
  --bg: #14120e;
  --bg-alt: #1b1712;
  --surface: #1f1a15;
  --surface-2: #241f18;
  --ink: #f3eee3;
  --ink-soft: #b6ac9b;
  --ink-faint: #766e5d;
  --line: #332c22;
  --line-strong: #453b2c;
  --copper: #f0c570;
  --copper-soft: #c99b5a;
  --copper-tint: #2c2415;
  --kiln: #e2794a;
  --focus: #f0c570;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--ff-body);
  line-height: 1.55;
  transition: background 0.35s var(--ease), color 0.35s var(--ease);
}
h1, h2, h3, h4 { font-family: var(--ff-display); margin: 0; font-weight: 600; letter-spacing: -0.01em; }
a { color: inherit; }
img { max-width: 100%; display: block; }
.wrap { max-width: var(--maxw); margin-inline: auto; padding-inline: clamp(1.25rem, 4vw, 3rem); }
.section { padding-block: clamp(3.5rem, 7vw, 6.5rem); }
.section-alt { background: var(--bg-alt); }
.eyebrow {
  font-size: 0.78rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--copper);
  font-weight: 700; display: flex; align-items: center; gap: 0.5em; margin-bottom: 0.9em;
}
.eyebrow::before { content: ''; width: 22px; height: 1.5px; background: var(--copper); display: inline-block; }
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.55em;
  font-weight: 700; font-size: 0.95rem; padding: 0.9em 1.5em; border-radius: 999px;
  border: 1px solid transparent; cursor: pointer; transition: transform 0.25s var(--ease);
  text-decoration: none; white-space: nowrap;
}
.btn:hover { transform: translateY(-2px); }
.btn--primary { background: var(--ink); color: var(--bg); }
[data-theme='dark'] .btn--primary { background: var(--copper); color: #1b1712; }
.btn--ghost { background: transparent; border-color: var(--line-strong); color: var(--ink); }
.btn--ghost:hover { border-color: var(--copper); color: var(--copper); }
.card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r);
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}
.card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px -20px rgba(34, 31, 27, 0.25); }
:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
