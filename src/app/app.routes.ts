import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'deal',
  },
  {
    path: 'deal',
    loadChildren: () => import('./pages/deal/deal.routes'),
  },
];
