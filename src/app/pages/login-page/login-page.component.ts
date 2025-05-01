import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Esto es lo importante
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  loading: boolean = false;


  constructor (private service:UserService) {

  }
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.loading = true;
    setTimeout(() => {
      console.log('Login attempt with:', { email: this.email, password: this.password });
      this.loading = false;
    }, 1500);
  }
}
