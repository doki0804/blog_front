'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useAppStore } from '@/stores/useAppStore'

type Tab = {
  id: number
  name: string
  is_hidden: boolean
}

export default function TabManager() {
  const { tabs, refreshTabs } = useAppStore()
  const [newTabName, setNewTabName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    refreshTabs()
  }, [])

  const handleCreate = async () => {
    if (!newTabName.trim()) return
    setIsLoading(true)
    await axios.post('/tabs', { name: newTabName }) // ✅ 추가됨: 탭 생성
    setNewTabName('')
    await refreshTabs() // ✅ 수정됨: 상태 갱신
    setIsLoading(false)
  }

  const handleToggle = async (tab: Tab) => {
    await axios.patch(`/tabs/${tab.id}`, { is_hidden: !tab.is_hidden }) // ✅ 추가됨: 숨김 상태 토글
    await refreshTabs()
  }

  const handleDelete = async (tab: Tab) => {
    if (confirm(`${tab.name} 탭을 삭제할까요?`)) {
      await axios.delete(`/tabs/${tab.id}`) // ✅ 추가됨: 탭 삭제
      await refreshTabs()
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">탭 관리</h1>

      <div className="flex gap-2">
        <input
          value={newTabName}
          onChange={(e) => setNewTabName(e.target.value)}
          placeholder="새 탭 이름"
          className="border p-2"
        />
        <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2" disabled={isLoading}>
          추가
        </button>
      </div>

      <ul className="divide-y">
        {tabs.map((tab) => (
          <li key={tab.id} className="py-2 flex items-center justify-between">
            <span>{tab.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleToggle(tab)}
                className={`px-3 py-1 rounded ${tab.is_hidden ? 'bg-gray-400' : 'bg-green-500'} text-white`}
              >
                {tab.is_hidden ? '숨김' : '표시'}
              </button>
              <button
                onClick={() => handleDelete(tab)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}