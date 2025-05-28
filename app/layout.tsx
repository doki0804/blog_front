import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import AppInitializer from '@/components/AppInitializer'
import QueryProvider from '@/app/providers/QueryProvider'

export const metadata: Metadata = {
  title: 'My Blog',
  description: 'A modern Next.js blog with FastAPI backend',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <AppInitializer>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6">
                  {children}
                </main>
              </div>
            </div>
          </AppInitializer>
        </QueryProvider>
      </body>
    </html>
  )
}
