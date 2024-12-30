import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service'; 
import { AuthService } from './auth.service';  
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  user: any = {};
  errorMessage: string = '';

  constructor(private userService: UserService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'No token found. Please log in again.';
      return;
    }

    this.userService.getCurrentUser(token).subscribe({
      next: (response) => {
        this.user = response;  
      },
      error: (err) => {
        this.errorMessage = 'Failed to load user data. Please try again.';
      }
    });
  }

  goToCoursesList(): void {
    this.router.navigate(['/courses']);
  }
}
