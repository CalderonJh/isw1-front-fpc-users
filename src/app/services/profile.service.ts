import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { AuthService } from './login.user';

export interface UserProfile {
  name: string;
  lastName: string;
  email: string;
  documentTypeId: number;
  documentNumber: string;
  gender: string;
  birthDate: string;
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://100.26.187.163/fpc/api';
  private currentProfile = new BehaviorSubject<UserProfile | null>(null);

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtener información del usuario
  getUserProfile(): Observable<UserProfile> {
    const headers = this.getHeaders();
    return this.http.get<UserProfile>(`${this.apiUrl}/user/info`, { headers }).pipe(
      tap(profile => {
        this.currentProfile.next(profile);
      }),
      catchError(error => {
        console.error('Error fetching profile:', error);
        return throwError(() => new Error('Error al cargar el perfil'));
      })
    );
  }

  // Actualizar información del usuario
  updateProfile(profileData: {
    name: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }): Observable<any> {
    const headers = this.getHeaders();


    return this.http.put(`${this.apiUrl}/user/update`, profileData, { headers }).pipe(
      tap(() => {
        // Actualizar el perfil localmente
        const current = this.currentProfile.value;
        if (current) {
          this.currentProfile.next({
            ...current,
            ...profileData
          });
        }
      }),
      catchError(error => {
        console.error('Error updating profile:', error);
        return throwError(() => new Error('Error al actualizar el perfil'));
      })
    );
  }

  // Obtener el perfil actual (observable)
  get profile$(): Observable<UserProfile | null> {
    return this.currentProfile.asObservable();
  }
}
