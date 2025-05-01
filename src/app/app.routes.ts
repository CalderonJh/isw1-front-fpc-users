import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'loginPrueba',
    loadComponent: () =>
      import('./pages/login-page-prueba/login-page-prueba.component').then(
        (m) => m.LoginPagePruebaComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
  },
  {
    path: 'favorite',
    loadComponent: () =>
      import('./pages/favorite-team-page/favorite-team-page.component').then(
        (m) => m.FavoriteTeamPageComponent,
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import(
        './pages/user-profile-page/user-profile-page.component'
      ).then((m) => m.UserProfilePageComponent),
  },
  {
    path: 'dashboardUser',
    loadComponent: () =>
      import(
        './pages/dashboard-user-page/dashboard-user-page.component'
      ).then((m) => m.DashboardPageComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register-page/register-page.component').then(
        (m) => m.RegisterPageComponent,
      ),
  }
];
