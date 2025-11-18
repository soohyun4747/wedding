import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '광은 ♥ 수현 결혼식에 초대합니다',
  description: '2026년 3월 2일 월요일 오후 12시 30분',
  openGraph: {
    title: '광은 ♥ 수현 결혼식에 초대합니다',
    description: '2026년 3월 2일 월요일 오후 12시 30분',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}