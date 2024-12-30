import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignUpService } from './signup.service'; // Create a signup service for handling requests
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [ReactiveFormsModule, RouterModule, CommonModule]

})
export class SignUpComponent {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private signUpService: SignUpService
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]], // Username field
      email: ['', [Validators.required, Validators.email]], // Email field
      password: ['', [Validators.required, Validators.minLength(6)]], // Password field
    });
  }

  // SignUp method to handle form submission
  signUp() {
    if (this.signupForm.invalid) {
      this.errorMessage = 'Please fill out all fields correctly.';
      return;
    }

    // Add the role (student) to the form value before sending to the backend
    const formData = { ...this.signupForm.value, role: 'student' };

    this.signUpService.signUp(formData).subscribe({
      next: (response) => {
        // Redirect to login page after successful signup
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // Show error message if signup fails
        this.errorMessage = err.error?.message || 'An error occurred. Please try again.';
      },
    });
  }
}