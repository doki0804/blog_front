'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/stores/useAppStore'

export default function AppInitializer() {
  const refreshUser = useAppStore((state) => state.refreshUser)

  useEffect(() => {
    refreshUser()
  }, [])

  return null // 이 컴포넌트는 렌더링할 UI 없음
}
