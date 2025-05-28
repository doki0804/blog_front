'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import axios from '@/lib/axios'
import { fetchUser } from '@/lib/user'
import { Tab } from '@/types/tab'
import { User } from '@/types/user'

const canAccess = (user: User | null, tab: Tab): boolean => {
  if (tab.is_hidden && !user?.is_admin) return false
  if (tab.required_role === 'guest') return true
  if (tab.required_role === 'member' && user) return true
  if (tab.required_role === 'admin' && user?.is_admin) return true
  return false
}

export default function Sidebar() {
  // 🚩 탭 목록 fetch (react-query)
  const {
    data: tabs = [],
    isLoading: isTabsLoading,
    error: tabsError
  } = useQuery<Tab[]>({
    queryKey: ['tabs'],
    queryFn: async () => {
      const res = await axios.get('/tabs')
      return res.data
    },
    staleTime: 1000 * 60,
  })

  // 🚩 유저 정보 fetch (react-query)
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError
  } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60,
  })

  if (isTabsLoading || isUserLoading) return (
    <aside className="w-64 p-4 border-r h-screen overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">탭 메뉴</h2>
      <div>로딩 중...</div>
    </aside>
  )
  if (tabsError) return (
    <aside className="w-64 p-4 border-r h-screen overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">탭 메뉴</h2>
      <div>탭을 불러오지 못했습니다.</div>
    </aside>
  )

  return (
    <aside className="w-64 p-4 border-r h-screen overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">탭 메뉴</h2>
      <ul className="space-y-2">
        {tabs.filter((tab) => canAccess(user ?? null, tab)).map((tab) => (
          <li key={tab.id}>
            <Link href={`/tabs/${tab.id}`} className="block p-2 rounded hover:bg-gray-100">
              {tab.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}