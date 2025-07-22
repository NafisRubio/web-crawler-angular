import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../app/layout/navigation/navigation.component')
      .then(m => m.NavigationComponent),
  },
  {
    path: '**',
    loadComponent: () => import('../app/shared/components/not-found/not-found.component')
      .then(m => m.NotFoundComponent),
  }
];
