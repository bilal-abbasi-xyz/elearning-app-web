import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { Router } from '@angular/router';


@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
  imports: [CommonModule]
})
export class CourseListComponent implements OnInit {
  courses: any[] = []; 
  errorMessage: string = ''; 

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.getCourses();
  }

  // Fetch courses from the backend
  getCourses() {
    this.http.get('http://localhost:5000/api/courses').subscribe({
      next: (data: any) => {
        this.courses = data; // Assign the response to the courses array
        console.log('Fetched courses:', this.courses); // Log the courses list

      },
      error: (err) => {
        this.errorMessage = 'Failed to fetch courses. Please try again later.';
        console.error('Error fetching courses:', err);
      },
    });
  }

  viewCourse(courseId: string) {
    console.log('Navigating to course:', courseId);
    this.router.navigate(['/courses', courseId]);
  }
}
