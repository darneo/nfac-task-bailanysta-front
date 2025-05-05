import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthModel, Post, Token } from '../models';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private baseUrl = environment.apiUrl; // или Railway URL, например: https://your-app.up.railway.app/api

  constructor(private client : HttpClient) { }

  login(authModel : AuthModel): Observable<Token>{
    return this.client.post<Token>(`${this.baseUrl}/auth/login/`, authModel);
  }

  getPosts(): Observable<Post[]> {
    const access = localStorage.getItem('access');
    const options = access ? { headers: { Authorization: `Bearer ${access}` } } : {};
    return this.client.get<Post[]>(`${this.baseUrl}/posts/`, options);
  }

  getPostById(id: number): Observable<Post> {
    return this.client.get<Post>(`${this.baseUrl}/posts/${id}`);
  }

  getPostComments(id: number): Observable<any[]> {
    return this.client.get<any[]>(`${this.baseUrl}/posts/${id}/comments`);
  }

  getUserPosts(username: string): Observable<Post[]> {
    return this.client.get<Post[]>(`${this.baseUrl}/profile/${username}/posts/`);
  }

  addComment(postId: number, content: string) {
    const token = localStorage.getItem('access'); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.client.post<Comment>(
      `${this.baseUrl}/posts/${postId}/comments/`,
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
      `${this.baseUrl}/profile/${username}/posts/`, 
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
      `${this.baseUrl}/posts/${postId}/like/`, 
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
      `${this.baseUrl}/posts/${postId}/like/`,
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
      `${this.baseUrl}/posts/${postId}/`,
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
      `${this.baseUrl}/posts/${postId}/`,
      { headers }
    );
  }

  deleteComment(postId: number, commentId: number) {
    const token = localStorage.getItem('access');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.client.delete(
      `${this.baseUrl}/posts/${postId}/comments/${commentId}/`,
      { headers }
    );
  }

  getNotifications(): Observable<Notification[]> {
    const token = localStorage.getItem('access');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.client.get<Notification[]>(`${this.baseUrl}/notifications`, { headers });
  }
}
