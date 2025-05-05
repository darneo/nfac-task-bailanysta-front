import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../models';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private baseUrl = environment.apiUrl; // <-- добавлен протокол

  constructor(private http: HttpClient) {}

  search(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/?q=${encodeURIComponent(query)}`);
  }

  getUsers(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.baseUrl}/users/`);
  }
}
