// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // Importación añadida
import { AuthInterceptor } from './services/auth.interceptor'; // Asegúrate que la ruta es correcta

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule, // Importante para que funcionen las peticiones HTTP
    // ... otros módulos que necesites
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, // Corregido "uscClass" a "useClass"
      multi: true
    }
    // ... otros providers
  ],
   // Asegúrate de tener esto si usas AppComponent
})
export class AppModule { }
