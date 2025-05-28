// lib/user.ts
import { jwtDecode } from 'jwt-decode';
import axios from './axios';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  exp: number;
  [key: string]: any;
}

export function getDecodedUser(): JwtPayload | null {
  if (typeof window === "undefined") return null; // SSR 방어!
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

// 최신 정보 fetch
export async function fetchUser() {
  const { data } = await axios.get('/api/user');
  return data;
}
