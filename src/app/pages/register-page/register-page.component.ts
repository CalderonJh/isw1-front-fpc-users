import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  onSubmit() {
    if (this.loading) return;

    this.loading = true;
    console.log('Registrando usuario:', this.user);

    // Simulación de llamada a API
    setTimeout(() => {
      this.loading = false;
      alert('Registro exitoso! Por favor inicie sesión.');
      // Aquí iría la navegación al login o la lógica de registro real
    }, 2000);
  }
}
