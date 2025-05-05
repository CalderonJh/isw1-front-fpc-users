// register.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

// Interfaz para los datos de registro
export interface RegisterUser {
  name: string;
  lastName: string;
  email: string;
  documentTypeId: number;
  documentNumber: string;
  gender: string;
  birthDate: string;
  phoneNumber: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private registerUrl = 'http://100.26.187.163/fpc/api/auth/register';

  constructor(private http: HttpClient) { }

  register(user: RegisterUser): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.registerUrl, user, { headers }).pipe(
      catchError(error => {
        console.error('Error en el registro:', error);
        return throwError(() => new Error('Ocurrió un error durante el registro. Por favor, inténtelo nuevamente.'));
      })
    );
  }
}
