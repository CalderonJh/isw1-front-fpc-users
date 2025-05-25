import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, switchMap, forkJoin, of } from 'rxjs';
import { AuthService } from './login.user';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private baseUrl = 'http://100.26.187.163/fpc/api';
  private imagesEndpoint = '/images/';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getTicketStands(ticketId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}/offer/ticket/details/${ticketId}`, { headers });
  }

  getSeasonPassStands(seasonPassId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}/offer/season-pass/details/${seasonPassId}`, { headers });
  }

  registerPurchase(saleId: number, type: 'ticket' | 'pass'): Observable<any> {
    const headers = this.getHeaders();
    const correctedType = type === 'pass' ? 'pass' : type; // Asegura que siempre sea 'pass' si no es 'ticket'
    return this.http.post(`${this.baseUrl}/offer/purchase/${saleId}?type=${correctedType}`, {}, { headers });
  }

  getStadiumImageUrl(imageId: string): Observable<SafeUrl> {
    if (!imageId) return of(this.sanitizer.bypassSecurityTrustUrl('img/llaneros.jpg'));
    const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}${this.imagesEndpoint}${imageId}`, {
      headers,
      responseType: 'text'
    }).pipe(
      map(urlString => {
        const parsed = JSON.parse(urlString);
        const realUrl = parsed.url || 'assets/default-stadium.jpg';
        return this.sanitizer.bypassSecurityTrustUrl(realUrl);
      })
    );
  }
}