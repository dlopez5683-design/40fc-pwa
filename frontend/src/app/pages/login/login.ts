import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  AuthService
} from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);


  email = '';

  password = '';

  cargando = false;

  error = '';


  iniciarSesion(): void {

    this.error = '';


    if (
      !this.email.trim()
      ||
      !this.password
    ) {

      this.error =
        'Ingresa tu correo y contraseña.';

      return;

    }


    this.cargando = true;


    this.authService
      .login(
        this.email.trim(),
        this.password
      )
      .subscribe({

        next: respuesta => {

          this.cargando = false;


          switch (
            respuesta.usuario.rol
          ) {

            case 'ADMIN':

              this.router.navigate([
                '/admin'
              ]);

              break;


            case 'JUGADOR':

              this.router.navigate([
                '/jugador'
              ]);

              break;


            case 'TI':

              /*
               * El panel TI se construirá
               * posteriormente.
               */
              this.router.navigate([
                '/admin'
              ]);

              break;


            default:

              this.authService
                .cerrarSesion();

              this.error =
                'El usuario no tiene un rol válido.';

          }

        },


        error: error => {

          this.cargando = false;


          this.error =
            error?.error?.message
            ??
            'No fue posible iniciar sesión.';

        }

      });

  }

}