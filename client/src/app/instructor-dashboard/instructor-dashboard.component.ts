import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instructor-dashboard',
  templateUrl: './instructor-dashboard.component.html',
  styleUrls: ['./instructor-dashboard.component.css'],
  imports: [CommonModule]
})
export class InstructorDashboardComponent implements OnInit {
  courses: any[] = [];
  instructorName: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchCurrentUser();
    this.getCourses();
  }

  fetchCurrentUser() {
    const token = localStorage.getItem('token');
    if (token) {
      this.http
        .get('http://localhost:5000/api/current-user', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .subscribe({
          next: (user: any) => {
            if (user.role === 'instructor') {
              this.instructorName = user.username;
            } else {
              this.errorMessage = 'Unauthorized access. Only instructors can view this page.';
            }
          },
          error: () => {
            this.errorMessage = 'Error fetching user details. Please log in again.';
          },
        });
    } else {
      this.errorMessage = 'No token found. Please log in again.';
    }
  }

  getCourses() {
    this.http.get('http://localhost:5000/api/courses').subscribe({
      next: (data: any) => {
        this.courses = data;
      },
      error: () => {
        this.errorMessage = 'Failed to fetch courses. Please try again later.';
      },
    });
  }

  deleteCourse(courseId: string) {
    this.http.delete(`http://localhost:5000/api/courses/${courseId}`).subscribe({
      next: () => {
        this.courses = this.courses.filter((course) => course._id !== courseId);
      },
      error: () => {
        this.errorMessage = 'Failed to delete the course. Please try again later.';
      },
    });
  }

  editCourse(courseId: string) {
    this.router.navigate(['/edit-course', courseId]);
  }

  createCourse() {
    this.router.navigate(['/create-course']);
  }
}
