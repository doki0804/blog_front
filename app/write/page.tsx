'use client'

import dynamic from 'next/dynamic'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useAppStore } from '@/stores/useAppStore'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

type Tab = {
  id: number
  name: string
  is_hidden: boolean
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
  const editPostId = searchParams.get('id') // ✅ 수정됨: 수정 모드 여부 확인
  const isEditMode = !!editPostId
  const { register, handleSubmit, setValue, watch } = useForm()
  const [editorValue, setEditorValue] = useState('')
  const [tabs, setTabs] = useState<Tab[]>([])

  useEffect(() => {
    axios.get('/tabs').then((res) => {
      setTabs(res.data)
    })

    // ✅ 수정됨: 기존 게시글 불러오기
    if (isEditMode) {
      axios.get(`/posts/${editPostId}`).then(res => {
        const post: Post = res.data
        setValue('title', post.title)
        setValue('tab_id', post.tab_id)
        setEditorValue(post.content)
      })
    }
  }, [editPostId])

  const onSubmit = async (data: any) => {
    const postData = {
      ...data,
      content: editorValue,
    }

    try {
      if (isEditMode) {
        await axios.put(`/posts/${editPostId}`, postData) // ✅ 수정됨: 수정 요청
        alert('수정 완료')
      } else {
        await axios.post('/posts', postData)
        alert('작성 완료')
      }
      router.push('/')
    } catch (err) {
      alert('실패: 권한 오류 또는 네트워크 문제')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{isEditMode ? '게시글 수정' : '게시글 작성'}</h1>

      <input
        {...register('title')}
        placeholder="제목을 입력하세요"
        className="border p-2 w-full"
        required
      />

      <select {...register('tab_id')} className="border p-2 w-full">
        <option value="">탭 선택</option>
        {tabs.filter((tab) => !tab.is_hidden).map((tab) => (
          <option key={tab.id} value={tab.id}>
            {tab.name}
          </option>
        ))}
      </select>

      <ReactQuill value={editorValue} onChange={setEditorValue} />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {isEditMode ? '수정하기' : '작성하기'}
      </button>
    </form>
  )
}
