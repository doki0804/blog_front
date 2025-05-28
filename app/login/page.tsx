'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import { useQueryClient } from '@tanstack/react-query'

export default function LoginPage() {
  const { register, handleSubmit } = useForm()
  const router = useRouter()
  const queryClient = useQueryClient()

  const onSubmit = async (data: any) => {
    try {
      // JWT 발급 및 저장 (localStorage)
      const res = await axios.post('/auth/login', data)
      localStorage.setItem('token', res.data.access_token)

      // user 쿼리 refetch로 상태 최신화 (react-query)
      await queryClient.invalidateQueries({ queryKey: ['user'] })

      router.push('/')
    } catch (e: any) {
      alert('로그인에 실패했습니다.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto mt-16">
      <input {...register('email')} placeholder="이메일" className="border p-2 w-full" />
      <input {...register('password')} type="password" placeholder="비밀번호" className="border p-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white w-full py-2">로그인</button>
    </form>
  )
}