export type User = {
  id: number
  email: string
  is_admin: boolean
  role: 'admin' | 'member' | 'guest'
  nickname?: string
  created_at?: string
}