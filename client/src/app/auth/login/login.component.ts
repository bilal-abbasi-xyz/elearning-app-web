import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { UserService } from '../../user.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;

    this.loginService.login(username, password).subscribe({
      next: (response) => {
        if (response.token) {
          localStorage.setItem('token', response.token); // Store token in localStorage

          // Fetch current user details using UserService
          this.userService.getCurrentUser(response.token).subscribe({
            next: (user: { role: string; }) => {
              if (user.role === 'instructor') {
                this.router.navigate(['/instructor-dashboard']); // Navigate to instructor dashboard
              } else {
                this.router.navigate(['/dashboard']); // Navigate to default dashboard
              }
            },
            error: () => {
              this.errorMessage = 'Error fetching user details. Please try again.';
            },
          });
        }
      },
      error: () => {
        this.errorMessage = 'Invalid credentials, please try again.';
      },
    });
  }
}
