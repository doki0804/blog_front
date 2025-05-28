'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useAppStore } from '@/stores/useAppStore'
import axios from '@/lib/axios'
import Link from 'next/link'

type Post = {
  id: number
  title: string
  content: string
  created_at: string
  author: {
    id: number
    email: string
  }
}

export default function PostDetail() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  const user = useAppStore(state => state.user)

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ['post', postId],
    queryFn: async () => {
      const res = await axios.get(`/posts/${postId}`)
      return res.data
    },
    enabled: !!postId,
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`/posts/${postId}`) // ✅ 추가됨: 삭제 API
    },
    onSuccess: () => {
      alert('게시글이 삭제되었습니다.')
      router.push('/')
    },
    onError: () => {
      alert('삭제 실패: 권한이 없거나 오류가 발생했습니다.')
    },
  })

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteMutation.mutate()
    }
  }

  const handleEdit = () => {
    router.push(`/write?id=${post?.id}`) // ✅ 추가됨: 수정 진입 (id 쿼리 전달)
  }

  if (isLoading) return <div>로딩 중...</div>
  if (error || !post) return <div>게시글을 불러올 수 없습니다.</div>

  const isOwner = user?.id === post.author.id

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <div className="text-sm text-gray-500">
        작성자: {post.author.email} | {new Date(post.created_at).toLocaleString()}
      </div>

      {isOwner && (
        <div className="flex gap-2 mt-4">
          <button onClick={handleEdit} className="bg-yellow-500 text-white px-4 py-2 rounded">수정</button>
          <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">삭제</button>
        </div>
      )}
    </div>
  )
}
