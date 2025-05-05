import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthModel, Post, Token } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private client : HttpClient) { 

  }

  login(authModel : AuthModel): Observable<Token>{
    return this.client.post<Token>('http://127.0.0.1:8000/api/auth/login/' , authModel)
  }

  getPosts(): Observable<Post[]> {
    const access = localStorage.getItem('access');
  
    const options = access
      ? { headers: { Authorization: `Bearer ${access}` } }
      : {};
  
    return this.client.get<Post[]>('http://127.0.0.1:8000/api/posts/', options);
  }
  
  getPostById(id: number): Observable<Post> {
    return this.client.get<Post>(`http://127.0.0.1:8000/api/posts/${id}`)
  }
  getPostComments(id: number): Observable<any[]> {
    return this.client.get<any[]>(`http://127.0.0.1:8000/api/posts/${id}/comments`)
  }
  getUserPosts(username: string): Observable<Post[]> {
    return this.client.get<Post[]>(`http://127.0.0.1:8000/api/profile/${username}/posts/`);
  }
  addComment(postId: number, content: string) {
    const token = localStorage.getItem('access'); 
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.client.post<Comment>(
      `http://127.0.0.1:8000/api/posts/${postId}/comments/`,
      { content },
      { headers }
    );
  }

  createPost(username : string | null, content: string) {
    const token = localStorage.getItem('access');  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.client.post<Post>(
      `http://127.0.0.1:8000/api/profile/${username}/posts/`, 
      { content }, 
      { headers }
    );
  }
  
  likePost(postId: number): Observable<Post> {
    const token = localStorage.getItem('access');  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.client.post<Post>(
      `http://127.0.0.1:8000/api/posts/${postId}/like/`, 
      {}, 
      { headers }
    );
  }
  
  
  unlikePost(postId: number): Observable<Post> {
    const token = localStorage.getItem('access');  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.client.delete<Post>(
      `http://127.0.0.1:8000/api/posts/${postId}/like/`,
      { headers }
    );
  }
  updatePost(postId: number, content: string) {
    const token = localStorage.getItem('access');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.client.put<Post>(
      `http://127.0.0.1:8000/api/posts/${postId}/`,
      { content },
      { headers }
    );
  }
  
  deletePost(postId: number) {
    const token = localStorage.getItem('access');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.client.delete(
      `http://127.0.0.1:8000/api/posts/${postId}/`,
      { headers }
    );
  }
  deleteComment(postId: number, commentId: number) {
    const token = localStorage.getItem('access');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.client.delete(
      `http://127.0.0.1:8000/api/posts/${postId}/comments/${commentId}/`,
      { headers }
    );
  }
  
  getNotifications(): Observable<Notification[]> {
    const token = localStorage.getItem('access');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.client.get<Notification[]>('http://127.0.0.1:8000/api/notifications', { headers });
  }
  
}
