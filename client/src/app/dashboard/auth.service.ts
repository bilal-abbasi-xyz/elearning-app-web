import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Check if the user is logged in by verifying if a token exists
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Log out by removing the token from local storage
  logout(): void {
    localStorage.removeItem('token');
  }
}
