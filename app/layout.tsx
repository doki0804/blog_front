// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import AppInitializer from '@/components/AppInitializer'

export const metadata: Metadata = {
  title: '블로그',
  description: '얌얌이 블로그',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex">
        <AppInitializer />
        <Navbar />
        <main className="ml-64 p-6 w-full">{children}</main>
      </body>
    </html>
  )
}
