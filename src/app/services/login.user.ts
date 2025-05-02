import { jwtDecode } from 'jwt-decode';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';

export interface UserToken {
  sub: string;       // ID/email
  name?: string;     // Nombre completo
  documentId?: string;
  roles: string[];   // Roles del usuario
  exp: number;       // Fecha expiración
}
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private loginUrl = 'http://100.26.187.163/fpc/api/auth/login';
  private tokenKey = 'auth_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.isAuthenticatedSubject.next(this.hasValidToken());
  }

  login(credentials: { username: string, password: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.loginUrl, credentials, {
      headers,
      observe: 'response'
    }).pipe(
      tap((response: HttpResponse<any>) => {
        console.log('Respuesta completa:', response); // Debug

        // Opción 1: Buscar token en el header Authorization (formato Bearer)
        let token: string | null = null;
        const authHeader = response.headers.get('Authorization');

        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1];
        }
        // Opción 2: Buscar token en el body (si el backend lo envía ahí)
        else if (response.body?.token) {
          token = response.body.token;
        }
        // Opción 3: Buscar token directo en headers (sin Bearer)
        else {
          token = response.headers.get('Authorization');
        }

        if (!token) {
          throw new Error('No se pudo extraer el token de la respuesta');
        }

        console.log('Token extraído:', token); // Debug
        this.storeToken(token);
        this.isAuthenticatedSubject.next(true);
        this.router.navigate(['/dashboardUser']);
      }),
      catchError(error => {
        console.error('Error en el login:', error);
        return throwError(() => new Error(
          error.error?.message ||
          'Credenciales incorrectas o problema con el servidor'
        ));
      })
    );
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp > now; // Verifica si el token ha expirado
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Método mejorado de redirección
  redirectToDashboard(): void {
    if (this.hasValidToken()) {
      this.router.navigate(['/dashboardUser'], {
        replaceUrl: true // Evita que el usuario vuelva atrás con el botón del navegador
      });
    } else {
      this.router.navigate(['/login'], {
        queryParams: {
          redirectReason: 'token-invalid-or-expired'
        }
      });
    }
  }
  getUserData(): UserToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<UserToken>(token); // Decodificado con tipo
    } catch {
      return null;
    }
  }

}
