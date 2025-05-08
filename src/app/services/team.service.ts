// team.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, forkJoin, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
  private teamsEndpoint = '/su/club/list';
  private imagesEndpoint = '/images/';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  getTeamsWithImages(): Observable<TeamWithImage[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbeyJpZCI6MywibmFtZSI6IlNVUEVSVVNFUiJ9LHsiaWQiOjEsIm5hbWUiOiJVU0VSIn0seyJpZCI6MiwibmFtZSI6IkNMVUJfQURNSU4ifV0sImlhdCI6MTc0NjY3MTcxMiwiZXhwIjoxNzQ2NzU4MTEyfQ.gS7ejq-GNtKbX2yZTqdjtucvPypAaqo1Pk7IJX5Zms31cNK6isVtDX-4lmJviz9X' // Reemplaza con tu token real
    });

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

  private getImageUrl(imageId: string): Observable<SafeUrl> {
    if (!imageId) return of(this.sanitizer.bypassSecurityTrustUrl('img/llaneros.jpg'));

    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbeyJpZCI6MywibmFtZSI6IlNVUEVSVVNFUiJ9LHsiaWQiOjEsIm5hbWUiOiJVU0VSIn0seyJpZCI6MiwibmFtZSI6IkNMVUJfQURNSU4ifV0sImlhdCI6MTc0NjY3MTcxMiwiZXhwIjoxNzQ2NzU4MTEyfQ.gS7ejq-GNtKbX2yZTqdjtucvPypAaqo1Pk7IJX5Zms31cNK6isVtDX-4lmJviz9X'
    });

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
