import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../styles/globals.scss';

export const metadata: Metadata = {
  title: 'JetStyle — Unit-Calc',
  description:
    'Мини-версия калькулятора для быстрой оценки экономики гипотез рекламных каналов.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'JetStyle — Unit-Calc',
    description:
      'Мини-версия калькулятора для быстрой оценки экономики гипотез рекламных каналов.',
    url: 'https://jetstyle.ru',
    siteName: 'JetStyle',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JetStyle — Unit-Calc',
    description:
      'Мини-версия калькулятора для быстрой оценки экономики гипотез рекламных каналов.',
  },
  manifest: '/site.webmanifest', // если добавишь webmanifest в /public
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        {/* Meta fallback на случай, если Next не внедрит icon-теги */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}