'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import { useAppStore } from '@/stores/useAppStore'

export default function LoginPage() {
  const { register, handleSubmit } = useForm()
  const router = useRouter()
  const setToken = useAppStore(state => state.setToken)
  const refreshUser = useAppStore(state => state.refreshUser)

  const onSubmit = async (data: any) => {
    const res = await axios.post('/auth/login', data)
    setToken(res.data.access_token)
    await refreshUser()
    router.push('/')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto mt-16">
      <input {...register('email')} placeholder="이메일" className="border p-2 w-full" />
      <input {...register('password')} type="password" placeholder="비밀번호" className="border p-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white w-full py-2">로그인</button>
    </form>
  )
}
