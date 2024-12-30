import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css'],
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],

})
export class CreateCourseComponent implements OnInit {
  courseName: string = '';
  lectures: any[] = [];
  quizzes: any[] = [];
  selectedLectures: any[] = [];
  selectedQuizzes: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private userService: UserService
  ) { }

  ngOnInit(): void {
    this.fetchLectures();
    this.fetchQuizzes();
  }

  fetchLectures() {
    this.http.get<any[]>('http://localhost:5000/api/lectures').subscribe(
      (data) => {
        this.lectures = data;
        console.log("Lecture length: ", this.lectures);
      },
      (error) => {
        this.errorMessage = 'Failed to fetch lectures';
      }
    );
  }

  // Fetch quizzes from the server
  fetchQuizzes() {
    this.http.get<any[]>('http://localhost:5000/api/quizzes').subscribe(
      (data) => {
        this.quizzes = data;
      },
      (error) => {
        this.errorMessage = 'Failed to fetch quizzes';
      }
    );
  }

  // Handle lecture selection
  onLectureChange(lectureId: string, event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      const isChecked = input.checked;
      if (isChecked) {
        this.selectedLectures.push(lectureId);
      } else {
        const index = this.selectedLectures.indexOf(lectureId);
        if (index > -1) {
          this.selectedLectures.splice(index, 1);
        }
      }
    }
  }

  // Handle quiz selection
  onQuizChange(quizId: string, event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      const isChecked = input.checked;
      if (isChecked) {
        this.selectedQuizzes.push(quizId);
      } else {
        const index = this.selectedQuizzes.indexOf(quizId);
        if (index > -1) {
          this.selectedQuizzes.splice(index, 1);
        }
      }
    }
  }


  createCourse() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'User is not authenticated.';
      return;
    }

    this.userService.getCurrentUser(token).subscribe(
      (userData) => {
        let instructorId = userData._id;
        instructorId = '6771eeac7e5d8a3a7980d97b';
        console.log("instructor id :", instructorId);
        const newCourse = {
          name: this.courseName,
          lectures: this.selectedLectures,
          quizzes: this.selectedQuizzes,
          instructorId: instructorId
        };

        this.http.post('http://localhost:5000/api/courses', newCourse).subscribe(
          (response) => {
            this.router.navigate(['/instructor-dashboard']);
          },
          (error) => {
            this.errorMessage = 'Failed to create course';
            console.error('Error:', error);  // Log the error for debugging
          }
        );
      },
      (error) => {
        this.errorMessage = 'Failed to fetch user data.';
        console.error('Error fetching user data:', error);  // Log the error for debugging
      }
    );
  }
}