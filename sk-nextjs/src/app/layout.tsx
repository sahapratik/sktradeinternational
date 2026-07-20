import type { Metadata } from 'next';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope/800.css';
import '@fontsource/fraunces/500.css';
import '@fontsource/fraunces/600.css';
import '@fontsource/fraunces/700.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import IconSprite from '@/components/IconSprite';
import './globals.css';

export const metadata: Metadata = {
  title: 'SK Trade International — Ceramic Materials, Machinery & Technical Support',
  description:
    "SK Trade International supplies globally sourced ceramic raw materials, machinery and kiln furniture to Bangladesh's tableware, tile and sanitaryware manufacturers, since 2008.",
  icons: { icon: '/favicon.png' },
};

const themeInitScript = `
(function(){
  try {
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <IconSprite />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
