import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signup/signup.component'; // Import SignUpComponent

@NgModule({
  declarations: [LoginComponent, SignUpComponent],
  imports: [CommonModule, ReactiveFormsModule],  // Make sure FormsModule is imported here
  exports: [LoginComponent, SignUpComponent]
})
export class AuthModule {}
