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
        loadComponent: () =>
          import('./pages/Dashboard/home-page/home-page').then((m) => m.HomePage),
      },
      {
        path: 'assets',
        loadComponent: () =>
          import('./pages/Dashboard/assets-page/assets-page').then((m) => m.AssetsPage),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/Dashboard/reports-page/reports-page').then((m) => m.ReportsPage),
      },
      {
        path: 'software',
        loadComponent: () =>
          import('./pages/Dashboard/software-page/software-page').then((m) => m.SoftwarePage),
      },
      {
        path: 'scanning',
        loadComponent: () =>
          import('./pages/Dashboard/scanning-page/scanning-page').then((m) => m.ScanningPage),
      },
      {
        path: 'configuration',
        loadComponent: () =>
          import('./pages/Dashboard/configuration-page/configuration-page').then(
            (m) => m.ConfigurationPage,
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./pages/error-page/error-page').then((m) => m.ErrorPage),
  },
];
