import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { JugadorLayout } from './layouts/jugador-layout/jugador-layout';
import { Dashboard } from './pages/jugador/dashboard/dashboard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },

  {
    path: 'jugador',
    component: JugadorLayout,
    children: [
      {
        path: '',
        component: Dashboard
      }
    ]
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];