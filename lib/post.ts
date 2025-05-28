// lib/post.ts
import axios from "./axios";

// 게시글 목록 조회
export async function fetchPosts() {
  const { data } = await axios.get("/api/posts");
  return data;
}

// 게시글 상세 조회
export async function fetchPost(id: string) {
  const { data } = await axios.get(`/api/posts/${id}`);
  return data;
}

// 게시글 생성
export async function createPost(post: any) {
  const { data } = await axios.post("/api/posts", post);
  return data;
}

// 게시글 수정
export async function updatePost(id: string, post: any) {
  const { data } = await axios.put(`/api/posts/${id}`, post);
  return data;
}

// 게시글 삭제
export async function deletePost(id: string) {
  const { data } = await axios.delete(`/api/posts/${id}`);
  return data;
}