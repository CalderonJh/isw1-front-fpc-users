import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/login.user';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { OfferService } from '../../services/offer.service';

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
    { id: 1, label: 'Abonos' }
  ];

  user = {
    nombre: '',
    email: '',
    equipoFavorito: ''
  };

  // Datos dinámicos
  boletas: any[] = [];
  abonos: any[] = [];
  loading = {
    boletas: true,
    abonos: true
  };

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private offerService: OfferService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadTicketOffers();
    this.loadSeasonPassOffers();
  }

  private loadUserProfile(): void {
    this.profileService.getUserProfile().subscribe({
      next: (profile) => {
        this.user.nombre = profile.name;
        this.user.email = profile.email;
      },
      error: (err) => {
        console.error('Error al cargar el perfil:', err);
        this.loadUserData();
      }
    });
  }

  private loadTicketOffers(): void {
    this.loading.boletas = true;
    this.offerService.getTicketOffers().subscribe({
      next: (offers) => {
        this.boletas = offers.map(offer => ({
          id: offer.id,
          partido: `${offer.homeClub.description} vs ${offer.awayClub.description}`,
          fecha: new Date(offer.matchDay).toLocaleDateString(),
          ubicacion: offer.stadium.description,
          imageUrl: offer.imageUrl,
          isPaused: offer.isPaused
        }));
        this.loading.boletas = false;
      },
      error: (err) => {
        console.error('Error al cargar boletas:', err);
        this.loading.boletas = false;
      }
    });
  }

  private loadSeasonPassOffers(): void {
    this.loading.abonos = true;
    this.offerService.getSeasonPassOffers().subscribe({
      next: (offers) => {
        this.abonos = offers.map(offer => ({
          id: offer.id,
          nombre: offer.description,
          temporada: `Temporada ${offer.year} - ${offer.season}`,
          estadio: offer.stadium,
          imageUrl: offer.imageUrl,
          isPaused: offer.isPaused
        }));
        this.loading.abonos = false;
      },
      error: (err) => {
        console.error('Error al cargar abonos:', err);
        this.loading.abonos = false;
      }
    });
  }

  get userInitials(): string {
    const names = this.user.nombre.split(' ');
    return names[0].charAt(0) + (names[1] ? names[1].charAt(0) : '');
  }

  private loadUserData(): void {
    const userData = this.authService.getUserData();
    if (userData) {
      this.user.email = userData.sub || '';
      this.user.nombre = userData.name || '';
    }
  }

  navigateToBuy(id: number, type: 'ticket' | 'season-pass'): void {
    this.router.navigate(['/comprar'], { 
      queryParams: { 
        type,
        id 
      } 
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  setActiveTab(tabId: number): void {
    this.activeTab = tabId;
  }
}