import { Routes } from '@angular/router';
import { AuthenticationLayout } from './layouts/authentication-layout/authentication-layout';
import { guestGuard } from './guards/guest-guard';
import { authenticationGuard } from './guards/authentication-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/scanning',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthenticationLayout,
    canActivate: [guestGuard],
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      {
        path: 'sign-in',
        loadComponent: () =>
          import('./pages/Authentication/sign-in-page/sign-in-page').then((m) => m.SignInPage),
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout').then((m) => m.DashboardLayout),
    canActivate: [authenticationGuard],
    children: [
      {
        path: '',
        redirectTo: 'scanning',
        pathMatch: 'full',
      },
      {
        path: 'scanning',
        loadComponent: () =>
          import('./pages/Dashboard/scanning-page/scanning-page').then((m) => m.ScanningPage),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./pages/error-page/error-page').then((m) => m.ErrorPage),
  },
];
