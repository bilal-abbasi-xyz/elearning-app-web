import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private apiUrl = 'http://localhost:5000/api/signup';  // Update with your backend API URL

  constructor(private http: HttpClient) {}

  // Method to handle the signup request
  signUp(userData: { username: string; email: string; password: string; role: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData);
  }
}
