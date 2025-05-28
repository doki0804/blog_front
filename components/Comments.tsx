'use client'

import axios from '@/lib/axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchUser } from '@/lib/user'
import { Comment } from '@/types/comment'
import { useState } from 'react'

export default function Comments({ postId }: { postId: number }) {
  const queryClient = useQueryClient()
  const [newComment, setNewComment] = useState('')

  // 🚩 유저 정보 fetch
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

  // 🚩 댓글 목록 fetch
  const {
    data: comments = [],
    isLoading: isCommentsLoading,
    error: commentsError
  } = useQuery<Comment[]>({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await axios.get(`/posts/${postId}/comments`)
      return res.data
    },
    staleTime: 1000 * 30, // 30초
  })

  // 🚩 댓글 작성 mutation
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await axios.post(`/posts/${postId}/comments`, { content })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      setNewComment('')
    },
  })

  // 🚩 댓글 삭제 mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/comments/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })

  // 🚩 댓글 제출 핸들러
  const handleSubmit = () => {
    if (newComment.trim()) {
      addCommentMutation.mutate(newComment)
    }
  }

  // 🚩 댓글 삭제 핸들러
  const handleDelete = (id: number) => {
    deleteCommentMutation.mutate(id)
  }

  if (isCommentsLoading || isUserLoading) return <div>로딩 중...</div>
  if (commentsError) return <div>댓글을 불러오지 못했습니다.</div>

  return (
    <section className="mt-8 space-y-4">
      <h2 className="text-xl font-bold">댓글</h2>

      <div className="space-y-2">
        {comments.map((comment) => (
          <div key={comment.id} className="border p-3 rounded">
            <div className="text-sm text-gray-600">
              {comment.author_name} • {new Date(comment.created_at).toLocaleString()}
            </div>
            <p>{comment.content}</p>
            {(user?.is_admin || user?.id === comment.author_id) && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="text-sm text-red-600 mt-1"
              >
                삭제
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          placeholder="댓글을 입력하세요"
          className="w-full border p-2"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-1 rounded mt-2"
          disabled={addCommentMutation.isPending}
        >
          댓글 작성
        </button>
      </div>
    </section>
  )
}