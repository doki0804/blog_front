'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/stores/useAppStore'
import TabManager from '@/components/TapManager'

export default function AdminTabPage() {
  const user = useAppStore((state) => state.user)
  const router = useRouter()

  useEffect(() => {
    if (user && !user.is_admin) {
      alert('접근 권한이 없습니다.') // ✅ 추가됨: 관리자 외 접근 차단
      router.push('/')
    }
  }, [user])

  return user?.is_admin ? <TabManager /> : null // ✅ 추가됨: 조건부 렌더링
}
