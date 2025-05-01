import {Component} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {firstValueFrom} from 'rxjs';

@Component({
  imports: [],
  templateUrl: './login-page.component.html',
  standalone: true,
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  private username: string = 'jhon@email.com';
  private password: string = 'Holacomoesta123';


  constructor(private service: AuthService) {
  }

  async login() {
    try {
      const response = await firstValueFrom(this.service.login(this.username, this.password));
      console.log('Login successful', response);

      const authHeader = response.headers.get('Authorization');
      if (authHeader) {
        localStorage.setItem('token', authHeader);
      } else {
        console.error('Authorization header not found');
      }
      console.log('Authorization Header:', authHeader);
    } catch (error) {
      console.error('Login failed', error);
    }
  }

  async getClubs(){
    try {
      const response = await firstValueFrom(this.service.getClubs());
      console.log('Clubs fetched successfully', response);
    } catch (error) {
      console.error('Failed to fetch clubs', error);
    }
  }
}
