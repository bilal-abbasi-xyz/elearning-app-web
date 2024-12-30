import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css'],
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
})
export class EditCourseComponent implements OnInit {
  courseName: string = '';
  lectures: any[] = [];
  quizzes: any[] = [];
  selectedLectures: any[] = [];
  selectedQuizzes: any[] = [];
  errorMessage: string = '';
  courseId: string = ''; // To store the course ID

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute, // To get the course ID from the route
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.fetchLectures();
    this.fetchQuizzes();
    this.route.paramMap.subscribe((params) => {
      this.courseId = params.get('id')!;
      this.fetchCourseDetails();
    });
  }

  fetchLectures() {
    this.http.get<any[]>('http://localhost:5000/api/lectures').subscribe(
      (data) => {
        this.lectures = data;
      },
      (error) => {
        this.errorMessage = 'Failed to fetch lectures';
      }
    );
  }

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

  fetchCourseDetails() {
    this.http.get<any>(`http://localhost:5000/api/courses/${this.courseId}`).subscribe(
      (course) => {

        this.courseName = course.name;
        this.selectedLectures = course.lectures.map((lecture: any) => lecture._id);
        this.selectedQuizzes = course.quizzes.map((quiz: any) => quiz._id);
      },
      (error) => {
        console.log("course id is: ", this.courseId);
        this.errorMessage = 'Failed to fetch course details';
      }
    );
  }

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

  updateCourse() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'User is not authenticated.';
      return;
    }

    this.userService.getCurrentUser(token).subscribe(
      (userData) => {
        let instructorId = userData._id;
        instructorId = '67720d9708bca678d4554471';
        const updatedCourse = {
          name: this.courseName,
          lectures: this.selectedLectures,
          quizzes: this.selectedQuizzes,
          instructorId: instructorId,
        };

        this.http
          .put(`http://localhost:5000/api/courses/${this.courseId}`, updatedCourse)
          .subscribe(
            (response) => {
              this.router.navigate(['/instructor-dashboard']);
            },
            (error) => {
              this.errorMessage = 'Failed to update course';
              console.error('Error:', error);
            }
          );
      },
      (error) => {
        this.errorMessage = 'Failed to fetch user data.';
        console.error('Error fetching user data:', error);
      }
    );
  }
}
