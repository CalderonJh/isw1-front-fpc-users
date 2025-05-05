

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/login.user';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-user-page.component.html',
  styleUrls: ['./dashboard-user-page.component.css']
})
export class DashboardPageComponent implements OnInit {
  activeTab = 0;
  tabs = [
    { id: 0, label: 'Boletas' },
    { id: 1, label: 'Abonos' },
    { id: 2, label: 'Eventos' }
  ];

  // Datos del usuario (inicialmente vacíos)
  user = {
    nombre: 'Usuario',
    email: '',
    equipoFavorito: 'Equipo'
  };

  // Ejemplos de boletas
  boletas = [
    {
      partido: 'Bucaramanga vs Junior',
      fecha: '15 Oct 2023',
      ubicacion: 'Estadio Alfonso López',
      seccion: 'Norte A-12',
      precio: 45000
    },
    {
      partido: 'Bucaramanga vs Millonarios',
      fecha: '22 Oct 2023',
      ubicacion: 'Estadio Alfonso López',
      seccion: 'Sur B-5',
      precio: 50000
    }
  ];

  // Ejemplos de abonos
  abonos = [
    {
      nombre: 'Abono Temporada 2023',
      activo: true,
      temporada: 'Enero 2023 - Diciembre 2023',
      asiento: 'Tribuna Norte A-12',
      precio: 1200000,
      beneficios: [
        'Acceso a todos los partidos de local',
        'Descuento en merchandising',
        'Estacionamiento incluido'
      ]
    },
    {
      nombre: 'Abono Torneo Apertura',
      activo: false,
      temporada: 'Enero 2023 - Junio 2023',
      asiento: 'Tribuna Sur G-45',
      precio: 600000,
      beneficios: [
        'Acceso a partidos de liga',
        'Descuento en alimentos'
      ]
    }
  ];

  // Ejemplos de eventos
  eventos = [
    {
      nombre: 'Bucaramanga vs Nacional',
      fecha: new Date('2023-11-18'),
      hora: '5:00 PM',
      ubicacion: 'Estadio Alfonso López',
      precioDesde: 40000
    },
    {
      nombre: 'Bucaramanga vs América',
      fecha: new Date('2023-11-25'),
      hora: '3:00 PM',
      ubicacion: 'Estadio Alfonso López',
      precioDesde: 38000
    },
    {
      nombre: 'Bucaramanga vs Santa Fe',
      fecha: new Date('2023-12-02'),
      hora: '7:00 PM',
      ubicacion: 'Estadio Alfonso López',
      precioDesde: 42000
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();

    /*
    // Código para cuando tengas la API de datos de usuario:
    this.loadUserDetailsFromApi();
    */
  }

  // Obtiene las iniciales para el avatar
  get userInitials(): string {
    const names = this.user.nombre.split(' ');
    return names[0].charAt(0) + (names[1] ? names[1].charAt(0) : '');
  }

  // Carga datos básicos del token
  private loadUserData(): void {
    const userData = this.authService.getUserData();
    if (userData) {
      this.user.email = userData.sub || '';
      this.user.nombre = userData.name || 'Usuario';

      // Si el backend incluye más datos en el token:
      // this.user.equipoFavorito = userData.favoriteTeam || 'Equipo';
    }
  }

  /*
  // Ejemplo para cuando tengas la ruta de la API de usuario:
  private loadUserDetailsFromApi(): void {
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        this.user.nombre = profile.fullName;
        this.user.equipoFavorito = profile.favoriteTeam;
        // Actualiza otros campos según necesites
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
      }
    });
  }
  */

  // Cierra la sesión
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  setActiveTab(tabId: number): void {
    this.activeTab = tabId;
  }
}
