'use client'

import { useForm } from 'react-hook-form'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'

export default function Register() {
  const { register, handleSubmit } = useForm()
  const router = useRouter()

  const onSubmit = async (data: any) => {
    await axios.post('/auth/register', data)
    router.push('/login')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-20 space-y-4">
      <input {...register('email')} placeholder="이메일" className="border p-2 w-full" />
      <input {...register('password')} type="password" placeholder="비밀번호" className="border p-2 w-full" />
      <button type="submit" className="w-full bg-green-500 text-white py-2">회원가입</button>
    </form>
  )
}
