import { Routes } from '@angular/router';

import { DealListComponent } from './list/list.component';

export default [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    component: DealListComponent,
  },
] as Routes;
