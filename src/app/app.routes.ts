import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../app/layout/navigation/navigation.component')
      .then(m => m.NavigationComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('../app/features/crawler/crawler-form/crawler-form.component')
          .then(m => m.CrawlerFormComponent),
      },
      {
        path: 'products',
        loadChildren: () => import('./features/products/product.routes')
          .then(m => m.PRODUCT_ROUTES),
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('../app/shared/components/not-found/not-found.component')
      .then(m => m.NotFoundComponent),
  }
];
