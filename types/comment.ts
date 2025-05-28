export type Comment = {
  id: number
  content: string
  post_id: number
  author_id?: number
  author_name: string
  created_at: string
  updated_at?: string
  status: string
}