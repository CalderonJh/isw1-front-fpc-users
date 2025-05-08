// favorite-team-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { TeamService, TeamWithImage } from '../../services/team.service';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-favorite-team-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './favorite-team-page.component.html',
  styleUrls: ['./favorite-team-page.component.css']
})
export class FavoriteTeamPageComponent implements OnInit {
  selectedTeam: number | null = null;
  teams: TeamWithImage[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.loadTeams();
    this.teamService.getTeamsWithImages().subscribe(teams => {
      this.teams = teams;
      console.log(this.teams); // Aquí puedes verificar que los equipos tienen la URL sanitizada
    });
  }

  loadTeams(): void {
    this.isLoading = true;
    this.error = null;

    this.teamService.getTeamsWithImages().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los equipos. Por favor intenta más tarde.';
        this.isLoading = false;
        console.error('Error loading teams:', err);
      }
    });
  }

  selectTeam(teamId: number): void {
    this.selectedTeam = teamId;
  }


  getSelectedTeam(): TeamWithImage | undefined {
    return this.teams.find(t => t.id === this.selectedTeam);
  }

  getSelectedTeamName(): string {
    const team = this.getSelectedTeam();
    return team ? team.name : '';
  }

  getSelectedTeamShortName(): string {
    const team = this.getSelectedTeam();
    return team ? team.shortName : '';
  }

  confirmSelection(): void {
    if (this.selectedTeam) {
      alert(`Has seleccionado a ${this.getSelectedTeamName()} (${this.getSelectedTeamShortName()}) como tu equipo favorito!`);
      this.router.navigate(['/dashboardUser']);
      // Aquí podrías llamar a otro servicio para guardar la selección
    }
  }
}
