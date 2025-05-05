import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile, User } from '../models';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private apiUrl = 'http://127.0.0.1:8000/api/search/';

  constructor(private http: HttpClient) {}

  search(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?q=${encodeURIComponent(query)}`);
  }
  getUsers(): Observable<Profile[]> {
    return this.http.get<Profile[]>('http://127.0.0.1:8000/api/users/');
  }
}
