import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.css']
})
export class UserProfilePageComponent {
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  // Tipos de documento (ejemplo)
  tiposDocumento = [
    { id: 1, nombre: 'Cédula de Ciudadanía' },
    { id: 2, nombre: 'Tarjeta de Identidad' },
    { id: 3, nombre: 'Cédula de Extranjería' },
    { id: 4, nombre: 'Pasaporte' }
  ];

  // Datos del usuario (ejemplo inicial)
  user = {
    nombre: 'Juan',
    apellido: 'Pérez',
    tipoDocumento: 1,
    numeroDocumento: '123456789',
    direccion: 'Calle 123 # 45-67',
    email: 'juan.perez@example.com',
    telefono: '3001234567'
  };

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;
    this.message = '';
    this.messageType = '';

    // Simulamos una llamada a API con timeout
    setTimeout(() => {
      this.loading = false;
      this.message = 'Información actualizada correctamente (simulación)';
      this.messageType = 'success';

      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => this.message = '', 3000);
    }, 1500);
  }
}
