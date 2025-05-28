// lib/tab.ts
import axios from "./axios";

// 모든 탭(카테고리) 조회
export async function fetchTabs() {
  const { data } = await axios.get("/api/tabs");
  return data;
}

// 탭 생성
export async function createTab(tab: { name: string }) {
  const { data } = await axios.post("/api/tabs", tab);
  return data;
}

// 탭 수정
export async function updateTab(id: string, tab: { name: string }) {
  const { data } = await axios.put(`/api/tabs/${id}`, tab);
  return data;
}

// 탭 삭제
export async function deleteTab(id: string) {
  const { data } = await axios.delete(`/api/tabs/${id}`);
  return data;
}