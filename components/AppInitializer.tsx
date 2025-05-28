'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchUser } from '@/lib/user'

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  // 클라이언트 환경에서만 localStorage 체크
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    enabled: !!token, // 🚩 토큰이 있을 때만 요청
    retry: false,
    staleTime: 1000 * 60,
  })

  return <>{children}</>
}