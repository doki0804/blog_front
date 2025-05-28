'use client'

import { notFound, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '@/lib/axios'
import { fetchUser } from "@/lib/user";
import Link from 'next/link'

export type Post = {
  id: number
  title: string
  content: string
  author: {
    id: number
    nickname: string
  }
  tab_id: number
  created_at: string
}

export type Comment = {
  id: number
  content: string
  author: {
    nickname: string
  }
  created_at: string
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const postId = parseInt(params.id)
  const router = useRouter()
  const queryClient = useQueryClient()
  // 유저 데이터 fetch
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

  const { data: post, error } = useQuery<Post>({
    queryKey: ['post', postId],
    queryFn: async () => {
      const res = await axios.get(`/posts/${postId}`)
      return res.data
    }
  })

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await axios.get(`/posts/${postId}/comments`)
      return res.data
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`/posts/${postId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      router.push(`/tabs/${post?.tab_id}`)
    }
  })

  useEffect(() => {
    if (error) notFound()
  }, [error])

  const isAuthor = post?.author.id === user?.id || user?.is_admin

  return (
    <article className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{post?.title}</h1>
      <div className="text-sm text-gray-500">
        작성자: {post?.author.nickname} • {new Date(post?.created_at ?? '').toLocaleString()}
      </div>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post?.content ?? '' }}
      />

      {isAuthor && (
        <div className="flex gap-2">
          <Link
            href={`/write?id=${post?.id}`}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            수정
          </Link>
          <button
            onClick={() => {
              if (confirm('정말 삭제하시겠습니까?')) deleteMutation.mutate()
            }}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            삭제
          </button>
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">댓글</h2>
        {comments.length === 0 ? (
          <p>아직 댓글이 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {comments.map((comment) => (
              <li key={comment.id} className="border p-3 rounded">
                <div className="text-sm text-gray-500">
                  {comment.author.nickname} • {new Date(comment.created_at).toLocaleString()}
                </div>
                <div>{comment.content}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  )
}