'use client';

import { useEffect, useRef } from 'react';

/**
 * One <img>, not two overlapping ones toggled by CSS. The static-site build
 * had a real bug (twice) from exactly that pattern: a CSS rule scoped to one
 * wrapper class didn't reach a different wrapper elsewhere on the page, so
 * both logo variants rendered at once. A MutationObserver on `data-theme`
 * means this component needs zero coordination with whatever else on the
 * page changes the theme — it just reacts.
 */
export default function SiteLogo({ height = 24, alt = 'SK Trade International' }: { height?: number; alt?: string }) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const apply = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      img.src = theme === 'dark' ? '/logo-dark.png' : '/logo-light.png';
    };
    apply();

    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={imgRef} alt={alt} style={{ height, width: 'auto' }} />;
}
