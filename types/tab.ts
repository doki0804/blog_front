export type Tab = {
  id: number
  name: string
  is_hidden: boolean
  required_role: 'admin' | 'member' | 'guest' // ✅ 권한 필드 추가
}