import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from './login.user';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private baseUrl = 'http://100.26.187.163/fpc/api';
  private imagesEndpoint = '/images/';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getTicketOffers(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/offer/ticket`, { headers }).pipe(
      switchMap(offers => {
        if (!offers || offers.length === 0) return of([]);
        
        const offerRequests = offers.map(offer => 
          this.getImageUrl(offer.imageId).pipe(
            map(imageUrl => ({
              ...offer,
              imageUrl
            }))
        )
        );
        
        return forkJoin(offerRequests);
      })
    );
  }

  getSeasonPassOffers(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/offer/season-pass`, { headers }).pipe(
      switchMap(offers => {
        if (!offers || offers.length === 0) return of([]);
        
        const offerRequests = offers.map(offer => 
          this.getImageUrl(offer.imageId).pipe(
            map(imageUrl => ({
              ...offer,
              imageUrl
            })))
        );
        
        return forkJoin(offerRequests);
      })
    );
  }
    // Método público para obtener imágenes
  getImageUrlPublic(imageId: string): Observable<SafeUrl> {
    return this.getImageUrl(imageId);
  }

  private getImageUrl(imageId: string): Observable<SafeUrl> {
    if (!imageId) return of(this.sanitizer.bypassSecurityTrustUrl('img/llaneros.jpg'));
    const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}${this.imagesEndpoint}${imageId}`, {
      headers,
      responseType: 'text'
    }).pipe(
      map(urlString => {
        const parsed = JSON.parse(urlString);
        const realUrl = parsed.url || 'img/llaneros.jpg';
        return this.sanitizer.bypassSecurityTrustUrl(realUrl);
      })
    );
  }
}