import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Main/Providers';
import { Header } from '@/components/Main/Header';
import { Footer } from '@/components/Main/Footer';

export const metadata: Metadata = {
  title: 'Student Support Portal',
  description: 'Портал для безопасной учебной поддержки: консультации, рейтинги, материалы, ИИ-помощник и администрирование.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <div className="min-h-screen">
            <Header />
            <main className="container-shell py-8">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
