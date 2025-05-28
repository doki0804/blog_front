'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchUser } from '@/lib/user'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import TabManager from '@/components/AdminTabManager'

export default function AdminTabPage() {  
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60,
  });
  const router = useRouter()

  useEffect(() => {
    if (user && !user.is_admin) {
      alert('관리자만 접근할 수 있습니다.') // ✅ 추가됨
      router.replace('/') // ✅ 홈으로 강제 이동
    }
  }, [user])

  if (!user || !user.is_admin) return null

  return <TabManager />
}
