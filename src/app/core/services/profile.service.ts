import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = 'http://127.0.0.1:8000/api'; 

  constructor(private http: HttpClient) {}

  getProfileByUsername(username: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/profile/${username}/`);
  }

  updateProfile(username: string | null, data: FormData): Observable<Profile> {
    const token = localStorage.getItem('access');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.put<Profile>(`${this.apiUrl}/profile/${username}/`, data, { headers });
  }
  

  followUser(username: string): Observable<any> {
    const token = localStorage.getItem('access');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/follow/${username}/`, {}, { headers });
  }

  unfollowUser(username: string): Observable<any> {
    const token = localStorage.getItem('access');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/unfollow/${username}/`, { headers });
  }

  checkIfFollowing(username: string): Observable<{ is_following: boolean }> {
    const token = localStorage.getItem('access');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<{ is_following: boolean }>(`${this.apiUrl}/following-status/${username}/`, { headers });
  }
}
