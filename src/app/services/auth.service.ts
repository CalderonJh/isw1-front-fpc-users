import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseURL = 'http://100.26.187.163/fpc/api/auth'

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<HttpResponse<any>> {
    return this.http.post(`${this.baseURL}/login`, {
      "username": username,
      "password": password
    }, {observe: 'response'});
  }

  getClubs() {
    return this.http.get<any[]>('http://100.26.187.163/fpc/api/su/club/list', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }, observe: 'response'
    })
  }
}
