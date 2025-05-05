import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard'; // Asegúrate que la ruta sea correcta

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      )
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register-page/register-page.component').then(
        (m) => m.RegisterPageComponent
      )
  },
  {
    path: 'favorite',
    loadComponent: () =>
      import('./pages/favorite-team-page/favorite-team-page.component').then(
        (m) => m.FavoriteTeamPageComponent
      ),
    canActivate: [AuthGuard] // Protege esta ruta
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/user-profile-page/user-profile-page.component').then(
        (m) => m.UserProfilePageComponent
      ),
    canActivate: [AuthGuard] // Protege esta ruta
  },
  {
    path: 'dashboardUser',
    loadComponent: () =>
      import('./pages/dashboard-user-page/dashboard-user-page.component').then(
        (m) => m.DashboardPageComponent
      ),
    canActivate: [AuthGuard] // Protege esta ruta
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login' // Redirige rutas no encontradas a login
  }
];
