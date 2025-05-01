// src/app/tribunes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://100.26.187.163/fpc/api/auth';  // Cambia la URL según tu API

  constructor(private http: HttpClient) {}

  login(user:LoginRequest): Observable<any> {
    return this.http.post(this.apiUrl,user);
  }
}

interface LoginRequest {
    email: string;
    password: string;
}
