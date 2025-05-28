import { create } from 'zustand'
import axios from '@/lib/axios'
import { jwtDecode } from 'jwt-decode'

// ✅ JWT 토큰 구조 타입 선언
type DecodedToken = {
  sub: number
  email: string
  is_admin: boolean
  exp: number
}

type User = {
  id: number
  email: string
  is_admin: boolean
}

type Tab = {
  id: number
  name: string
  is_hidden: boolean
}

type AppState = {
  token: string | null
  user: User | null
  tabs: Tab[]

  setToken: (token: string) => void
  logout: () => void

  refreshUser: () => Promise<void>
  refreshTabs: () => Promise<void>
}

export const useAppStore = create<AppState>((set) => ({
  token: null,
  user: null,
  tabs: [],

  setToken: (token: string) => {
    localStorage.setItem('token', token)
    set({ token })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null })
  },

  refreshUser: async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const decoded = jwtDecode<DecodedToken>(token)

      // exp가 현재 시간보다 과거이면 만료 처리
      const now = Date.now() / 1000
      if (decoded.exp < now) {
        localStorage.removeItem('token')
        set({ token: null, user: null })
        return
      }

      set({
        token,
        user: {
          id: decoded.sub,
          email: decoded.email,
          is_admin: decoded.is_admin,
        },
      })
    } catch (err) {
      console.error('토큰 디코딩 실패:', err)
      set({ token: null, user: null })
    }
  },

  refreshTabs: async () => {
    try {
      const res = await axios.get('/tabs')
      set({ tabs: res.data })
    } catch {
      set({ tabs: [] })
    }
  },
}))
