// login-page.component.ts (actualizado)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/login.user'; // Ajusta la ruta según tu estructura
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loading) return;

    // Validar formulario
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    // Mapear email a username (si el backend espera "username" pero usas email para login)
    const credentials = {
      username: this.email,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.loading = false;
        this.authService.redirectToDashboard();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Error en el login. Por favor, inténtelo nuevamente.';
      }
    });
  }
}
