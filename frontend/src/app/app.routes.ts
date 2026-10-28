import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { JugadorLayout } from './layouts/jugador-layout/jugador-layout';
import { Dashboard } from './pages/jugador/dashboard/dashboard';
import { Fondo } from './pages/jugador/fondo/fondo';
import { Partidos } from './pages/jugador/partidos/partidos';
import { Actividades } from './pages/jugador/actividades/actividades';
import { Perfil } from './pages/jugador/perfil/perfil';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AdminDashboard } from './pages/administrador/admin-dashboard/admin-dashboard';
import { Jugadores } from './pages/administrador/jugadores/jugadores';
import { Partidos as PartidosAdmin } from './pages/administrador/partidos/partidos';
import { Tesoreria } from './pages/administrador/tesoreria/tesoreria';

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
},
{
  path: 'perfil',
  component: Perfil
}
    ]
  },

 {
  path: 'admin',
  component: AdminLayout,
  children: [
    {
      path: '',
      component: AdminDashboard
    },
    {
  path: 'jugadores',
  component: Jugadores
},
{
  path: 'partidos',
  component: PartidosAdmin
},
{
  path: 'tesoreria',
  component: Tesoreria
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