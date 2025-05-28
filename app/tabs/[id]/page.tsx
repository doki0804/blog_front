'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import axios from '@/lib/axios'
import { fetchUser } from '@/lib/user'
import Link from 'next/link'

// 타입 정의 (예시)
type Tab = {
  id: number
  name: string
  required_role: 'guest' | 'member' | 'admin'
  is_hidden: boolean
}

type Post = {
  id: number
  title: string
  content: string
  created_at: string
  author: { nickname: string }
  tab_id: number
}

// 권한 체크 함수
const canAccess = (user: any, tab: Tab) => {
  if (tab.is_hidden && !user?.is_admin) return false
  if (tab.required_role === 'guest') return true
  if (tab.required_role === 'member' && user) return true
  if (tab.required_role === 'admin' && user?.is_admin) return true
  return false
}

export default function TabDetailPage({ params }: { params: { id: string } }) {
  const tabId = parseInt(params.id)

  // 탭 목록 fetch
  const {
    data: tabs = [],
    isLoading: isTabsLoading,
    error: tabsError,
  } = useQuery<Tab[]>({
    queryKey: ['tabs'],
    queryFn: async () => {
      const res = await axios.get('/tabs')
      return res.data
    },
    staleTime: 1000 * 60,
  })

  // 유저 fetch
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60,
  })

  // 게시글 목록 fetch (또는 상세 fetch)
  const {
    data: posts = [],
    isLoading: isPostsLoading,
    error: postsError,
  } = useQuery<Post[]>({
    queryKey: ['posts', tabId],
    queryFn: async () => {
      const res = await axios.get(`/tabs/${tabId}/posts`)
      return res.data
    },
    enabled: !!tabs.length,
    staleTime: 1000 * 60,
  })

  // 탭 정보 조회
  const tab = tabs.find((t) => t.id === tabId)

  if (isTabsLoading || isUserLoading || isPostsLoading) return <div>로딩 중...</div>
  if (tabsError || postsError) return <div>데이터를 불러오지 못했습니다.</div>
  if (!tab) return <div>존재하지 않는 탭입니다.</div>

  // 🚩 권한 분기 처리
  if (!canAccess(user, tab)) {
    return (
      <div className="text-red-500 text-center mt-12">
        <div>
          이 탭을 보기 위해서는
          {tab.required_role === 'member' && ' 로그인'}
          {tab.required_role === 'admin' && ' 관리자 권한'}
          이 필요합니다.
        </div>
        {tab.required_role !== 'guest' && (
          <Link href="/login" className="text-blue-600 underline block mt-2">
            로그인 하러가기
          </Link>
        )}
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">{tab.name} 게시글</h1>
      {posts.length === 0 ? (
        <p>게시글이 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {posts.map((post) => (
            <li key={post.id} className="border p-4 rounded">
              <Link href={`/posts/${post.id}`} className="text-xl font-semibold hover:underline">
                {post.title}
              </Link>
              <div className="text-sm text-gray-500">
                by {post.author.nickname} • {new Date(post.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}