import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { JugadorLayout } from './layouts/jugador-layout/jugador-layout';
import { Dashboard } from './pages/jugador/dashboard/dashboard';
import { Fondo } from './pages/jugador/fondo/fondo';
import { Partidos } from './pages/jugador/partidos/partidos';
import { Actividades } from './pages/jugador/actividades/actividades';

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
      },
      {
  path: 'fondo',
  component: Fondo
},
{
  path: 'partidos',
  component: Partidos
},
{
  path: 'actividades',
  component: Actividades
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