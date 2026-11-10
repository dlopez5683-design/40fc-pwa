import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  AuthService,
  RolUsuario
} from '../services/auth.service';


export const roleGuard:
  CanActivateFn =
  route => {

    const authService =
      inject(AuthService);

    const router =
      inject(Router);


    if (
      !authService.estaAutenticado()
    ) {

      return router.createUrlTree([
        '/login'
      ]);

    }


    const rolesPermitidos =
      (
        route.data?.['roles']
        ??
        []
      ) as RolUsuario[];


    const rolActual =
      authService.obtenerRol();


    if (
      rolActual
      &&
      rolesPermitidos.includes(
        rolActual
      )
    ) {

      return true;

    }


    /*
     * Si el usuario tiene sesión,
     * pero intenta entrar al panel
     * equivocado, lo devolvemos
     * a su área correspondiente.
     */

    if (
      rolActual === 'JUGADOR'
    ) {

      return router.createUrlTree([
        '/jugador'
      ]);

    }


    if (
      rolActual === 'ADMIN'
      ||
      rolActual === 'TI'
    ) {

      return router.createUrlTree([
        '/admin'
      ]);

    }


    return router.createUrlTree([
      '/login'
    ]);

  };