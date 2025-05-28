import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full'
  },
  {
    path: 'productos',
    loadComponent: () => import('./tabla-productos/tabla-productos.component').then(m => m.TablaProductosComponent)
  }
];
