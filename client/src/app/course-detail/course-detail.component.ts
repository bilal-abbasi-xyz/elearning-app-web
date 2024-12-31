import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';  // Import CommonModule


@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
  imports: [CommonModule]
})
export class CourseDetailComponent implements OnInit {
  courseId: string = '';
  course: any = null;
  lectures: any[] = [];
  quizzes: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('id') || '';

      if (this.courseId) {
        this.fetchCourseDetails(this.courseId);
      }
    });
  }


  fetchCourseDetails(courseId: string) {
    this.http.get<any>(`http://localhost:5000/api/courses/${courseId}`).subscribe({
      next: (data) => {
        this.course = data;
        this.lectures = data.lectures || [];
        this.quizzes = data.quizzes || [];
        console.log("course detail data: ", data);
      },
      error: (err) => {
        console.error('Error fetching course:', err);
      }
    });
  }
}
