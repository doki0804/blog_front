// lib/comment.ts
import axios from "./axios";

// 특정 게시글의 댓글 조회
export async function fetchComments(postId: string) {
  const { data } = await axios.get(`/api/posts/${postId}/comments`);
  return data;
}

// 댓글 생성
export async function createComment(postId: string, comment: any) {
  const { data } = await axios.post(`/api/posts/${postId}/comments`, comment);
  return data;
}

// 댓글 수정
export async function updateComment(postId: string, commentId: string, comment: any) {
  const { data } = await axios.put(`/api/posts/${postId}/comments/${commentId}`, comment);
  return data;
}

// 댓글 삭제
export async function deleteComment(postId: string, commentId: string) {
  const { data } = await axios.delete(`/api/posts/${postId}/comments/${commentId}`);
  return data;
}
