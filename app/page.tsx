'use client'

import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import axios from '@/lib/axios'

export type Post = {
  id: number
  title: string
  preview: string
  created_at: string
}

export default function HomePage() {
  const searchParams = useSearchParams()
  const tabId = searchParams.get('tab')

  // ✅ posts 목록 fetch (react-query)
  const {
    data: posts = [],
    isLoading,
    error,
  } = useQuery<Post[]>({
    queryKey: ['posts', tabId],
    queryFn: async () => {
      const url = tabId ? `/posts?tab_id=${tabId}` : '/posts'
      const res = await axios.get(url)
      return res.data
    },
    staleTime: 1000 * 60,
  })

  if (isLoading) return <div>로딩 중...</div>
  if (error) return <div>게시글을 불러오지 못했습니다.</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">게시글 목록</h1>
      {posts.length ? posts.map(post => (
        <div key={post.id} className="border-b pb-4">
          <Link href={`/posts/${post.id}`}>
            <h3 className="text-lg font-semibold text-blue-600 hover:underline">{post.title}</h3>
          </Link>
          <p className="text-gray-600">{post.preview}</p>
          <span className="text-sm text-gray-400">{new Date(post.created_at).toLocaleString()}</span>
        </div>
      )) : (
        <p>해당 탭에 게시글이 없습니다.</p>
      )}
    </div>
  )
}