'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

export default function QueryProvider({ children }: { children: ReactNode }) {
  // QueryClient는 useState로 메모이제이션!
  const [client] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  )
}