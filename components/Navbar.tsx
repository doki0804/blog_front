'use client'

import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../lib/user';
import { useEffect } from 'react';

export default function Navbar() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (error) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }, [error]);

  if (isLoading) return <div>로딩 중...</div>;

  return <div>{user?.nickname || user?.email}</div>;
}
