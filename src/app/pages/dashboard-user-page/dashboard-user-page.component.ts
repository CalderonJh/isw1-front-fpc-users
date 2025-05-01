import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-user-page.component.html',
  styleUrls: ['./dashboard-user-page.component.css']
})
export class DashboardPageComponent {
  activeTab = 0;
  tabs = [
    { id: 0, label: 'Boletas' },
    { id: 1, label: 'Abonos' },
    { id: 2, label: 'Eventos' }
  ];

  user = {
    nombre: 'Juan',
    apellido: 'Perez',
    equipoFavorito: 'Bucaramanga'
  };

  get userInitials(): string {
    return this.user.nombre.charAt(0) + this.user.apellido.charAt(0);
  }

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

  setActiveTab(tabId: number): void {
    this.activeTab = tabId;
  }
}
