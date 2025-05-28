'use client'

import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import axios from '@/lib/axios'
import { fetchUser } from '@/lib/user'
import { Tab } from '@/types/tab'
import Link from 'next/link'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

type PostForm = {
  title: string
  tab_id: string
  content: string
}

type Post = {
  id: number
  title: string
  content: string
  tab_id: number
}

export default function WritePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const postId = searchParams.get('id')
  const isEditMode = !!postId

  // 🚩 [user fetch: react-query]
  const { data: user, isLoading: isUserLoading, error: userError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60,
  })

  // 🚩 [tabs fetch: react-query]
  const { data: tabs = [], isLoading: isTabsLoading, error: tabsError } = useQuery<Tab[]>({
    queryKey: ['tabs'],
    queryFn: async () => {
      const res = await axios.get('/tabs')
      return res.data
    },
    staleTime: 1000 * 60,
  })

  // 🚩 [edit mode: post fetch]
  const { data: post, isLoading: isPostLoading, error: postError } = useQuery<Post>({
    queryKey: ['post', postId],
    queryFn: async () => {
      const res = await axios.get(`/posts/${postId}`)
      return res.data
    },
    enabled: isEditMode,
    staleTime: 1000 * 60,
  })

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<PostForm>({
    defaultValues: {
      title: '',
      content: '',
      tab_id: '',
    },
  })

  const selectedTabId = parseInt(watch('tab_id'))

  // 🚩 로그인 체크 (user 없음/에러 시)
  useEffect(() => {
    if (!isUserLoading && (!user || userError)) {
      alert('로그인이 필요합니다.')
      router.push('/login')
    }
  }, [user, userError, isUserLoading, router])

  // 🚩 게시글 수정모드: 데이터 reset
  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        tab_id: String(post.tab_id),
        content: post.content,
      })
    }
  }, [post, reset])

  // 🚩 에러 처리 (탭, 게시글)
  useEffect(() => {
    if (tabsError) alert('탭 정보를 불러오는 데 실패했습니다.')
    if (postError) alert('게시글 정보를 불러오는 데 실패했습니다.')
  }, [tabsError, postError])

  const hasWritePermission = (tab: Tab | undefined): boolean => {
    if (!tab || !user) return false
    if (user.is_admin) return true
    if (tab.required_role === 'member') return !!user
    if (tab.required_role === 'guest') return true
    return false
  }

  const onSubmit = async (data: PostForm) => {
    const targetTab = tabs.find((t) => t.id === parseInt(data.tab_id))
    if (!hasWritePermission(targetTab)) {
      alert('작성 권한이 없습니다.')
      return
    }
    try {
      if (isEditMode) {
        await axios.put(`/posts/${postId}`, data)
        alert('게시글이 수정되었습니다.')
      } else {
        await axios.post('/posts', data)
        alert('게시글이 작성되었습니다.')
      }
      router.push(`/tabs/${data.tab_id}`)
    } catch (e) {
      alert('오류가 발생했습니다.')
    }
  }

  const currentTab = tabs.find((t) => t.id === selectedTabId)

  if (isUserLoading || isTabsLoading || (isEditMode && isPostLoading)) {
    return <p>불러오는 중...</p>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">
        {isEditMode ? '게시글 수정' : '게시글 작성'}
      </h1>

      <input
        {...register('title', { required: true })}
        placeholder="제목을 입력하세요"
        className="border p-2 w-full"
      />

      <select
        {...register('tab_id', { required: true })}
        className="border p-2 w-full"
      >
        <option value="">탭 선택</option>
        {tabs.filter((tab) => !tab.is_hidden).map((tab) => (
          <option key={tab.id} value={tab.id}>
            {tab.name}
          </option>
        ))}
      </select>

      {currentTab && !hasWritePermission(currentTab) && (
        <p className="text-red-500 text-sm">
          ⚠️ 이 탭에는 글 작성 권한이 없습니다.
        </p>
      )}

      <Controller
        name="content"
        control={control}
        render={({ field }) => <ReactQuill {...field} />}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={!hasWritePermission(currentTab) || isSubmitting}
      >
        {isEditMode ? '수정하기' : '작성하기'}
      </button>
    </form>
  )
}