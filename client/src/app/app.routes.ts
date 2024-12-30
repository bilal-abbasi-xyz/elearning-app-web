import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';  
import { CreateCourseComponent } from './create-course/create-course.component';  
import { InstructorDashboardComponent } from './instructor-dashboard/instructor-dashboard.component';
import { EditCourseComponent } from './edit-course/edit-course.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },       
  { path: 'login', component: LoginComponent },               
  { path: 'dashboard', component: DashboardComponent },
  { path: 'signup', component: SignUpComponent },    
  { path: 'instructor-dashboard', component: InstructorDashboardComponent },  
  { path: 'courses', component: CourseListComponent },         
  { path: 'courses/:id', component: CourseDetailComponent },   
  { path: 'create-course', component: CreateCourseComponent }, 
  { path: 'edit-course/:id', component: EditCourseComponent },
];
