'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '@/lib/axios'
import { fetchUser } from '@/lib/user'
import { notFound } from 'next/navigation'

export type Tab = {
  id: number
  name: string
  is_hidden: boolean
}

export default function AdminTabManager() {
  const queryClient = useQueryClient()
  const [newTabName, setNewTabName] = useState('')

  // 🚩 user 정보 fetch (react-query)
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

  // 🚩 탭 추가
  const addTabMutation = useMutation({
    mutationFn: async () => {
      await axios.post('/tabs', { name: newTabName })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabs'] })
      setNewTabName('')
    }
  })

  // 🚩 탭 삭제
  const deleteTabMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/tabs/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabs'] })
    }
  })

  // 🚩 탭 숨김/보이기 토글
  const toggleTabVisibility = useMutation({
    mutationFn: async (tab: Tab) => {
      await axios.patch(`/tabs/${tab.id}`, { is_hidden: !tab.is_hidden })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabs'] })
    }
  })

  // 🚩 어드민 인증 미통과시 notFound 처리
  useEffect(() => {
    if (!isUserLoading && (!user || !user.is_admin || userError)) {
      notFound()
    }
  }, [user, isUserLoading, userError])

  if (isUserLoading || isTabsLoading) {
    return <p>불러오는 중...</p>
  }
  if (tabsError) {
    return <p>탭을 불러오는 데 실패했습니다.</p>
  }

  return (
    <section className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">탭 관리</h1>

      <div className="flex gap-2">
        <input
          value={newTabName}
          onChange={(e) => setNewTabName(e.target.value)}
          placeholder="새 탭 이름"
          className="border px-2 py-1 rounded w-full"
        />
        <button
          onClick={() => newTabName && addTabMutation.mutate()}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          추가
        </button>
      </div>

      <ul className="space-y-2">
        {tabs.map((tab) => (
          <li key={tab.id} className="border p-3 rounded flex justify-between items-center">
            <span className={tab.is_hidden ? 'text-gray-400' : ''}>{tab.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => toggleTabVisibility.mutate(tab)}
                className="text-sm px-2 py-1 border rounded"
              >
                {tab.is_hidden ? '보이기' : '숨기기'}
              </button>
              <button
                onClick={() => deleteTabMutation.mutate(tab.id)}
                className="text-sm px-2 py-1 border border-red-500 text-red-500 rounded"
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}