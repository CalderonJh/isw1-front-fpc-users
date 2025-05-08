// register-page.component.ts (actualizado)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RegisterService, RegisterUser } from '../../services/register.user'; // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router';
import { AuthService } from '../../services/login.user';
@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  today = new Date();
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  confirmPassword = '';

  // Tipos de documento (ejemplo)
  tiposDocumento = [
    { id: 1, nombre: 'Cédula de Ciudadanía' },
    { id: 2, nombre: 'Tarjeta de Identidad' },
    { id: 3, nombre: 'Cédula de Extranjería' },
    { id: 4, nombre: 'Pasaporte' }
  ];

  user = {
    nombre: '',
    apellido: '',
    email: '',
    tipoDocumento: '',
    numeroDocumento: '',
    fechaNacimiento: '',
    genero: '',
    telefono: '',
    password: ''
  };

  constructor(private registerService: RegisterService, private router: Router, private authService: AuthService) {}

  onSubmit() {
    if (this.loading) return;

    // Validar que las contraseñas coincidan
    if (this.user.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.loading = true;

    // Mapear los datos del formulario al formato esperado por el backend
    const registerData: RegisterUser = {
      name: this.user.nombre,
      lastName: this.user.apellido,
      email: this.user.email,
      documentTypeId: Number(this.user.tipoDocumento),
      documentNumber: this.user.numeroDocumento,
      gender: this.user.genero || 'M', // Valor por defecto si no se selecciona
      birthDate: this.user.fechaNacimiento,
      phoneNumber: this.user.telefono || '', // Si es opcional
      password: this.user.password
    };

    this.registerService.register(registerData).subscribe({
      next: (response) => {
        this.loading = false;

        // Extraer token del encabezado Authorization
        let token: string | null = null;
        const authHeader = response.headers.get('Authorization');

        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1];
        } else if (authHeader) {
          token = authHeader;
        }

        if (token) {
          this.authService.saveTokenAfterRegister(token); // guarda token y cambia estado
          this.router.navigate(['/favorite']); // redirige
        } else {
          alert('Registro exitoso, pero no se recibió token. Inicie sesión manualmente.');
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        this.loading = false;
        alert(error.message || 'Error en el registro. Por favor, inténtelo nuevamente.');
      }
    });

  }

}
