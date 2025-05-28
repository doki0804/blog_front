'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useAppStore } from '@/stores/useAppStore'

export default function Navbar() {
  const { user, tabs, refreshTabs } = useAppStore()

  useEffect(() => {
    refreshTabs()
  }, [])

  return (
    <nav className="w-64 h-screen fixed bg-gray-100 p-4">
      <h2 className="text-xl mb-4">탭</h2>
      <ul className="space-y-2">
        <li><Link href="/">전체 게시글</Link></li>
        {tabs.filter(tab => !tab.is_hidden).map(tab => (
          <li key={tab.id}>
            <Link href={`/?tab=${tab.id}`}>{tab.name}</Link>
          </li>
        ))}
        <li><Link href="/write">글쓰기</Link></li>
        {user?.is_admin && <li><Link href="/admin/tabs">탭 관리</Link></li>}
        <li><Link href="/login">로그인</Link></li>
      </ul>
    </nav>
  )
}
