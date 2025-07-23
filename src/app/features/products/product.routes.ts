import {Routes} from '@angular/router';

// Assume ProductListComponent and ProductDetailComponent are standalone components
// that you have already created within your 'products' feature folder.

export const PRODUCT_ROUTES: Routes = [
  {
    // Path is '' because the parent route will be 'products'.
    // This route will match '/products'
    path: '',
    loadComponent: () => import('./product-list/product-list.component')
      .then(m => m.ProductListComponent),
    title: 'Products' // It's good practice to add a title!
  }
];