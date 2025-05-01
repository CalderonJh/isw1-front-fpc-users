import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorite-team-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-team-page.component.html',
  styleUrls: ['./favorite-team-page.component.css']
})
export class FavoriteTeamPageComponent {
  selectedTeam: number | null = null;

  teams = [
    { id: 1, name: 'Bucaramanga', logo: 'assets/img/bga1.png' },
    { id: 2, name: 'Real Santander', logo: 'assets/img/real.png' },
    { id: 3, name: 'Llaneros FC', logo: 'assets/img/llaneros.jpg' },
    { id: 4, name: 'Junior', logo: 'assets/img/junior.png' },
    // Puedes agregar más equipos aquí
  ];

  selectTeam(teamId: number) {
    this.selectedTeam = teamId;
  }

  getSelectedTeamName(): string {
    const team = this.teams.find(t => t.id === this.selectedTeam);
    return team ? team.name : '';
  }

  confirmSelection() {
    if (this.selectedTeam) {
      alert(`Has seleccionado a ${this.getSelectedTeamName()} como tu equipo favorito!`);
      // Aquí podrías guardar la selección en tu base de datos
    }
  }
}
