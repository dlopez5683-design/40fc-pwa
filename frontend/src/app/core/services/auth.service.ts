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

interface JwtPayload {
  userId?: string;
  rol?: RolUsuario;
  iat?: number;
  exp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:3000/api/auth';


  /* =====================================================
     LOGIN
     ===================================================== */

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

          if (respuesta.jugadorId) {

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


  /* =====================================================
     TOKEN
     ===================================================== */

  obtenerToken(): string | null {

    return localStorage.getItem(
      '40fc_token'
    );

  }


  private obtenerPayloadToken():
    JwtPayload | null {

    const token =
      this.obtenerToken();

    if (!token) {
      return null;
    }

    try {

      const partes =
        token.split('.');

      if (partes.length !== 3) {
        return null;
      }

      const payloadBase64 =
        partes[1]
          .replace(/-/g, '+')
          .replace(/_/g, '/');

      const payload =
        decodeURIComponent(
          atob(payloadBase64)
            .split('')
            .map(
              caracter =>
                '%' +
                (
                  '00' +
                  caracter
                    .charCodeAt(0)
                    .toString(16)
                ).slice(-2)
            )
            .join('')
        );

      return JSON.parse(
        payload
      ) as JwtPayload;

    } catch {

      return null;

    }

  }


  tokenExpirado(): boolean {

    const payload =
      this.obtenerPayloadToken();

    if (!payload?.exp) {
      return true;
    }

    const ahora =
      Math.floor(
        Date.now() / 1000
      );

    return payload.exp <= ahora;

  }


  /* =====================================================
     USUARIO
     ===================================================== */

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


  obtenerRol():
    RolUsuario | null {

    return (
      this.obtenerUsuario()?.rol
      ??
      null
    );

  }


  obtenerJugadorId():
    string | null {

    return localStorage.getItem(
      '40fc_jugador_id'
    );

  }


  /* =====================================================
     ESTADO DE SESIÓN
     ===================================================== */

  estaAutenticado(): boolean {

    const token =
      this.obtenerToken();

    if (!token) {
      return false;
    }

    if (this.tokenExpirado()) {

      this.cerrarSesion();

      return false;

    }

    return true;

  }


  tieneRol(
    rolesPermitidos: RolUsuario[]
  ): boolean {

    const rol =
      this.obtenerRol();

    if (!rol) {
      return false;
    }

    return rolesPermitidos.includes(
      rol
    );

  }


  /* =====================================================
     LOGOUT
     ===================================================== */

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