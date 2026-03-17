import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '관리자 대시보드',
  description: '회원 승인 관리 페이지',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
