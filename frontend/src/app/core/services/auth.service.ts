import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export type RolUsuario =
  | 'JUGADOR'
  | 'ADMIN'
  | 'TI';

export interface UsuarioAutenticado {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
}

export interface LoginResponse {
  ok: boolean;
  token: string;

  usuario: UsuarioAutenticado;

  jugadorId: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:3000/api/auth';

  login(
    email: string,
    password: string
  ): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/login`,
        {
          email,
          password
        }
      )
      .pipe(
        tap(respuesta => {

          localStorage.setItem(
            '40fc_token',
            respuesta.token
          );

          localStorage.setItem(
            '40fc_usuario',
            JSON.stringify(
              respuesta.usuario
            )
          );

          if (
            respuesta.jugadorId
          ) {

            localStorage.setItem(
              '40fc_jugador_id',
              respuesta.jugadorId
            );

          } else {

            localStorage.removeItem(
              '40fc_jugador_id'
            );

          }

        })
      );

  }


  obtenerToken(): string | null {

    return localStorage.getItem(
      '40fc_token'
    );

  }


  obtenerUsuario():
    UsuarioAutenticado | null {

    const usuario =
      localStorage.getItem(
        '40fc_usuario'
      );

    if (!usuario) {
      return null;
    }

    try {

      return JSON.parse(
        usuario
      ) as UsuarioAutenticado;

    } catch {

      return null;

    }

  }


  estaAutenticado(): boolean {

    return !!this.obtenerToken();

  }


  obtenerRol():
    RolUsuario | null {

    return (
      this.obtenerUsuario()?.rol
      ??
      null
    );

  }


  cerrarSesion(): void {

    localStorage.removeItem(
      '40fc_token'
    );

    localStorage.removeItem(
      '40fc_usuario'
    );

    localStorage.removeItem(
      '40fc_jugador_id'
    );

  }

}