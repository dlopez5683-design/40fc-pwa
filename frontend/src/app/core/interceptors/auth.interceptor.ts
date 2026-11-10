import { inject } from '@angular/core';

import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import {
  Router
} from '@angular/router';

import {
  catchError,
  throwError
} from 'rxjs';

import {
  AuthService
} from '../services/auth.service';


export const authInterceptor:
  HttpInterceptorFn =
  (req, next) => {

    const authService =
      inject(AuthService);

    const router =
      inject(Router);


    const token =
      authService.obtenerToken();


    let request = req;


    /*
     * Agregamos JWT únicamente
     * a solicitudes hacia nuestra API.
     */

    if (
      token
      &&
      req.url.startsWith(
        'http://localhost:3000/api'
      )
    ) {

      request =
        req.clone({

          setHeaders: {

            Authorization:
              `Bearer ${token}`

          }

        });

    }


    return next(request)
      .pipe(

        catchError(
          (
            error:
              HttpErrorResponse
          ) => {

            /*
             * Si el backend responde 401,
             * eliminamos la sesión local.
             */

            if (
              error.status === 401
            ) {

              authService
                .cerrarSesion();


              router.navigate([
                '/login'
              ]);

            }


            return throwError(
              () => error
            );

          }
        )

      );

  };