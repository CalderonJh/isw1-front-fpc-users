// team.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, forkJoin, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from './login.user';

interface Team {
  id: number;
  name: string;
  shortName: string;
  imageId: string;
}

export interface TeamWithImage extends Team {
  id: number;
  name: string;
  shortName: string;
  imageUrl: SafeUrl;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private baseUrl = 'http://100.26.187.163/fpc/api';
  private teamsEndpoint = '/pub/club/list';
  private imagesEndpoint = '/images/';
  private subscribeEndpoint = '/user/subscribe';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getTeamsWithImages(): Observable<TeamWithImage[]> {
    const headers = this.getHeaders();

    return this.http.get<Team[]>(`${this.baseUrl}${this.teamsEndpoint}`, { headers }).pipe(
      switchMap(teams => {
        if (teams.length === 0) return of([]);

        // Para cada equipo, obtenemos la URL de la imagen
        const teamRequests = teams.map(team =>
          this.getImageUrl(team.imageId).pipe(
            map(imageUrl => {
              console.log(`Image URL for team ${team.name}:`, imageUrl); // Mostrar imageUrl
              return {
                ...team,
                imageUrl// Aquí agregamos la sanitización
              };
            })
          )
        );

        return forkJoin(teamRequests);
      })
    );
  }

  subscribeToTeam(clubId: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.baseUrl}${this.subscribeEndpoint}?clubId=${clubId}`;
    return this.http.post(url, {}, { headers });
  }

  private getImageUrl(imageId: string): Observable<SafeUrl> {
    if (!imageId) return of(this.sanitizer.bypassSecurityTrustUrl('img/llaneros.jpg'));
    const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}${this.imagesEndpoint}${imageId}`, {
      headers,
      responseType: 'text'
    }).pipe(
      map(urlString => {
        console.log(`Raw URL from API for imageId ${imageId}:`, urlString);
        const parsed = JSON.parse(urlString); // <- Aquí se convierte a objeto
        const realUrl = parsed.url || 'img/llaneros.jpg';
        return this.sanitizer.bypassSecurityTrustUrl(realUrl);
      })
    );
  }
}
