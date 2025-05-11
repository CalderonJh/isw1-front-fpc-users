import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.css']
})
export class UserProfilePageComponent implements OnInit {
  loading = false;
  loadingProfile = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  // Tipos de documento
  tiposDocumento = [
    { id: 1, nombre: 'Cédula de Ciudadanía' },
    { id: 2, nombre: 'Tarjeta de Identidad' },
    { id: 3, nombre: 'Cédula de Extranjería' },
    { id: 4, nombre: 'Pasaporte' }
  ];

  // Datos del usuario
  user = {
    nombre: '',
    apellido: '',
    tipoDocumento: 1,
    numeroDocumento: '',
    genero: '',
    fechaNacimiento: '',
    direccion: '', // No viene del backend
    email: '',
    telefono: ''
  };

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loadingProfile = true;
    this.profileService.getUserProfile().subscribe({
      next: (profile) => {
        this.mapProfileToForm(profile);
        this.loadingProfile = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingProfile = false;
        this.showMessage('Error al cargar el perfil', 'error');
      }
    });
  }

  private mapProfileToForm(profile: any): void {
    this.user = {
      nombre: profile.name,
      apellido: profile.lastName,
      tipoDocumento: profile.documentTypeId,
      numeroDocumento: profile.documentNumber,
      genero: profile.gender,
      fechaNacimiento: profile.birthDate,
      direccion: '', // Campo no viene del backend
      email: profile.email,
      telefono: profile.phoneNumber
    };
  }

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;
    this.message = '';
    this.messageType = '';

    const updateData = {
      name: this.user.nombre,
      lastName: this.user.apellido,
      email: this.user.email,
      phoneNumber: this.user.telefono
    };

    this.profileService.updateProfile(updateData).subscribe({
      next: () => {
        this.loading = false;
        this.showMessage('Información actualizada correctamente', 'success');
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.showMessage('Error al actualizar el perfil', 'error');
      }
    });
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }

  // Helper para deshabilitar campos no editables
  isDisabled(field: string): boolean {
    const nonEditableFields = ['tipoDocumento', 'numeroDocumento', 'genero', 'fechaNacimiento'];
    return nonEditableFields.includes(field);
  }
}
